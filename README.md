Perfect 👍 Since this is a **student/project showcase** and not a **published app/startup**, we’ll tone down business/production language and reframe it as a **prototype / learning project**. I’ll simplify and keep it professional so you can use it on GitHub or in your resume.

Here’s the revised version:

---

# 🧳 TripGenius – AI-Powered Travel Planner (Prototype Project)

A prototype travel assistant built as a personal project to explore AI integration in trip planning. TripGenius demonstrates how AI can turn hours of research into minutes by generating itineraries, budgets, and recommendations through a mobile-first app. It is built with React Native for the frontend and Node.js/Express with PostgreSQL for the backend.

## 🌟 Key Features (Prototype)

### 🤖 AI Trip Planner

* Conversational trip planning with natural language input
* Generates multiple itinerary options (Budget/Comfort/Luxury)
* Smart budget estimation and expense tracking

### 📱 Mobile-First Design

* React Native (Expo) app working on Android/iOS simulators
* Simple, intuitive UI for quick planning
* Offline-ready demo with sample data

### 🎯 Intelligent Recommendations

* AI-powered points of interest based on preferences
* Seasonal and crowd recommendations (demo responses)
* Community reviews summarized with AI

### 💰 Booking Simulation

* Demo booking flow for flights, hotels, and activities
* Price comparison mock-up for multiple vendors
* Secure payment simulation (Razorpay/Stripe integration planned)

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  React Native   │    │   Node.js API    │    │   PostgreSQL    │
│      App        │◄──►│     Gateway      │◄──►│    Database     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │
         ▼                        ▼
┌─────────────────┐    ┌──────────────────┐
│   AI Services   │    │  External APIs   │
│ (OpenAI / RAG)  │    │ (Maps, Booking)  │
└─────────────────┘    └──────────────────┘
```

## 🚀 Getting Started (Local Demo)

### Prerequisites

* Node.js 18+
* Docker & Docker Compose (for backend and DB)
* React Native development environment
* OpenAI API key (for AI features)

### Backend Setup

```bash
cd backend
cp .env.example .env   # Add keys manually
docker-compose up -d   # Start DB
npm install
npm run dev            # Run backend server
```

### Mobile App Setup

```bash
cd app
npm install
npm run dev   # Start Expo development server
```

---

## 📁 Project Structure

* **app/** – React Native frontend (screens, components, hooks)
* **backend/** – Node.js/Express backend (routes, services, middleware)
* **docs/** – Documentation (PRD, system architecture, database schema)

---

## 🔧 Development Notes

* This project is **not published**; it is a **prototype built for learning** and showcasing full-stack + AI integration.
* Some features are simulated or mocked for demonstration purposes (e.g., bookings, payments).
* Future work includes refining UI, improving AI prompts, and integrating real booking APIs.

---

**Built as a personal project to explore MEAN/React Native development and AI integration in travel planning.**

---


