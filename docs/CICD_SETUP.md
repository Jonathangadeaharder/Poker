# CI/CD Pipeline Setup

This document explains the continuous integration and deployment setup for the Poker Training App.

## Overview

The project uses GitHub Actions for automated testing, building, and deployment:

- **CI Pipeline** (`ci.yml`): Runs on every push and PR
- **CD Pipeline** (`deploy.yml`): Deploys to production on tags or manual trigger

## CI Pipeline (Continuous Integration)

Runs automatically on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`

### Jobs

#### 1. Lint and Test
- Installs dependencies
- Runs ESLint for code quality
- Executes unit tests with coverage
- Uploads coverage to Codecov

#### 2. Security Audit
- Checks for npm package vulnerabilities
- Generates security report
- Fails on high/critical vulnerabilities

#### 3. Build Android
- Builds Android APK for testing
- Uses EAS (Expo Application Services)
- Runs only after tests pass

#### 4. Build iOS
- Builds iOS app for testing
- Uses EAS (Expo Application Services)
- Runs only after tests pass
- Requires macOS runner

#### 5. Code Quality
- TypeScript type checking (if applicable)
- Checks for console.log statements
- Bundle size analysis

## CD Pipeline (Continuous Deployment)

Runs on:
- Git tags matching `v*.*.*` (e.g., `v1.0.0`)
- Manual workflow dispatch

### Jobs

#### 1. Pre-deployment Validation
- Runs all tests
- Security audit
- Linting checks

#### 2. Deploy Android
- Builds production APK/AAB
- Submits to Google Play Store
- Requires validation to pass

#### 3. Deploy iOS
- Builds production IPA
- Submits to Apple App Store
- Requires validation to pass

#### 4. Create GitHub Release
- Creates GitHub release with changelog
- Links to app store pages
- Runs after successful deployment

## Setup Instructions

### 1. GitHub Repository Secrets

Add the following secrets to your GitHub repository (Settings → Secrets and Variables → Actions):

#### Required for All Platforms
```
EXPO_TOKEN=<your-expo-access-token>
```

Get from: https://expo.dev/accounts/[account]/settings/access-tokens

#### Required for Android
```
GOOGLE_SERVICE_ACCOUNT_KEY=<json-key-content>
```

Steps to create:
1. Go to Google Play Console
2. Setup → API access
3. Create new service account
4. Grant permissions
5. Create JSON key
6. Copy entire JSON content as secret

#### Required for iOS
```
APPLE_ID=<your-apple-id>
APPLE_APP_SPECIFIC_PASSWORD=<app-specific-password>
```

Steps to create:
1. Go to appleid.apple.com
2. Sign in with your Apple ID
3. Security → App-Specific Passwords
4. Generate new password
5. Use this password in secrets

### 2. EAS Configuration

Install EAS CLI:
```bash
npm install -g eas-cli
```

Login to Expo:
```bash
eas login
```

Configure EAS:
```bash
eas build:configure
```

This creates `eas.json` with build profiles:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      },
      "ios": {
        "buildConfiguration": "Release"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "internal"
      },
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "1234567890",
        "appleTeamId": "ABCDE12345"
      }
    }
  }
}
```

### 3. Package.json Scripts

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "test": "jest",
    "test:coverage": "jest --coverage",
    "build:android": "eas build --platform android",
    "build:ios": "eas build --platform ios",
    "submit:android": "eas submit --platform android",
    "submit:ios": "eas submit --platform ios"
  }
}
```

### 4. Jest Configuration

Create `jest.config.js`:

```javascript
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|expo|@expo|@unimodules|react-native-paper)/)',
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
  ],
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 60,
      functions: 70,
      lines: 70,
    },
  },
};
```

### 5. ESLint Configuration

Create `.eslintrc.js`:

```javascript
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-native/all',
  ],
  plugins: ['react', 'react-native'],
  env: {
    'react-native/react-native': true,
  },
  rules: {
    'no-console': 'warn',
    'react/prop-types': 'off',
  },
};
```

## Usage

### Running CI Locally

Test before pushing:

```bash
# Run linter
npm run lint

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Check for security issues
npm audit
```

### Manual Deployment

#### Deploy to Android
```bash
# Build
eas build --platform android --profile production

# Submit
eas submit --platform android --latest
```

#### Deploy to iOS
```bash
# Build
eas build --platform ios --profile production

# Submit
eas submit --platform ios --latest
```

### Creating a Release

1. Update version in `package.json` and `app.json`
2. Create and push a git tag:

```bash
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

3. GitHub Actions will automatically:
   - Run tests
   - Build production apps
   - Submit to stores
   - Create GitHub release

## Monitoring

### View Pipeline Status

- Go to GitHub repository → Actions tab
- Click on a workflow run to see details
- View logs for each job

### Build Status Badges

Add to README.md:

```markdown
![CI](https://github.com/username/poker-training/workflows/CI%2FCD%20Pipeline/badge.svg)
```

### Notifications

Configure notifications in `.github/workflows/`:

#### Slack
```yaml
- name: Slack Notification
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
```

#### Discord
```yaml
- name: Discord Notification
  uses: sarisia/actions-status-discord@v1
  with:
    webhook: ${{ secrets.DISCORD_WEBHOOK }}
```

## Troubleshooting

### Build Failures

**Problem**: Build fails on CI but works locally

**Solutions**:
1. Check Node version matches (18.x)
2. Clear npm cache: `npm ci` instead of `npm install`
3. Check for platform-specific code

### Test Failures

**Problem**: Tests pass locally but fail on CI

**Solutions**:
1. Check for time-dependent tests
2. Ensure mocks are set up correctly
3. Check for environment variables

### Deployment Failures

**Problem**: Deployment to stores fails

**Solutions**:
1. Verify all secrets are set correctly
2. Check EAS configuration
3. Ensure app signing is configured
4. Review app store credentials

### Coverage Requirements

**Problem**: Coverage below threshold

**Solutions**:
1. Add more tests
2. Adjust thresholds in `jest.config.js`
3. Exclude generated files from coverage

## Best Practices

1. **Always run tests locally** before pushing
2. **Keep dependencies updated** regularly
3. **Monitor build times** and optimize if needed
4. **Review failed builds immediately**
5. **Tag releases properly** (semantic versioning)
6. **Write meaningful commit messages**
7. **Keep secrets secure** (never commit them)
8. **Test deployment process** in preview first

## Advanced Configuration

### Caching

Speed up builds with caching:

```yaml
- name: Cache dependencies
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

### Matrix Builds

Test multiple Node versions:

```yaml
strategy:
  matrix:
    node-version: [16, 18, 20]

steps:
  - uses: actions/setup-node@v3
    with:
      node-version: ${{ matrix.node-version }}
```

### Conditional Jobs

Run jobs based on conditions:

```yaml
deploy-android:
  if: github.ref == 'refs/heads/main'
  needs: test
```

## Resources

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [EAS Submit Docs](https://docs.expo.dev/submit/introduction/)
- [Jest Docs](https://jestjs.io/docs/getting-started)
- [ESLint Docs](https://eslint.org/docs/latest/)

## Support

For CI/CD issues:
- Check `.github/workflows/` directory
- Review GitHub Actions logs
- Consult EAS documentation
- Check repository secrets configuration
