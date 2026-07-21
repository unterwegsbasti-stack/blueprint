export interface Template {
  id: string;
  label: string;
  appName: string;
  audience: string;
  concept: string;
  integrations?: string[];
  structure?: 'single-module' | 'multi-module';
  pattern?: 'MVVM' | 'MVI';
}

export interface Blueprint {
  // New strict tab structures
  summaryTab?: {
    appName: string;
    vision: string;
    architecturePattern: string;
  };
  gradleTab?: {
    dependencies: string[];
  };
  databaseTab?: {
    entityCode: string;
    daoCode: string;
  };
  uiTab?: {
    composeCode: string;
  };
  securityTab?: {
    concepts: string[];
  };

  // Old/legacy normalized structures
  executiveSummary: {
    vision: string;
    targetAudience: string;
    architecturalGoals: string[];
  };
  techStack: {
    language: string;
    uiFramework: string;
    diFramework: string;
    architecturePattern: string;
    persistence: string;
    network: string;
    asyncFramework: string;
    dependencies: Array<{ name: string; dependency: string; description: string }>;
    plugins: Array<{ name: string; plugin: string; description: string }>;
  };
  coreFeatures: Array<{
    name: string;
    description: string;
    implementationDetails: string;
    uiComponents: string[];
    stateFlow: string;
  }>;
  securityPrivacy: {
    dataPersistence: string;
    dataTransmission: string;
    androidKeystore: string;
    privacyByDesign: string[];
  };
  dataModel: {
    jsonStructure: string;
    kotlinDataClasses: string;
    roomEntityCode: string;
  };
  packageStructure: {
    type: string;
    tree: string;
  };
}

export const TEMPLATES: Template[] = [
  {
    id: "custom",
    label: "✨ Eigenes Konzept erstellen...",
    appName: "",
    audience: "",
    concept: "",
    integrations: [],
    structure: "single-module",
    pattern: "MVVM"
  },
  {
    id: "vault",
    label: "🔐 Zero-Knowledge Note Vault",
    appName: "VaultNotes",
    audience: "Privacy-conscious professionals, journalists",
    concept: "A zero-knowledge encrypted local notes application using local-only hardware key generation and SQLCipher.",
    integrations: ["room_db", "biometrics", "workmanager"],
    structure: "single-module",
    pattern: "MVI"
  },
  {
    id: "2fa",
    label: "⏱️ Offline 2FA Authenticator",
    appName: "StealthAuth",
    audience: "Crypto-investors, security engineers",
    concept: "Local-only TOTP 2FA authenticator. CameraX for QR scanning. No cloud sync, QR-code based encrypted export only.",
    integrations: ["room_db", "biometrics", "notifications"],
    structure: "single-module",
    pattern: "MVVM"
  },
  {
    id: "health",
    label: "🩺 Encrypted Vitals Tracker",
    appName: "VitalsVault",
    audience: "Patients requiring extreme health data privacy",
    concept: "Local-only medication and symptom tracker. Uses WorkManager for offline alarms and strict Room data modeling.",
    integrations: ["room_db", "workmanager", "notifications"],
    structure: "single-module",
    pattern: "MVVM"
  }
];

export const normalizeBlueprint = (data: any): Blueprint => {
  const summaryTab = data.summaryTab || {
    appName: data.appName || 'Android App',
    vision: data.executiveSummary?.vision || 'No vision statement provided.',
    architecturePattern: data.architecturePattern || data.techStack?.architecturePattern || 'MVVM with Clean Architecture'
  };

  const databaseTab = data.databaseTab || {
    entityCode: data.dataModel?.roomEntityCode || '// Room Entities not provided',
    daoCode: data.dataModel?.kotlinDataClasses || '// Room DAO not provided'
  };

  const uiTab = data.uiTab || {
    composeCode: data.dataModel?.kotlinDataClasses || '// Compose code not provided'
  };

  const gradleTab = data.gradleTab || {
    dependencies: data.techStack?.dependencies?.map((d: any) => d.dependency) || []
  };

  const securityTab = data.securityTab || {
    concepts: data.securityPrivacy?.privacyByDesign || []
  };

  const executiveSummary = data.executiveSummary || {
    vision: summaryTab.vision,
    targetAudience: data.targetAudience || "Privacy-conscious professionals",
    architecturalGoals: securityTab.concepts && securityTab.concepts.length > 0 ? securityTab.concepts.slice(0, 4) : ["Ensure local-only encryption"]
  };

  const techStack = data.techStack || {
    language: "Kotlin",
    uiFramework: "Jetpack Compose (Material 3)",
    diFramework: "Dagger Hilt",
    architecturePattern: summaryTab.architecturePattern,
    persistence: "Room with SQLCipher",
    network: "Retrofit / Ktor",
    asyncFramework: "Kotlin Coroutines & Flow",
    dependencies: (gradleTab.dependencies || []).map((d: string) => {
      let cleanName = "Dependency";
      try {
        const parts = d.match(/["'](.*?)["']/);
        if (parts && parts[1]) {
          const splitParts = parts[1].split(':');
          cleanName = splitParts[splitParts.length - 2] || "Dependency";
        }
      } catch (e) {}
      return {
        name: cleanName,
        dependency: d,
        description: "Standard production dependency generated for your tech stack"
      };
    }),
    plugins: [
      { name: "Kotlin KSP", plugin: 'id("com.google.devtools.ksp") version "1.9.22-1.0.17"', description: "Kotlin Symbol Processing for Room" }
    ]
  };

  const coreFeatures = data.coreFeatures || [
    {
      name: "Uni-flow Architecture & Presentation",
      description: summaryTab.vision,
      implementationDetails: "Developed following the uni-directional MVI/MVVM pattern utilizing declarative UI layouts with Room offline persistence.",
      uiComponents: ["MainScreen", "UiStateObserver"],
      stateFlow: "UI Intent -> ViewModel -> Repository -> Database Flow"
    }
  ];

  const securityPrivacy = data.securityPrivacy || {
    dataPersistence: "Encrypted Room database using net.zetetic:android-database-sqlcipher",
    dataTransmission: "TLS 1.3 with Certificate Pinning enabled by default",
    androidKeystore: "Hardware-backed master key generation in Keystore",
    privacyByDesign: securityTab.concepts || []
  };

  const dataModel = data.dataModel || {
    jsonStructure: JSON.stringify({ status: "success", data: "encrypted" }, null, 2),
    kotlinDataClasses: uiTab.composeCode,
    roomEntityCode: databaseTab.entityCode + "\n\n" + databaseTab.daoCode
  };

  const packageStructure = data.packageStructure || {
    type: "single-module",
    tree: "app/src/main/java/com/vaultcore/app\n├── data\n│   └── local\n│       └── RoomDatabase.kt\n├── presentation\n│   └── ui\n│       └── ComposeScreens.kt\n└── build.gradle.kts"
  };

  return {
    ...data,
    summaryTab,
    databaseTab,
    uiTab,
    gradleTab,
    securityTab,
    executiveSummary,
    techStack,
    coreFeatures,
    securityPrivacy,
    dataModel,
    packageStructure
  };
};
