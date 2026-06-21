"""Traffic detection pipeline and FastAPI application.

This is the API-friendly conversion of jupyter_notebook/main_file.ipynb.
Run from the repository root with:
    uvicorn python.main:app --reload
"""

from __future__ import annotations

import json
import re
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import cv2
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.concurrency import run_in_threadpool
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles


BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "models"
INPUT_DIR = BASE_DIR / "input_images"
OUTPUT_DIR = BASE_DIR / "output_images"
RESULT_PATH = OUTPUT_DIR / "latest_result.json"
INPUT_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)

OUTPUT_FILES = {
    "vehicle_detection": "Vehicle and Road User Detection.jpg",
    "traffic_violation": "Traffic Violation.jpg",
    "violation_plates": "violation number plates.jpg",
    "number_plates": "number plates.jpg",
}

# One source of truth for both OpenCV boxes and frontend legends.
COLORS = {
    "car": "#3b82f6",
    "motorcycle": "#ef4444",
    "rider": "#06b6d4",
    "pedestrian": "#f97316",
    "bus": "#d946ef",
    "truck": "#a3e635",
    "bicycle": "#22c55e",
    "helmet_violation": "#ff9d19",
    "triple_riding": "#ff4f78",
}

TRAFFIC_CLASSES = {0: "person", 1: "bicycle", 2: "car", 3: "motorcycle", 5: "bus", 7: "truck"}
DISPLAY_NAMES = {
    "car": "Car",
    "motorcycle": "Motorcycle",
    "rider": "Rider",
    "pedestrian": "Pedestrian",
    "bus": "Bus",
    "truck": "Truck",
    "bicycle": "Bicycle",
}

_models: dict[str, Any] = {}


def hex_to_bgr(value: str) -> tuple[int, int, int]:
    value = value.lstrip("#")
    red, green, blue = (int(value[index:index + 2], 16) for index in (0, 2, 4))
    return blue, green, red


def get_models() -> tuple[Any, Any, Any, Any]:
    """Load expensive models once, on the first detection request."""
    if _models:
        return _models["traffic"], _models["helmet"], _models["plate"], _models["ocr"]

    from ultralytics import YOLO
    import easyocr

    _models["traffic"] = YOLO(str(MODEL_DIR / "yolov8n.pt"))
    _models["helmet"] = YOLO(str(MODEL_DIR / "hemletYoloV8_100epochs.pt"))
    _models["plate"] = YOLO(str(MODEL_DIR / "license_plate_detector.pt"))
    _models["ocr"] = easyocr.Reader(["en"], gpu=False, verbose=False)
    return _models["traffic"], _models["helmet"], _models["plate"], _models["ocr"]


def overlap_ratio(first: tuple[int, int, int, int], second: tuple[int, int, int, int]) -> float:
    x1, y1, x2, y2 = first
    a1, b1, a2, b2 = second
    intersection = max(0, min(x2, a2) - max(x1, a1)) * max(0, min(y2, b2) - max(y1, b1))
    return intersection / max(1, (x2 - x1) * (y2 - y1))


def center_inside(box: tuple[int, int, int, int], region: tuple[int, int, int, int]) -> bool:
    x1, y1, x2, y2 = box
    center_x, center_y = (x1 + x2) // 2, (y1 + y2) // 2
    left, top, right, bottom = region
    return left <= center_x <= right and top <= center_y <= bottom


def draw_labelled_box(image: Any, box: tuple[int, int, int, int], label: str, color: tuple[int, int, int], width: int = 2) -> None:
    x1, y1, x2, y2 = box
    cv2.rectangle(image, (x1, y1), (x2, y2), color, width)
    (text_width, text_height), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.52, 1)
    label_top = max(0, y1 - text_height - 8)
    cv2.rectangle(image, (x1, label_top), (x1 + text_width + 6, y1), color, -1)
    cv2.putText(image, label, (x1 + 3, max(text_height, y1 - 4)), cv2.FONT_HERSHEY_SIMPLEX, 0.52, (255, 255, 255), 1)


def read_plate(image: Any, box: tuple[int, int, int, int], reader: Any) -> str:
    x1, y1, x2, y2 = box
    height, width = image.shape[:2]
    crop = image[max(0, y1):min(height, y2), max(0, x1):min(width, x2)]
    if crop.size == 0:
        return "UNREADABLE"
    crop = cv2.resize(crop, None, fx=3, fy=3, interpolation=cv2.INTER_CUBIC)
    gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
    _, threshold = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    text = " ".join(reader.readtext(threshold, detail=0, paragraph=True)).upper().strip()
    cleaned = "".join(character for character in text if character.isalnum() or character == " ").strip()
    return cleaned or "UNREADABLE"


def check_helmet(image: Any, rider: dict[str, Any], helmet_model: Any) -> dict[str, Any]:
    x1, y1, x2, y2 = rider["bbox"]
    head_bottom = y1 + int((y2 - y1) * 0.45)
    crop = image[max(0, y1):max(0, head_bottom), max(0, x1):max(0, x2)]
    if crop.size == 0:
        return {"has_helmet": False, "confidence": 0.0, "label": "empty crop"}

    result = helmet_model.predict(source=crop, conf=0.35, verbose=False)[0]
    if len(result.boxes) == 0:
        return {"has_helmet": False, "confidence": 0.5, "label": "no detection"}

    best = max(result.boxes, key=lambda box: float(box.conf[0]))
    label = str(helmet_model.names[int(best.cls[0])]).lower().strip()
    no_helmet_terms = ("no helmet", "no_helmet", "no-helmet", "without helmet")
    has_helmet = "helmet" in label and not any(term in label for term in no_helmet_terms)
    return {"has_helmet": has_helmet, "confidence": float(best.conf[0]), "label": label}


def image_urls() -> dict[str, str]:
    return {key: f"/output/{filename}" for key, filename in OUTPUT_FILES.items()}


def empty_result() -> dict[str, Any]:
    return {
        "status": "waiting_for_upload",
        "processed_at": None,
        "input_image": None,
        "images": image_urls(),
        "colors": COLORS,
        "summary": {
            "total_vehicles": 0,
            "total_road_users": 0,
            "violations_detected": 0,
            "unique_number_plates": 0,
        },
        "detections": [
            {"key": key, "label": DISPLAY_NAMES[key], "count": 0, "average_confidence": 0, "color": COLORS[key]}
            for key in DISPLAY_NAMES
        ],
        "violations": [
            {"key": "helmet_violation", "label": "Helmet Violation", "count": 0, "average_confidence": 0, "color": COLORS["helmet_violation"]},
            {"key": "triple_riding", "label": "Triple Riding", "count": 0, "average_confidence": 0, "color": COLORS["triple_riding"]},
        ],
        "plates": [],
        "violation_plates": [],
    }


def process_image(input_path: Path) -> dict[str, Any]:
    traffic_model, helmet_model, plate_model, ocr_reader = get_models()
    image = cv2.imread(str(input_path))
    if image is None:
        raise ValueError("The uploaded file is not a readable image.")

    traffic_result = traffic_model.predict(
        source=image,
        conf=0.40,
        classes=list(TRAFFIC_CLASSES),
        verbose=False,
    )[0]

    detections: list[dict[str, Any]] = []
    for box in traffic_result.boxes:
        class_id = int(box.cls[0])
        detections.append({
            "key": TRAFFIC_CLASSES.get(class_id, "unknown"),
            "confidence": float(box.conf[0]),
            "bbox": tuple(map(int, box.xyxy[0])),
        })

    motorcycles = [item for item in detections if item["key"] == "motorcycle"]
    for detection in detections:
        if detection["key"] == "person":
            riding = any(overlap_ratio(detection["bbox"], motorcycle["bbox"]) >= 0.20 for motorcycle in motorcycles)
            detection["key"] = "rider" if riding else "pedestrian"

    riders = [item for item in detections if item["key"] == "rider"]
    violations: list[dict[str, Any]] = []

    for motorcycle in motorcycles:
        linked_riders = [rider for rider in riders if overlap_ratio(rider["bbox"], motorcycle["bbox"]) >= 0.20]
        if len(linked_riders) >= 3:
            confidence = min([motorcycle["confidence"], *[rider["confidence"] for rider in linked_riders]])
            violations.append({
                "key": "triple_riding",
                "label": "Triple Riding",
                "confidence": confidence,
                "bbox": motorcycle["bbox"],
                "detail": f"{len(linked_riders)} riders on one motorcycle",
                "vehicle_type": "Motorcycle",
            })

    for rider in riders:
        helmet = check_helmet(image, rider, helmet_model)
        if not helmet["has_helmet"]:
            violations.append({
                "key": "helmet_violation",
                "label": "Helmet Violation",
                "confidence": helmet["confidence"],
                "bbox": rider["bbox"],
                "detail": f"Rider without helmet ({helmet['label']})",
                "vehicle_type": "Motorcycle",
            })

    plate_result = plate_model.predict(source=image, conf=0.40, verbose=False)[0]
    plates: list[dict[str, Any]] = []
    for box in plate_result.boxes:
        bbox = tuple(map(int, box.xyxy[0]))
        plates.append({
            "text": read_plate(image, bbox, ocr_reader),
            "confidence": float(box.conf[0]),
            "bbox": bbox,
            "violation": None,
            "vehicle_type": "Vehicle",
        })

    for violation in violations:
        x1, y1, x2, y2 = violation["bbox"]
        region = (x1 - 80, y1 - 80, x2 + 80, y2 + 80)
        candidates = [plate for plate in plates if center_inside(plate["bbox"], region)]
        matched = max(candidates, key=lambda plate: plate["confidence"]) if candidates else None
        violation["plate"] = matched["text"] if matched else "NOT DETECTED"
        violation["plate_confidence"] = matched["confidence"] if matched else 0.0
        if matched:
            matched["violation"] = violation["label"]
            matched["vehicle_type"] = violation["vehicle_type"]

    vehicle_image = image.copy()
    for detection in detections:
        key = detection["key"]
        if key in COLORS:
            draw_labelled_box(vehicle_image, detection["bbox"], f"{DISPLAY_NAMES[key]} {detection['confidence']:.2f}", hex_to_bgr(COLORS[key]))

    violation_image = image.copy()
    for violation in violations:
        draw_labelled_box(violation_image, violation["bbox"], f"{violation['label']} {violation['confidence']:.2f}", hex_to_bgr(COLORS[violation["key"]]), 3)

    all_plate_image = image.copy()
    for plate in plates:
        draw_labelled_box(all_plate_image, plate["bbox"], plate["text"], (80, 200, 0), 2)

    violation_plate_image = image.copy()
    for violation in violations:
        draw_labelled_box(violation_plate_image, violation["bbox"], f"{violation['label']} | {violation['plate']}", hex_to_bgr(COLORS[violation["key"]]), 3)
        matched = next((plate for plate in plates if plate["text"] == violation["plate"]), None)
        if matched:
            draw_labelled_box(violation_plate_image, matched["bbox"], matched["text"], (0, 220, 255), 2)

    cv2.imwrite(str(OUTPUT_DIR / OUTPUT_FILES["vehicle_detection"]), vehicle_image)
    cv2.imwrite(str(OUTPUT_DIR / OUTPUT_FILES["traffic_violation"]), violation_image)
    cv2.imwrite(str(OUTPUT_DIR / OUTPUT_FILES["number_plates"]), all_plate_image)
    cv2.imwrite(str(OUTPUT_DIR / OUTPUT_FILES["violation_plates"]), violation_plate_image)

    counts = Counter(item["key"] for item in detections)
    detection_details = []
    for key, label in DISPLAY_NAMES.items():
        matching = [item for item in detections if item["key"] == key]
        average = sum(item["confidence"] for item in matching) / len(matching) if matching else 0
        detection_details.append({
            "key": key,
            "label": label,
            "count": counts[key],
            "average_confidence": round(average * 100, 1),
            "color": COLORS[key],
        })

    violation_details = []
    for key, label in (("helmet_violation", "Helmet Violation"), ("triple_riding", "Triple Riding")):
        matching = [item for item in violations if item["key"] == key]
        average = sum(item["confidence"] for item in matching) / len(matching) if matching else 0
        vehicle_types = list({item["vehicle_type"] for item in matching}) if matching else []
        violation_details.append({
            "key": key,
            "label": label,
            "count": len(matching),
            "average_confidence": round(average * 100, 1),
            "color": COLORS[key],
            "vehicle_type": vehicle_types[0] if len(vehicle_types) == 1 else (vehicle_types if vehicle_types else None),
        })

    vehicle_keys = ("car", "motorcycle", "bus", "truck")
    road_user_keys = ("rider", "pedestrian", "bicycle")
    result = {
        "status": "completed",
        "processed_at": datetime.now(timezone.utc).isoformat(),
        "input_image": f"/input/{input_path.name}",
        "images": image_urls(),
        "colors": COLORS,
        "summary": {
            "total_vehicles": sum(counts[key] for key in vehicle_keys),
            "total_road_users": sum(counts[key] for key in road_user_keys),
            "violations_detected": len(violations),
            "unique_number_plates": len({plate["text"] for plate in plates if plate["text"] != "UNREADABLE"}),
        },
        "detections": detection_details,
        "violations": violation_details,
        "plates": [
            {
                "text": plate["text"],
                "confidence": round(plate["confidence"] * 100, 1),
                "violation": plate["violation"] or "No Violation",
                "vehicle_type": plate["vehicle_type"],
            }
            for plate in plates
        ],
        "violation_plates": [
            {
                "plate": item["plate"],
                "plate_confidence": round(item["plate_confidence"] * 100, 1),
                "violation": item["label"],
                "confidence": round(item["confidence"] * 100, 1),
                "vehicle_type": item["vehicle_type"],
                "detail": item["detail"],
            }
            for item in violations
        ],
    }
    RESULT_PATH.write_text(json.dumps(result, indent=2), encoding="utf-8")
    return result


app = FastAPI(title="Smart Traffic Enforcement API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "https://smart-traffic-enforcement-system.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/output", StaticFiles(directory=OUTPUT_DIR), name="output")
app.mount("/input", StaticFiles(directory=INPUT_DIR), name="input")


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/results")
def latest_results() -> dict[str, Any]:
    if not RESULT_PATH.exists():
        return empty_result()
    return json.loads(RESULT_PATH.read_text(encoding="utf-8"))


@app.post("/api/detect")
async def detect(file: UploadFile = File(...)) -> dict[str, Any]:
    suffix = Path(file.filename or "").suffix.lower()
    if suffix not in {".jpg", ".jpeg", ".png"}:
        raise HTTPException(status_code=400, detail="Only JPG, JPEG and PNG images are supported.")

    contents = await file.read(10 * 1024 * 1024 + 1)
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Image must be 10MB or smaller.")

    safe_stem = re.sub(r"[^a-zA-Z0-9_-]", "_", Path(file.filename or "upload").stem)[:60]
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
    input_path = INPUT_DIR / f"{timestamp}_{safe_stem}{suffix}"
    input_path.write_bytes(contents)

    try:
        return await run_in_threadpool(process_image, input_path)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Detection failed: {error}") from error
