# Beta Testing Guide

Welcome to the Poker Training App beta program! This guide explains how to participate in testing and provide valuable feedback.

## Table of Contents

1. [Getting Started](#getting-started)
2. [What to Test](#what-to-test)
3. [How to Report Issues](#how-to-report-issues)
4. [Beta Testing Phases](#beta-testing-phases)
5. [FAQ](#faq)

## Getting Started

### Joining the Beta

#### iOS (TestFlight)

1. **Get Invitation**
   - Check your email for TestFlight invitation
   - Or use beta invite link provided

2. **Install TestFlight**
   - Download TestFlight from App Store
   - Open invitation link
   - Accept beta invitation

3. **Install Beta App**
   - Open TestFlight app
   - Tap "Install" next to Poker Training Pro
   - Open app and start testing

#### Android (Internal Testing)

1. **Join Beta Program**
   - Open invite link in email
   - Or visit: [Google Play Beta Link]
   - Tap "Become a Tester"

2. **Install Beta App**
   - Wait for approval (usually instant)
   - Visit Play Store
   - Search "Poker Training Pro"
   - Install app

### First Launch

1. **Create Account**
   - Use your real email for better communication
   - Or use demo account: `demo@pokertraining.app` / `demo1234`

2. **Grant Permissions**
   - Notifications (for reminders)
   - Storage (for offline data)

3. **Complete Onboarding**
   - Walk through tutorial
   - Note any issues or confusing parts

## What to Test

### Core Features

#### 1. Authentication
- [ ] Registration with email/password
- [ ] Login with credentials
- [ ] Password reset flow
- [ ] Remember me functionality
- [ ] Logout
- [ ] Session timeout (after 15 min inactivity)

#### 2. Onboarding
- [ ] Tutorial slides are clear
- [ ] Interactive demos work
- [ ] Skip functionality
- [ ] Proper navigation to main app

#### 3. Quiz System
- [ ] Questions load correctly
- [ ] Answer selection works
- [ ] Submit answers
- [ ] View correct answers
- [ ] XP rewards display
- [ ] Progress tracking

#### 4. Spaced Repetition
- [ ] Card creation
- [ ] Review scheduling
- [ ] Answer quality ratings
- [ ] Statistics accuracy

#### 5. Gamification
- [ ] XP gain on correct answers
- [ ] Level up notifications
- [ ] Streak tracking
- [ ] Achievement unlocks
- [ ] Leaderboards (if implemented)

#### 6. Profile
- [ ] View user stats
- [ ] Edit profile
- [ ] Settings work correctly
- [ ] Sound toggle
- [ ] Haptic feedback toggle

#### 7. Content
- [ ] PLO questions
- [ ] NLHE MTT questions
- [ ] Exploitative strategies guide
- [ ] Range trainer
- [ ] Push/fold charts

### User Experience

Test these aspects:

- **Navigation**: Is it intuitive?
- **Performance**: Are there lags or crashes?
- **Design**: Does it look good? Any visual bugs?
- **Content**: Are explanations clear?
- **Feedback**: Do you understand what's happening?

### Edge Cases

Try to break things:

- [ ] Submit quiz with no answer selected
- [ ] Navigate back/forward rapidly
- [ ] Minimize app during quiz
- [ ] Close app and reopen
- [ ] Use with poor network connection
- [ ] Use offline
- [ ] Fill forms with invalid data
- [ ] Rapid button clicking

## How to Report Issues

### Bug Reports

When you find a bug, include:

1. **Device Info**
   - Device model (e.g., iPhone 13, Pixel 6)
   - OS version (e.g., iOS 16.2, Android 13)
   - App version (shown in Profile → About)

2. **Steps to Reproduce**
   ```
   1. Go to Quiz screen
   2. Select "PLO" category
   3. Tap "Start Quiz"
   4. Submit without selecting answer
   5. Bug: App crashes
   ```

3. **Expected vs Actual**
   - Expected: Show error message
   - Actual: App crashes

4. **Screenshots/Video**
   - Attach if possible
   - Use screen recording for crashes

5. **Frequency**
   - Always, Sometimes, Once

### Feedback Format

Use this template:

```
**Type**: [Bug / Feature Request / Feedback]
**Priority**: [High / Medium / Low]
**Category**: [Auth / Quiz / UI / Performance / Content]

**Description**:
Clear description of the issue or suggestion

**Steps to Reproduce** (for bugs):
1. Step 1
2. Step 2
3. ...

**Expected Behavior**:
What should happen

**Actual Behavior**:
What actually happens

**Device Info**:
- Device: iPhone 13
- OS: iOS 16.2
- App Version: 1.0.0 (42)

**Additional Context**:
Any other relevant information

**Screenshots**:
[Attach here]
```

### Submission Methods

1. **In-App Feedback** (Preferred)
   - Profile → Settings → Send Feedback
   - Automatically includes device info

2. **TestFlight** (iOS)
   - Tap "Send Beta Feedback" in TestFlight
   - Include screenshots

3. **Email**
   - Send to: beta@pokertraining.app
   - Use template above

4. **Discord/Slack** (If provided)
   - Join beta channel
   - Share feedback with community

## Beta Testing Phases

### Phase 1: Closed Alpha (Week 1-2)
**Focus**: Core functionality
- 10-20 testers
- Friends & family
- Test basic features
- Fix critical bugs

### Phase 2: Closed Beta (Week 3-4)
**Focus**: User experience
- 50-100 testers
- Early adopters
- Test all features
- Gather UX feedback
- Performance testing

### Phase 3: Open Beta (Week 5-6)
**Focus**: Scalability
- 500+ testers
- Public beta
- Load testing
- Final bug fixes
- Content refinement

### Phase 4: Release Candidate (Week 7)
**Focus**: Final validation
- All testers
- Last chance for bugs
- Prepare for production
- Final stress tests

## Test Scenarios

### Scenario 1: New User Journey
1. Download app
2. Create account
3. Complete onboarding
4. Take first quiz
5. Check progress
6. Return next day (test streak)

**What to check**:
- Is signup easy?
- Is onboarding helpful?
- Is first quiz engaging?
- Are rewards satisfying?

### Scenario 2: Daily User
1. Open app (should remember login)
2. Check daily streak
3. Complete daily quiz
4. Review spaced repetition cards
5. Check achievements
6. Logout

**What to check**:
- Auto-login works?
- Streak increments?
- Content is varied?
- Achievements unlock?

### Scenario 3: Power User
1. Complete multiple quizzes
2. Level up
3. Unlock achievements
4. Review statistics
5. Export data (if available)

**What to check**:
- XP calculation correct?
- Statistics accurate?
- Performance stable?

## Feedback Priorities

### Critical Issues (Report Immediately)
- App crashes
- Data loss
- Security vulnerabilities
- Payment issues (if applicable)
- Login failures

### High Priority
- Feature not working as intended
- Poor performance
- Confusing UX
- Content errors

### Medium Priority
- Minor bugs
- UI inconsistencies
- Missing features
- Enhancement suggestions

### Low Priority
- Typos
- Style preferences
- Nice-to-have features

## Rewards & Recognition

### Beta Tester Perks
- Early access to features
- Free premium account (first month)
- Beta tester badge in profile
- Credits in app About page
- Priority support

### Top Contributors
Most valuable testers get:
- Lifetime premium access
- Exclusive achievements
- Beta tester of the month recognition
- Amazon gift cards (for top 3)

## Communication

### Beta Newsletter
- Weekly updates on:
  - New features added
  - Bugs fixed
  - Upcoming changes
  - Testing priorities

### Community Channels
- Discord server: [Link]
- Slack channel: [Link]
- Email updates: beta@pokertraining.app

### Response Time
- Critical bugs: Within 24 hours
- High priority: Within 3 days
- Medium/Low: Within 1 week

## Privacy & NDA

### What We Collect
- Usage data (anonymized)
- Crash reports
- Feature usage statistics
- Feedback and bug reports
- Device information

### What's Confidential
- Unreleased features
- Beta builds
- Internal discussions
- Roadmap details

### What You Can Share
- General feedback
- Public beta link (after Phase 3)
- Your experience (keep features private)

## FAQ

**Q: How long is the beta period?**
A: Approximately 6-8 weeks, ending with production release.

**Q: Will my data be saved after beta?**
A: Yes! All progress carries over to production.

**Q: Can I invite friends?**
A: During Phases 1-2: No. During Phase 3 (Open Beta): Yes!

**Q: What happens if I find a bug?**
A: Report it using the methods above. We'll investigate and fix it.

**Q: Will the app be different from beta?**
A: Minor changes possible, but core functionality stays the same.

**Q: How often are updates released?**
A: Weekly during beta for bug fixes and improvements.

**Q: Can I suggest features?**
A: Absolutely! Use the feedback form or email us.

**Q: Is my feedback anonymous?**
A: Only if you choose. We prefer knowing who to thank!

**Q: What if I can't continue testing?**
A: No problem! Let us know so we can fill your spot.

**Q: Will beta testers get early access to new features?**
A: Yes! Beta testers get priority access to future updates.

## Contact

- **General Questions**: beta@pokertraining.app
- **Bug Reports**: bugs@pokertraining.app
- **Feature Requests**: features@pokertraining.app
- **Emergency**: support@pokertraining.app

## Thank You!

Your participation makes this app better for everyone. We deeply appreciate your time and feedback!

**Happy Testing! 🃏**

---

*Last Updated: [Date]*
*Version: 1.0*
