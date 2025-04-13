# Overview

This is the frontend portion of the project. In here, both the desktop and mobile UI is located, along with any frontend logic.

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

- `styles/` – Styling related to the desktop application.

- `utils/` – Utility functions specific to the desktop environment.

- `App.tsx` – Main application component for the desktop client.

- `main.tsx` – Entry point for the React application (attaches React to the DOM).

- `setupTests.ts` – Global configuration for Jest.

- `vite-env.d.ts` – TypeScript definitions for Vite.

### `apps/mobile/`

- `__tests__/` – Testing setup for the mobile app.

- `App.test.tsx` – Sample test file for the main mobile application component.

- `android/, ios/` – Platform-specific native files, gradle settings, Xcode project, etc.

- `node_modules/` – Local node packages.

- `Podfile` – CocoaPods dependencies for iOS.

### `shared/`

- `components/` – Reusable React components that can be used by both desktop and mobile.

- `styles/` – Global or shared styling.

- `utils/` – Utility functions that are platform-independent.

# Key Directories

- `__mocks__`: Contains mock files used for testing.

- `apps/`: Houses the desktop and mobile projects.

- `desktop/`: The Tauri/React/Tailwind desktop application.

- `mobile/`: The mobile application (React Native).

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

### Install Dependencies

While each app has its own dependencies, you may want to install at the frontend folder level:

``` bash
npm install
```

### Set Up Environment Variables

- Copy .env.example (if provided) to .env, or fill in custom environment variables in your .env file.

- Ensure that the environment variables are correct for both desktop and mobile needs.

- Here is the structure:

``` bash
# Weather APIs
VITE_WAQI_ACCESS_TOKEN=<>
VITE_WEATHER_API_ACCESS_TOKEN=<>
VITE_GOOGLE_MAPS_API_KEY=<>
# Custom IP address can be used for local development, otherwise it will use user ip address or ip address provided straight to the function
VITE_IP_ADDRESS=""
# Backend
VITE_API_BASE_URL=<>
# Routes search APIs
VITE_PUBLIC_TRANSPORT_API_KEY=<>
VITE_GRAPHHOPPER_API_KEY=<>
VITE_ROUTES_SEARCH_KEY=<>
```

# Desktop Commands

Within the apps/desktop directory, you can run various commands to develop, test, and build the Tauri-based desktop application.

### Go to Desktop folder

``` bash
cd apps/desktop
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
```

This will launch the Expo development server and display a QR code in the terminal or browser. You can:

- **Scan the QR code** using the **Expo Go** app on your physical Android or iOS device.
- **Run the app on an Android emulator** by pressing `a` in the terminal (ensure you have an emulator configured via Android Studio).

### Build and Deploy for Android (Preview)

To generate a preview build of the app for Android:

```bash
eas build -p android --profile preview
```

This command uses Expo Application Services (EAS) to create a preview build, which can be installed on physical devices or tested via emulator.

> 🔧 Make sure you're logged into your Expo account and have EAS CLI installed (`npm install -g eas-cli`).

---

Would you like me to write the full README with sections like "Installation", "Project Structure", and "Dependencies" too?

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
npm test
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
