# 🛡️ CTIA: Cyber Threat Intelligence Analysis Pipeline

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![Python](https://img.shields.io/badge/Python-3.10+-blue?style=for-the-badge&logo=python)
![Flask](https://img.shields.io/badge/Flask-Waitress-lightgrey?style=for-the-badge&logo=flask)
![ChromaDB](https://img.shields.io/badge/ChromaDB-Vector_Store-orange?style=for-the-badge)
![Ollama](https://img.shields.io/badge/Ollama-Qwen_2.5-white?style=for-the-badge)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker)

A **Strict Modular Retrieval-Augmented Generation (RAG)** architecture designed to autonomously analyze, extract, and map CVE (Common Vulnerabilities and Exposures) records to the MITRE ATT&CK framework. 

This project serves as the core implementation for a Bachelor's Thesis in Information Systems at **Universitas Trunojoyo Madura**.

---

## 🏗️ System Architecture

This project is built as a **Monorepo** decoupling the client interface from the heavy AI inference engine, ensuring scalable performance and secure API routing.

* **Frontend (`/ctia-gui`)**: A responsive, server-side rendered interface built with Next.js, React, TypeScript, and Tailwind CSS. Features a custom API Route (BFF) with strict rate-limiting (5 requests/minute) to prevent backend LLM overload.
* **Backend (`/ctia-be`)**: A robust Python/Flask microservice served via Waitress. It handles the vector database routing, prompt engineering, and LLM inference.
* **AI Engine**: Utilizes **Qwen 2.5 / Llama 3.1** running locally via Ollama, paired with **BAAI/bge-m3** embeddings for multilingual, high-dimensional vector search.
* **Database**: **ChromaDB** for persistent, local vector storage of cleaned CVE datasets and MITRE ATT&CK mitigation data.

## 📂 Repository Structure

    CTIA/
    ├── ctia-be/                 # Backend AI Engine
    │   ├── core.py              # Flask API & LlamaIndex RAG Pipeline
    │   ├── requirements.txt     # Python Dependencies
    │   ├── Dockerfile           # GPU-Accelerated Container Build
    │   └── chroma_db/           # Local Vector Storage (Ignored in Git)
    │
    ├── ctia-gui/                # Frontend User Interface
    │   ├── app/                 # Next.js App Router & API Endpoints
    │   ├── components/          # Shadcn UI & Custom Components
    │   ├── package.json         # Node Dependencies
    │   └── Dockerfile           # Lightweight Node.js Container Build
    │
    ├── docker-compose.yml       # Monorepo Orchestration
    └── README.md                # Project Documentation

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v18+)
* **Python** (3.10+)
* **Ollama** installed on the host machine (running Qwen 2.5)
* **NVIDIA GPU** (RTX 3050 Ti or higher recommended) for CUDA acceleration.

### Option A: Run via Docker (Recommended)
The entire architecture can be spun up in isolated containers with automatic GPU passthrough.

    # Build and boot the Monorepo
    docker-compose up --build

*Frontend will be available at `http://localhost:3000`*

### Option B: Run Locally (Development)
**1. Start the Backend:**

    cd ctia-be
    python -m venv venv
    source venv/bin/activate  # On Windows: .\venv\Scripts\activate
    pip install -r requirements.txt
    python core.py


**2. Start the Frontend:**

    cd ctia-gui
    npm install
    npm run dev


## 🧠 Evaluation Metrics
The generation accuracy and context precision of this RAG pipeline are evaluated using the **RAGAS** metric framework, focusing on Context Precision, Context Recall, Faithfulness, and Answer Relevancy against a custom ground-truth dataset.

---
**Author:** Mohammad Rifqi Razzan Pratama (Rielf)  
**Institution:** Universitas Trunojoyo Madura | Information Systems
