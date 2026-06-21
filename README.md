# 🚦 Smart Traffic Enforcement System

An AI-powered traffic enforcement application that analyzes traffic images to detect vehicles, identify traffic violations (helmet violations & triple riding), and recognize license plates via OCR. Presented through a modern dark-themed web dashboard.

---

## ✨ Features

- **Vehicle & Road User Detection** — Detects cars, motorcycles, buses, trucks, bicycles, pedestrians, and riders using YOLOv8
- **Helmet Violation Detection** — Identifies motorcycle riders not wearing helmets using a custom-trained YOLOv8 model
- **Triple Riding Detection** — Detects motorcycles with more than two riders
- **License Plate Recognition** — Detects license plates and performs OCR via EasyOCR
- **Violation-Plate Correlation** — Links each violation to nearby detected plates
- **Interactive Dashboard** — Dark-themed web UI with visual analytics, confidence scores, and annotated images

---

## 🧱 Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Python 3.10+ | Core language |
| FastAPI | Web API framework |
| Uvicorn | ASGI server |
| Ultralytics YOLOv8 | Object detection models |
| OpenCV | Image processing |
| EasyOCR | License plate OCR |

### Frontend
| Technology | Purpose |
|---|---|
| React | UI library |
| Vite | Build tool & dev server |
| Tailwind CSS | Styling |

---

## 📁 Project Structure

```
Smart_Traffic_Enforcement_System/
├── python/                    # Backend (FastAPI)
│   ├── main.py                # API + detection pipeline
│   ├── requirements.txt       # Python dependencies
│   ├── models/                # YOLOv8 model weights
│   │   ├── yolov8n.pt                  # General detection
│   │   ├── hemletYoloV8_100epochs.pt   # Helmet detection (custom)
│   │   └── license_plate_detector.pt   # License plate detection
│   ├── input_images/          # Uploaded images
│   ├── output_images/         # Annotated results
│   └── jupyter_notebook/      # Development notebooks
├── ui/                        # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Dashboard pages
│   │   └── assets/            # Static assets
│   ├── package.json
│   └── vite.config.js
├── .vscode/
│   └── settings.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm

### Backend Setup

```bash
cd python
pip install -r requirements.txt
```

Start the API server:

```bash
uvicorn python.main:app --reload
```

The API will be available at `http://localhost:8000`.

### Frontend Setup

```bash
cd ui
npm install
```

Start the development server:

```bash
npm run dev
```

The UI will be available at `http://localhost:5173` (proxies API requests to the backend).

For production build:

```bash
npm run build
npm run preview
```

---

## 🖥️ Usage

1. Open the frontend in a browser
2. Click **"Start Detection"**
3. Upload a traffic image (JPG/PNG, max 10MB)
4. Click **"Detect Now"**
5. View results on the **Dashboard** with annotated images, violation details, and license plates

### API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| POST | `/api/detect` | Upload image & run detection (multipart form, field: `file`) |
| GET | `/api/results` | Get latest detection results |

---

## 🧠 Detection Pipeline

1. **Vehicle & Road User Detection** — YOLOv8 nano detects cars, motorcycles, buses, trucks, persons, bicycles
2. **Rider Classification** — Persons overlapping with motorcycles are classified as riders
3. **Triple Riding Detection** — Flags motorcycles with 3+ riders
4. **Helmet Violation Detection** — Crops rider bounding boxes and runs custom helmet model
5. **License Plate Detection + OCR** — Detects plates and reads text via EasyOCR
6. **Violation-Plate Correlation** — Associates violations with nearby plates

---

## 📊 Output

The system generates four annotated images:
- **Vehicle and Road User Detection** — All detected objects with bounding boxes
- **Traffic Violation** — Highlighted violations (helmet, triple riding)
- **Number Plates** — Detected license plates with OCR text
- **Violation Number Plates** — Violations paired with their associated plates

Results are also saved as JSON (`latest_result.json`).

---

## 📸 Sample Results

Detection examples with bounding boxes, confidence scores, and license plate text are generated for each uploaded image.

---

## 🛠️ Development

- Backend Jupyter notebooks are available in `python/jupyter_notebook/` for prototyping
- The detection pipeline in `python/main.py` is adapted from `main_file.ipynb`
- Frontend uses Vite's HMR for rapid UI development

---

This project is for educational and research purposes.
