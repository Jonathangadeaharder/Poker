# 🎮 Poker Training Pro - React Native App

A gamified poker training application with adaptive learning, spaced repetition, and comprehensive analytics. Learn poker strategy the smart way!

## ✨ Features

### 🎯 Core Learning Systems
- **Spaced Repetition (SM-2)**: Scientifically-proven flashcard system for long-term retention
- **Adaptive Difficulty Engine**: Automatically adjusts to your skill level
- **Gamification**: XP, levels, achievements, and daily streaks
- **Multiple Game Modes**: Quizzes, speed drills, range trainer, push/fold charts

### 📚 Content Areas
- **NLH Cash Games**: Preflop ranges, postflop play, exploitative strategies
- **PLO Training**: 25+ questions covering Omaha-specific concepts
- **MTT Strategy**: 67+ questions on tournament play (early, middle, late, bubble, FT)
- **Exploitative Play**: Player type identification and adjustment strategies

### 📊 Analytics & Tracking
- **Performance Dashboard**: Charts showing progress over time
- **Weak Area Identification**: Focus on categories needing improvement
- **Study Time Tracking**: Monitor your learning investment
- **Achievement System**: Unlock badges and milestones

### 🔄 Advanced Features
- **Cloud Sync**: Backup progress across devices
- **Hand History Upload**: Analyze your poker hands
- **Onboarding Flow**: Interactive tutorial for new users
- **Offline Support**: Study without internet connection

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ installed
- Expo CLI installed globally: `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Studio (all platforms)

### Installation

```bash
# Clone the repository
git clone https://github.com/Jonathangadeaharder/Poker.git
cd Poker

# Install dependencies
npm install

# Start the development server
npm start

# Run on iOS (Mac only)
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

### Quick Start

1. Install dependencies: `npm install`
2. Start Expo: `npm start`
3. Open Expo Go app on your phone
4. Scan QR code from terminal
5. Start learning!

## 📁 Project Structure

```
Poker/
├── src/
│   ├── core/                 # Core systems
│   │   ├── gamification.js   # XP, levels, achievements
│   │   ├── spacedRepetition.js  # SM-2 algorithm
│   │   ├── adaptiveEngine.js    # Difficulty adjustment
│   │   └── soundManager.js      # Audio feedback
│   ├── data/                 # Static content
│   │   ├── ploQuestions.js   # PLO training content
│   │   ├── nlheMttQuestions.js  # MTT strategy
│   │   ├── exploitativeStrategies.js
│   │   └── ...
│   ├── screens/              # UI screens
│   │   ├── HomeScreen.js
│   │   ├── QuizGameScreen.js
│   │   ├── PLOTrainingScreen.js
│   │   ├── AnalyticsScreen.js
│   │   └── ...
│   ├── components/           # Reusable components
│   │   ├── XPBar.js
│   │   ├── ErrorBoundary.js  # NEW
│   │   ├── LoadingSpinner.js # NEW
│   │   └── ...
│   ├── services/             # API & services
│   │   ├── apiClient.js      # Backend communication
│   │   └── syncService.js    # Cloud sync
│   ├── hooks/                # Custom hooks
│   │   ├── useAsyncData.js   # NEW
│   │   └── useSyncService.js # NEW
│   └── utils/                # Utilities
│       ├── validation.js     # NEW
│       └── secureStorage.js  # NEW
├── __tests__/                # Unit tests
├── docs/                     # Documentation
│   ├── USER_GUIDE.md
│   ├── DEVELOPER_GUIDE.md
│   └── CODE_REVIEW_FINDINGS.md
├── App.js                    # Root component
└── package.json
```

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm test -- --watch

# Run specific test file
npm test gamification.test.js
```

## 🛠 Development

### Adding New Questions

1. Create or edit question file in `src/data/`
2. Follow the question format:
```javascript
{
  id: 'unique_id',
  category: 'category_name',
  difficulty: 'medium',
  question: 'Your question?',
  answers: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
  correctAnswer: 'Option 2',
  explanation: 'Why this is correct...',
  points: 15,
}
```
3. Import in relevant screen
4. Test the new questions

### Code Style

- Follow Airbnb React/JSX style guide
- Use ESLint: `npm run lint`
- Format with Prettier: `npm run format`

### Commit Messages

```
feat: Add PLO training screen
fix: Resolve streak calculation bug
docs: Update developer guide
test: Add tests for adaptive engine
```

## 📖 Documentation

- **[User Guide](docs/USER_GUIDE.md)**: How to use the app
- **[Developer Guide](docs/DEVELOPER_GUIDE.md)**: Technical documentation
- **[Code Review](CODE_REVIEW_FINDINGS.md)**: Improvement roadmap

## 🔒 Security

- Tokens stored in expo-secure-store (encrypted)
- Input validation on all forms
- Session timeout after 15 minutes
- No sensitive data in logs

## 🐛 Known Issues

See [CODE_REVIEW_FINDINGS.md](CODE_REVIEW_FINDINGS.md) for complete list

Critical fixes applied:
- ✅ Added ErrorBoundary for crash prevention
- ✅ Created secure token storage
- ✅ Added input validation utilities
- ✅ Implemented loading/error states
- ✅ Fixed memory leaks in sync service

## 🗺 Roadmap

### Phase 1: Critical Fixes (Complete)
- [x] Fix critical bugs
- [x] Add error boundaries
- [x] Secure token storage
- [x] Input validation

### Phase 2: Authentication (In Progress)
- [ ] Login screen
- [ ] Registration screen
- [ ] Password reset
- [ ] Session management

### Phase 3: Monetization (Planned)
- [ ] Payment integration
- [ ] Premium features
- [ ] Subscription management

### Phase 4: Social (Future)
- [ ] Friends list
- [ ] Challenges
- [ ] Global leaderboards
- [ ] Share achievements

## 📄 License

MIT License - See LICENSE file

## 🤝 Contributing

Contributions welcome! Please read CONTRIBUTING.md first.

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📧 Support

- **Issues**: [GitHub Issues](https://github.com/Jonathangadeaharder/Poker/issues)
- **Email**: support@pokertraining.app

## 🙏 Acknowledgments

- SM-2 Algorithm by SuperMemo
- GTO strategy resources from solvers
- Community feedback and testing

---

**Built with** ❤️ **using React Native & Expo**

**Happy studying!** 🎓♠️♥️♣️♦️
