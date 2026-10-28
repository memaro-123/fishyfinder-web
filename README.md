# FishyFinder Web

FishyFinder is a client-side web application for identifying 14 common California coastal fish species. The application runs entirely inside the browser using WebAssembly and ONNX Runtime Web, requiring no backend servers or external API calls for inference.

---

## Overview

Traditional computer vision deployments often rely on server-side GPU instances to process uploaded images, introducing network latency and cloud infrastructure costs. FishyFinder solves this by executing a quantized MobileNetV2 neural network directly on the user's device via client-side WebAssembly (WASM). 

Uploaded images are preprocessed on an HTML5 Canvas, passed directly into the WebAssembly runtime, and classified with sub-second inference times.

---

## Key Features

- **Client-Side Machine Learning**: Complete privacy and zero backend compute costs. Images never leave the client's machine.
- **Interactive Classifier**: Drag-and-drop image upload with real-time confidence scores and ground-truth verification tools.
- **Live Scanner Simulation**: Auto-cycling demonstration feed featuring telemetry and scanner animations across sample specimens.
- **Serverless Deployment**: Built with Vite and React, configured for automatic continuous deployment via GitHub Pages.

---

## Machine Learning Specifications

- **Base Architecture**: MobileNetV2
- **Runtime Engine**: Microsoft ONNX Runtime Web (`onnxruntime-web`) via WASM
- **Model File**: `public/model/fish_model.onnx` (~11-14 MB)
- **Input Tensor**: `[1, 224, 224, 3]` (RGB, channels-last)
- **Normalization**: Pixel values mapped to `[0.0, 1.0]` (`data[i] / 255.0`)
- **Output**: 14 class probabilities

### Supported Species

The model predicts across 14 California marine species mapped strictly by index:

| Index | Common Name | Model Class Label |
|---|---|---|
| 0 | California Corbina | Corbina |
| 1 | Leopard Shark | Lepord |
| 2 | Pacific Mackerel | Mackrel |
| 3 | Barred Sand Bass | barredSandBass |
| 4 | Barred Surfperch | barredSurfPerch |
| 5 | Bat Ray | batRay |
| 6 | Garibaldi | garibaldi |
| 7 | California Halibut | halibut |
| 8 | Jacksmelt | jackSmelt |
| 9 | Lizardfish | lizardFish |
| 10 | Shovelnose Guitarfish | shovelnoseGuitarFish |
| 11 | Spotfin Croaker | spotfinCroaker |
| 12 | Round Stingray | stingRay |
| 13 | Yellowfin Croaker | yellowFinCroaker |

---

## Project Structure

```text
fishyfinder-web/
├── .github/
│   └── workflows/
│       └── deploy.yml            # Automated GitHub Pages CI/CD
├── public/
│   ├── examples/                 # Sample images for the live scanner
│   └── model/
│       └── fish_model.onnx       # ONNX runtime model weights
├── src/
│   ├── components/
│   │   ├── ImageClassifier.jsx   # Drag-and-drop file inference component
│   │   ├── LiveGuesser.jsx       # Automated scanner demo with telemetry
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   └── Footer.jsx
│   ├── config/
│   │   ├── evaluationData.js     # Accuracy benchmarks and evaluation sets
│   │   └── speciesConfig.js      # Species definitions, names, and index maps
│   ├── services/
│   │   └── predictionService.js  # ONNX session lifecycle and inference logic
│   ├── App.css                   # Custom design system styling
│   ├── App.jsx                   # Application root
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js