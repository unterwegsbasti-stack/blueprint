# 📱 Android Technical Blueprint Generator

[English](#-english) | [Deutsch](#-deutsch)

---

## 🇬🇧 English

A professional **Senior Android Software Architect Assistant** that turns app ideas into structured technical concepts (*Technical Blueprints*), clean Android Jetpack Compose architectures, Dagger Hilt / Koin Dependency Injection modules, Room / SQLCipher data models, Gradle/Kotlin DSL configurations, JUnit/Espresso testing setups, and GitHub Actions CI/CD workflows.

### 🚀 Getting Started & Local Setup

#### Prerequisites
* **Node.js**: v18 or v20+
* **npm**: v9+
* **Gemini API Key**: Get a free API key from [Google AI Studio](https://aistudio.google.com/).

#### 1. Clone Repository & Install Dependencies
```bash
git clone https://github.com/unterwegsbasti-stack/blueprint.git
cd blueprint
npm install
```

#### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Set your Gemini API key in `.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

#### 3. Start Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 🛠️ Build & Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts development server on port 3000 |
| `npm run build` | Compiles production bundle for frontend and Express server |
| `npm run lint` | Runs TypeScript typechecker |
| `npm run start` | Runs production server |

---

## 🇩🇪 Deutsch

Ein professioneller **Senior Android Software Architect Assistant**, der aus App-Ideen strukturierte technische Konzepte (*Technical Blueprints*), saubere Android Jetpack Compose Architekturen, Dagger Hilt / Koin Dependency Injection Module, Room / SQLCipher Datenmodelle, Gradle/Kotlin DSL Konfigurationen, JUnit/Espresso Testing-Setups und GitHub Actions CI/CD Workflows erstellt.

---

## 🚀 GitHub Export & Integration

Du kannst diese Anwendung auf zwei Arten in ein **GitHub Repository** übertragen:

### Methode 1: Direkter Export über Google AI Studio (Empfohlen)
1. Klicke oben rechts im AI Studio Interface auf das **Einstellungen / Export-Menü**.
2. Wähle **"Export to GitHub"**.
3. Verbinde dein GitHub-Konto und wähle den Ziel-Repository-Namen aus.
4. AI Studio überträgt den gesamten Code inklusive aller Dateien direkt in dein neues GitHub Repository.

### Methode 2: ZIP-Download & Manuelles Pushing
1. Klicke im Menü oben rechts auf **"Export ZIP"**.
2. Entpacke die ZIP-Datei auf deinem lokalen Computer.
3. Öffne ein Terminal im entpackten Ordner und führe folgende Befehle aus:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Android Technical Blueprint Generator"
   git branch -M main
   git remote add origin https://github.com/unterwegsbasti-stack/blueprint.git
   git push -u origin main
   ```

---

## 🛠️ Lokale Entwicklung & Setup

### Voraussetzungen
* **Node.js**: v18 oder v20+
* **npm**: v9+
* **Gemini API Key**: Kostenlos unter [Google AI Studio](https://aistudio.google.com/) erhältlich.

### 1. Repository klonen & Abhängigkeiten installieren
```bash
git clone https://github.com/unterwegsbasti-stack/blueprint.git
cd blueprint
npm install
```

### 2. Umgebungsvariablen konfigurieren
Erstelle eine `.env` Datei im Stammverzeichnis basierend auf `.env.example`:
```bash
cp .env.example .env
```
Trage deinen Gemini API Key ein:
```env
GEMINI_API_KEY=dein_gemini_api_key_hier
```

### 3. Entwicklungs-Server starten
```bash
npm run dev
```
Die Anwendung ist nun unter `http://localhost:3000` erreichbar.

---

## 🏗️ Projekt-Struktur & Tech Stack

```text
├── .github/
│   └── workflows/
│       └── ci.yml             # Automatische Build & Typecheck GitHub Action
├── src/
│   ├── components/
│   │   ├── BlueprintViewer.tsx # Interaktiver Visualisierer & Live UI-Preview
│   │   └── ...
│   ├── App.tsx                 # Formular mit Quick-Start Vorlagen & KI-Logik
│   ├── main.tsx                # React Entry Point
│   └── index.css               # Tailwind CSS v4 Styling
├── server.ts                   # Express Backend für Gemini API proxying
├── package-lock.json           # Lockfile für npm ci & GitHub Actions
├── metadata.json               # Applet Metadaten
├── .env.example                # Vorlage für Umgebungsvariablen
├── package.json                # Dependencies & NPM Scripts
└── vite.config.ts              # Vite Build Configuration
```

### Eingesetzte Technologien:
* **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Motion (Framer Motion)
* **Backend**: Express.js (Node.js) mit `@google/genai` SDK
* **Build System**: Vite, `tsx`, `esbuild`
* **CI/CD**: GitHub Actions Workflows

---

## 📜 Verfügbare Skripte

| Befehl | Beschreibung |
| :--- | :--- |
| `npm run dev` | Startet den Entwicklungsserver auf Port 3000 |
| `npm run build` | Baut das Produktiv-Bundle für Frontend und Server |
| `npm run lint` | Führt die TypeScript Typechecking Überprüfung durch |
| `npm run start` | Startet die Anwendung im Produktivmodus |

---

## 🔒 Security & Privacy by Design

* Der **Gemini API Key** bleibt absolut serverseitig in `server.ts` und wird niemals an den Browser übermittelt.
* Generierte Blueprints folgen nativ den Google **Android Security Best Practices** (z.B. EncryptedSharedPreferences, Android KeyStore Hardware Module, SQLCipher, BiometricPrompt).

