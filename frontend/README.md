# Overview

This application has been developed by Team 2 as part of the M.Sc in Computer Science - Advanced Software Engineering module in Trinity College Dublin. It focuses on building smart, sustainable and data-driven solutions to support sustainable urban living in Dublin.

# Project Structure

Below is a high-level overview of the repository structure:

``` bash
├── __mocks__/
├── apps/
│   ├── desktop/
│   │   ├── .vscode/
│   │   ├── dist/
│   │   ├── src/
│   │   │   ├── __tests__/
│   │   │   ├── assets/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── styles/
│   │   │   ├── utils/
│   │   │   ├── App.tsx
│   │   │   ├── main.tsx
│   │   │   ├── setupTests.ts
│   │   │   └── vite-env.d.ts
│   │   ├── src-tauri/
│   │   ├── .gitignore
│   │   └── index.html
│   └── mobile/
│       ├── __tests__/
│       ├── App.test.tsx
│       ├── ...
│       ├── node_modules/
│       ├── ...
│       ├── ios/
│       ├── android/
│       ├── ...
│       └── Podfile
├── shared/
│   ├── components/
│   ├── styles/
│   └── utils/
├── .env
├── .gitignore
├── Global.css
├── jest.config.js
├── package.json
├── package-lock.json
├── README.md
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

# Folder Breakdown
### `apps/desktop/src/`

- `__tests__/` – Contains unit and integration tests related to the desktop app.

- `assets/` – SVG files and other static assets.

- `components/` – Reusable UI components shared across multiple pages.

- `pages/` – Page-level components (screens, main views).

- `styles/` – Tailwind configs, global CSS files, or specialized CSS modules for the desktop app.

- `utils/` – Utility functions specific to the desktop environment.

- `App.tsx` – Main application component for the desktop client.

- `main.tsx` – Entry point for the React application (attaches React to the DOM).

- `setupTests.ts` – Global configuration for Jest.

- `vite-env.d.ts` – TypeScript definitions for Vite.

### `apps/mobile/`

- `__tests__/` – Testing setup for the mobile app.

- `App.test.tsx` – Sample test file for your main mobile application component.

- `android/, ios/` – Platform-specific native files, gradle settings, Xcode project, etc.

- `node_modules/` – Local node packages.

- `Podfile` – CocoaPods dependencies for iOS.

### `shared/`

- `components/` – Reusable React components that can be used by both desktop and mobile (if they are platform-agnostic).

- `styles/` – Global or shared styling (e.g., Tailwind configs, variables).

- `utils/` – Utility functions that are platform-independent.

# Key Directories

- `__mocks__`: Contains mock files used for testing.

- `apps/`: Houses the desktop and mobile projects.

- `desktop/`: The Tauri/React/Tailwind desktop application.

- `mobile/`: The mobile application (React Native or similar).

- `shared/`: Contains shared logic, components, styles, and utilities for reuse in both desktop and mobile apps.

- Root configuration files (.env, jest.config.js, package.json, tsconfig.json, etc.) apply either to the entire monorepo or provide specific build/test configurations.

# Technology Stack
## Desktop

- `Tauri` – For bundling the React application into a lightweight desktop environment.

- `React` – A JavaScript library for building user interfaces.

- `Tailwind CSS` – A utility-first CSS framework for rapid UI development.

- `TypeScript` – Enhances JavaScript with strong typing.

- `Jest + React Testing Library` – For testing React components and pages.

## Mobile

- `React Native` – For building cross-platform mobile apps.

- `TypeScript` – For type safety.

- `Jest/React Native Testing Library` – For testing mobile components.

# Getting Started
### Clone the Repository

``` bash
git clone https://github.com/SubhayanDas08/ase_grp2.git
cd ase_grp2/frontend
```
### Install Dependencies (Root Level)

While each app has its own dependencies, you may want to install at the root level:

``` bash
npm install
```

### Set Up Environment Variables

- Copy .env.example (if provided) to .env, or fill in custom environment variables in your .env file.

- Ensure that the environment variables are correct for both desktop and mobile needs.

# Desktop Commands

Within the apps/desktop directory, you can run various commands to develop, test, and build the Tauri-based desktop application.

### Install dependencies

``` bash
cd apps/desktop
npm install
```

### Development server (React + Tailwind in the browser)

``` bash
npm run dev
```

This typically starts the Vite development server. You can preview your app in the browser at the displayed URL.

### Run Tauri dev mode

``` bash
npm run tauri dev
```

This spins up the desktop application in a Tauri window with live reload enabled.

### Build Desktop Application

``` bash
npm run tauri build
```

Generates the production-ready Tauri bundle for your platform 
- Will need to delete the __tests__ folder to build.

### Testing

``` bash
npm test
```

Runs the Jest test suite for your desktop codebase (unit tests, integration tests, etc.).

# Mobile Commands

Inside the apps/mobile directory, you’ll find the mobile application code.

### Install dependencies

``` bash
cd apps/mobile
npm install
```

### Start Metro Bundler

``` bash
npm start

or

npx react-native start
```

This starts the development server for the mobile application.

### Run on iOS

``` bash
npx react-native run-ios
```

Builds and runs your app in the iOS Simulator (macOS only).

### Run on Android

``` bash
npx react-native run-android
```

Builds and deploys the app to a connected Android device or emulator.

### Testing

``` bash
npm test
```

Executes the test suite for the mobile application (e.g., Jest + React Native Testing Library).

# Testing

Ecovate uses Jest for unit and integration tests, along with React Testing Library (and React Native Testing Library on mobile) for more comprehensive component testing.

- Desktop: Tests are located under `apps/desktop/src/__tests__` or within file-specific *.test.ts(x) files.

- Mobile: Tests live in `apps/mobile/__tests__` or in *.test.ts(x) files within the mobile directory.

### Running Tests (Desktop):

``` bash
cd apps/desktop
npm test
```

### Running Tests (Mobile):

``` bash
cd apps/mobile
npm run test
```

# Authors
<li>Abhigyan Khaund</li>
<li>Adrieja Bhowmick</li>
<li>Agathe Mignot</li>
<li>Akshit Saini</li>
<li>Boris Stavisky</li>
<li>Kartik Tola</li>
<li>Sibin George</li>
<li>Simon Walter</li>
<li>Subhayan Das</li>