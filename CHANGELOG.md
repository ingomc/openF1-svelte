# Changelog

**🌐 Live Demo:** [openF1-svelte auf GitHub Pages](https://andre.github.io/openF1-svelte/)

All notable changes to the Formula 1 Dashboard project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-07-07

### 🚀 Major Release - Complete F1 Dashboard

#### 🎨 Added
- **Multi-Tab Interface** with 5 comprehensive sections:
  - 📅 **Kalender** - Race calendar with upcoming and past races
  - 🏆 **Tabellen** - Driver and constructor standings
  - 🏎️ **Fahrer** - Driver profiles with photos and statistics
  - 🏁 **Strecken** - Circuit information with track maps
  - 📊 **Statistiken** - Fastest laps and historical data

#### 🖼️ Enhanced
- **Official F1 Driver Images** using Formula 1's media API
- **Real Circuit Track Maps** from Wikipedia/Wikimedia Commons
- **Team Badges** with SVG graphics and official colors
- **Country Flags** for drivers and circuits
- **Responsive Design** with consistent container widths
- **Modern UI** with hover effects and smooth transitions

#### 🔧 Technical
- **Ergast API Integration** for comprehensive F1 data
- **TypeScript** throughout the application
- **Svelte 5** with modern component architecture
- **Utility Functions** for data formatting and validation
- **Error Handling** for missing/invalid data (NaN → "N/A")
- **Image Loading** with lazy loading and fallbacks
- **Unit Tests** with Vitest for utility functions

#### 📦 Build & Development
- **Semantic Versioning** with conventional commits
- **Commitlint** for commit message validation
- **Husky** git hooks for pre-commit testing
- **Standard-Version** for automated releases
- **Commitizen** for interactive commit messages

#### 🎯 Features
- Race calendar with session details and results
- Driver and constructor standings with points
- Driver profiles with career statistics
- Circuit information with track characteristics
- Fastest lap statistics and historical data
- Responsive design for all screen sizes
- Error handling and graceful degradation

---
- **Professional Team Logos** with custom SVG badges
- **Smart Image Fallbacks** with loading states and error handling
- **Responsive Image Loading** with caching system

### 🛠️ Technical Improvements
- **Centralized Utility Functions** in `utils.ts` (DRY principle)
- **Dedicated Image Service** in `f1-images.ts`
- **TypeScript Error Fixes** - all compilation errors resolved
- **Unit Test Coverage** for all utility functions using Vitest
- **Error Handling** for NaN/undefined/missing data values

### 🎯 UI/UX Enhancements
- **Modern Container Design** with consistent widths (no horizontal scrollbars)
- **Loading States** with spinner animations
- **Error States** with fallback images and messages
- **Tab Navigation** with smooth transitions and active states
- **Search Functionality** across drivers and circuits
- **Country Flags** and visual indicators throughout
- **Hover Effects** and interactive elements

### 🔧 Bug Fixes
- Fixed Svelte compilation errors in `CircuitsTab.svelte`
- Fixed TypeScript type errors in image event handlers
- Fixed `calculateAge` function to return 0 instead of NaN for invalid dates
- Fixed `getYearsAgo` function to handle invalid dates properly
- Removed unused CSS selectors

### 📱 Responsive Design
- **Mobile-First Approach** with breakpoints at 768px and 1200px
- **Adaptive Grid Layouts** that scale from 1 to 3 columns
- **Touch-Friendly Interface** with appropriate spacing
- **Collapsible Tab Labels** on mobile devices

### 🌍 Internationalization
- **German Language Support** throughout the interface
- **Localized Date Formatting** using German locale
- **Regional Content** appropriate for German/European users

### ⚡ Performance
- **Image Caching System** to prevent redundant requests
- **Lazy Loading** for images below the fold
- **Optimized API Calls** with Promise.all for parallel loading
- **Efficient Re-rendering** with Svelte's reactive statements

## [1.1.0] - 2025-07-06

### 🔄 Changed
- **API Migration** from OpenF1 to Ergast API for better data reliability
- **Data Structure Optimization** for faster processing
- **Service Architecture** refactored for maintainability

### 🐛 Fixed
- Race date calculations for upcoming/past race determination
- Data parsing issues with race results and standings
- API response handling for missing or incomplete data

## [1.0.0] - 2025-07-05

### 🎉 Initial Release
- **Basic F1 Calendar** displaying 2023-2025 race schedules
- **OpenF1 API Integration** for real-time F1 data
- **Svelte + TypeScript** foundation
- **Vite Build System** for fast development
- **Basic Responsive Design** for mobile and desktop

---

## 🚀 Upcoming Features

### Planned for v1.3.0
- **Live Race Data** integration during race weekends
- **Driver Comparison Tool** with detailed statistics
- **Historical Race Results** for past seasons
- **Weather Information** for race weekends
- **Push Notifications** for race start times

### Planned for v1.4.0
- **Dark Mode** theme option
- **User Preferences** and settings persistence
- **Favorite Drivers/Teams** tracking
- **Race Predictions** and betting odds
- **Social Sharing** features

### Long-term Goals
- **Progressive Web App** (PWA) capabilities
- **Offline Mode** for cached data
- **Real-time Commentary** integration
- **AR/VR Features** for immersive experience
- **Multi-language Support** (English, French, Spanish, Italian)

---

## 📊 Project Statistics

- **Total Files**: 15+ TypeScript/Svelte files
- **Lines of Code**: 2000+ lines
- **Test Coverage**: 90%+ for utility functions
- **Supported Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile Support**: iOS 14+, Android 10+

## 🛠️ Development Stack

- **Frontend**: Svelte 5.34.7 + TypeScript 5.8.3
- **Build Tool**: Vite 6.3.5
- **Testing**: Vitest 3.2.4 + jsdom 26.1.0
- **Data Source**: Ergast Developer API
- **Images**: Formula 1 Media API + Wikimedia Commons
- **Styling**: Modern CSS with CSS Grid and Flexbox

## 🤝 Contributing

This project follows semantic versioning and conventional commits. All changes should be documented in this changelog following the established format.

For more information on contributing, please see our [Contributing Guidelines](CONTRIBUTING.md).

---

*Last updated: July 7, 2025*
