# 🧳 TripGenius - AI-Powered Travel Super-App

An intelligent travel companion that transforms trip planning from hours of research into minutes of conversation with AI. Built with React Native, Node.js, and cutting-edge AI technology.

## 🌟 Key Features

### 🤖 AI Trip Planner
- Conversational trip planning with natural language input
- Generate 3 itinerary variants (Budget/Comfort/Luxury) in seconds
- Smart budget optimization and real-time cost tracking
- Drag-and-drop itinerary editing with item locking

### 📱 Cross-Platform Mobile App
- Native iOS and Android experience from single React Native codebase
- Offline-capable with downloadable trip content
- Beautiful, intuitive UI optimized for mobile-first usage
- Push notifications for trip reminders and deals

### 🎯 Intelligent Recommendations
- AI-powered POI suggestions based on user preferences
- Seasonal timing recommendations and crowd predictions
- Real-time local insights and alternative suggestions
- Community-driven reviews with AI summarization

### 💰 Integrated Booking Platform
- One-click booking for flights, hotels, and activities
- Price comparison across multiple vendors
- Secure payments via Razorpay (India) and Stripe (Global)
- Booking management with confirmations and reminders

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  React Native   │    │   Node.js API    │    │   PostgreSQL    │
│      App        │◄──►│     Gateway      │◄──►│    Database     │
│                 │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                       │
         │                        ▼                       │
         │              ┌──────────────────┐              │
         │              │   AI Services    │              │
         │              │  (OpenAI + RAG)  │              │
         │              └──────────────────┘              │
         │                        │                       │
         ▼                        ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│     Redis       │    │  External APIs   │    │   File Storage  │
│     Cache       │    │ (Booking/Maps)   │    │      (S3)       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- React Native development environment
- OpenAI API key

### Backend Setup
```bash
# Clone repository
cd backend

# Copy environment variables
cp .env.example .env
# Edit .env with your API keys

# Start services with Docker
docker-compose up -d

# Install dependencies
npm install

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

The backend API will be available at `http://localhost:3000`

### Mobile App Setup
```bash
# Install dependencies
npm install

# Start Expo development server
npm run dev

# Open in Expo Go app or simulator
# - Scan QR code with Expo Go (Android)
# - Scan QR code with Camera app (iOS)
```

## 📁 Project Structure

```
├── app/                    # React Native screens
│   ├── (tabs)/            # Tab navigation screens
│   ├── onboarding.tsx     # User onboarding flow
│   └── trip-planner.tsx   # AI trip planning interface
├── components/            # Reusable UI components
├── hooks/                 # Custom React hooks
├── backend/               # Node.js backend services
│   ├── src/
│   │   ├── routes/        # API endpoint definitions
│   │   ├── services/      # Business logic layer
│   │   ├── middleware/    # Express middleware
│   │   └── utils/         # Utility functions
│   └── sql/               # Database schemas and migrations
└── docs/                  # Product documentation
    ├── PRD.md             # Product Requirements Document
    ├── system-architecture.md
    ├── database-schema.md
    ├── api-specification.yaml
    ├── monetization-strategy.md
    └── 90-day-roadmap.md
```

## 🔧 Development

### Environment Setup
1. **Backend**: Copy `backend/.env.example` to `backend/.env` and fill in API keys
2. **Database**: Use Docker Compose for local PostgreSQL + Redis setup  
3. **Mobile**: Expo development client handles most configuration
4. **AI Integration**: Requires OpenAI API key for trip planning features

### API Documentation
- **OpenAPI Spec**: See `docs/api-specification.yaml`
- **Postman Collection**: Available in `docs/postman/`
- **Interactive Docs**: `http://localhost:3000/api/docs` (when running locally)

### Key Scripts
```bash
# Backend development
npm run dev          # Start with hot reload
npm run test         # Run test suite
npm run build        # TypeScript compilation
npm run db:migrate   # Run database migrations

# Mobile development  
npm run dev          # Start Expo dev server
npm run build:web    # Build for web deployment
npm run lint         # Code linting and formatting
```

## 🧪 Testing Strategy

### Backend Testing
- **Unit Tests**: Jest for service layer and utilities
- **Integration Tests**: Supertest for API endpoints
- **Database Tests**: Separate test database with seed data
- **AI Tests**: Mock OpenAI responses for deterministic testing

### Mobile Testing
- **Component Tests**: React Native Testing Library
- **E2E Tests**: Detox for critical user flows
- **Visual Tests**: Screenshots comparison for UI consistency
- **Device Testing**: Real device testing on iOS/Android

### Performance Testing
- **Load Testing**: Artillery for API stress testing
- **Mobile Performance**: Flipper for React Native debugging
- **Database**: Query performance monitoring with indexes

## 🚀 Deployment

### Staging Environment
```bash
# Deploy to staging
docker-compose -f docker-compose.staging.yml up -d

# Run health checks
curl http://staging-api.tripgenius.com/health
```

### Production Deployment
- **Backend**: AWS EKS with auto-scaling
- **Database**: AWS RDS PostgreSQL with Multi-AZ
- **Mobile**: Expo EAS Build for app store deployment
- **CDN**: CloudFront for global asset delivery

### CI/CD Pipeline
- **GitHub Actions**: Automated testing and deployment
- **Quality Gates**: Test coverage >80%, security scanning
- **Blue-Green**: Zero-downtime production deployments

## 📈 Business Metrics

### Month 1 Targets
- 📱 5,000 app downloads
- 👥 2,000 registered users  
- ✈️ 500 trips planned
- 💰 100 bookings completed

### Success Criteria (90 days)
- 📊 60% user activation rate (complete first trip)
- 🎯 25% booking conversion rate
- ⭐ 4.2+ app store rating
- 💵 ₹25L in gross bookings volume

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch (`feature/amazing-feature`)
3. Commit changes with conventional commits
4. Push to branch and create Pull Request
5. Code review and merge to main

### Code Standards
- **TypeScript**: Strict mode with comprehensive typing
- **ESLint**: Enforced code style and best practices
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for quality checks

## 📄 License & Legal

- **Code License**: MIT License
- **Content License**: All travel content and data subject to fair use
- **Privacy**: GDPR and Indian data protection compliant
- **Terms**: See `docs/legal/terms-of-service.md`

## 🆘 Support & Resources

### Documentation
- 📖 **Product Requirements**: `docs/PRD.md`
- 🏗️ **System Architecture**: `docs/system-architecture.md`  
- 🗄️ **Database Schema**: `docs/database-schema.md`
- 📈 **Growth Strategy**: `docs/growth-strategy.md`

### Community & Support
- 💬 **Discord**: [Join our developer community](https://discord.gg/tripgenius)
- 🐛 **Bug Reports**: GitHub Issues with detailed reproduction steps
- 💡 **Feature Requests**: GitHub Discussions for community input
- 📧 **Contact**: dev@tripgenius.com

---

**Built with ❤️ by the TripGenius team**

*Ready to revolutionize travel planning with AI? Start by running the demo and exploring our comprehensive documentation.*