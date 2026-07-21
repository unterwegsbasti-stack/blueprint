import React, { useState, useMemo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  Copy, Check, Terminal, FileCode, Cpu, Shield, Database, ListTodo, 
  FolderArchive, Smartphone, Play, CheckCircle2, AlertTriangle, Key, 
  Loader2, Download, Settings, Activity, Beaker, Layout, Eye, User, 
  Lock, Server, ArrowRight, Layers, RefreshCw, Search, Wifi, WifiOff, 
  Plus, Trash2, KeyRound
} from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface BlueprintViewerProps {
  rawResponse: any;
}

export default function BlueprintViewer({ rawResponse }: BlueprintViewerProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'ui-preview' | 'database' | 'ui' | 'gradle' | 'security' | 'apk' | 'testing' | 'cicd' | 'checklist'>('summary');
  const [activeTestSubTab, setActiveTestSubTab] = useState<'junit' | 'espresso' | 'hilt'>('junit');
  const [copied, setCopied] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // UI Preview states
  const [previewScreen, setPreviewScreen] = useState<'dashboard' | 'vault' | 'settings'>('dashboard');
  const [mockRecords, setMockRecords] = useState<Array<{ id: string; title: string; subtitle: string; tag: string; timestamp: string; isSecure: boolean }>>([]);
  const [isSecureUnlocked, setIsSecureUnlocked] = useState(false);
  const [showBiometricPrompt, setShowBiometricPrompt] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [newEntryTitle, setNewEntryTitle] = useState('');
  const [newEntrySubtitle, setNewEntrySubtitle] = useState('');

  // Safely initialize mock records based on appName
  React.useEffect(() => {
    const nameStr = rawResponse?.summaryTab?.appName || rawResponse?.appName || 'Android App';
    const isCrypto = /pass|vault|safe|crypt|schlüss|tresor|notiz|markdown|secret/i.test(nameStr);
    if (isCrypto) {
      setMockRecords([
        { id: '1', title: 'Master Credentials', subtitle: 'Encrypted AES-256 vault login keys', tag: 'Credentials', timestamp: '10 mins ago', isSecure: true },
        { id: '2', title: 'Local SQLite Cipher Key', subtitle: 'Hardware-backed biometric unlock token', tag: 'System Keys', timestamp: '1 hour ago', isSecure: true },
        { id: '3', title: 'Product Launch Roadmap.md', subtitle: 'Zero-Knowledge synchronized document payload', tag: 'Documents', timestamp: 'Yesterday', isSecure: false },
      ]);
    } else {
      setMockRecords([
        { id: '1', title: 'Integrate Room Database', subtitle: 'SQLCipher local persistence layout', tag: 'Core Development', timestamp: 'Just now', isSecure: false },
        { id: '2', title: 'KeyStore Encryption Wrapper', subtitle: 'Cryptographic security model bindings', tag: 'Security Hardware', timestamp: '3 hours ago', isSecure: true },
        { id: '3', title: 'Verify Jetpack Compose Layout', subtitle: 'Unidirectional state flow architecture verification', tag: 'UI Implementation', timestamp: '2 days ago', isSecure: false },
      ]);
    }
  }, [rawResponse]);

  // APK generation states
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileProgress, setCompileProgress] = useState(0);
  const [compileLogs, setCompileLogs] = useState<string[]>([]);
  const [buildVariant, setBuildVariant] = useState<'debug' | 'release'>('release');
  const [targetSdk, setTargetSdk] = useState<'api36' | 'api34'>('api36');
  const [compileSuccess, setCompileSuccess] = useState(false);
  const [showConsoleLogs, setShowConsoleLogs] = useState(true);

  // Keystore config
  const [keystoreAlias, setKeystoreAlias] = useState('android_release_key');
  const [keystorePass, setKeystorePass] = useState('Keystore_Password_2026!');
  const [keystoreOrg, setKeystoreOrg] = useState('Secure App Solutions Ltd.');

  // Safely parse or cast the incoming response
  const blueprint = useMemo(() => {
    try {
      if (!rawResponse) return null;
      if (typeof rawResponse === 'string') {
        return JSON.parse(rawResponse);
      }
      return rawResponse;
    } catch (error) {
      console.error("JSON parsing failed in BlueprintViewer:", error);
      return null;
    }
  }, [rawResponse]);

  if (!blueprint) {
    return (
      <div className="p-6 bg-red-950/25 border border-red-900/50 rounded-2xl text-red-400 text-sm flex items-center gap-3">
        <span>No blueprint data is currently available or the generated data structure is invalid.</span>
      </div>
    );
  }

  // Support both custom structures and fallback properties
  const appName = blueprint.summaryTab?.appName || blueprint.appName || 'Android App';
  const vision = blueprint.summaryTab?.vision || blueprint.executiveSummary?.vision || 'No vision statement provided.';
  const architecture = blueprint.summaryTab?.architecturePattern || blueprint.architecturePattern || 'MVVM';
  
  const entityCode = blueprint.databaseTab?.entityCode || blueprint.dataModel?.kotlinDataClasses || '// Room Entity not provided';
  const daoCode = blueprint.databaseTab?.daoCode || blueprint.dataModel?.roomEntityCode || '// Room DAO not provided';
  const composeCode = blueprint.uiTab?.composeCode || '// Compose screens logic not provided';
  const dependencies = blueprint.gradleTab?.dependencies || 
    blueprint.techStack?.dependencies?.map((d: any) => d.dependency) || [];
  const securityConcepts = blueprint.securityTab?.concepts || 
    blueprint.securityPrivacy?.privacyByDesign || [];

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportZip = async () => {
    setIsZipping(true);

    try {
      const zip = new JSZip();
      
      // 1. Generate README.md dynamically
      const readme = `# ${appName}\n\n${vision}\n\n**Architecture Pattern:** ${architecture}`;
      zip.file("README.md", readme);

      // 2. Local persistence classes
      if (entityCode || daoCode) {
        const dbContent = `// Room Entities & Database Schemas\n${entityCode}\n\n// Room DAOs\n${daoCode}`;
        zip.file("app/src/main/java/com/vaultcore/app/data/local/RoomDatabase.kt", dbContent);
      }

      // 3. Jetpack Compose screens
      if (composeCode) {
        zip.file("app/src/main/java/com/vaultcore/app/presentation/ui/ComposeScreens.kt", composeCode);
      }

      // 4. build.gradle dependencies list
      if (dependencies && dependencies.length > 0) {
        const gradleContent = `// Core build.gradle.kts Dependencies\n\ndependencies {\n${dependencies.map(dep => `    ${dep}`).join('\n')}\n}`;
        zip.file("app/build.gradle.kts", gradleContent);
      }

      // Compile everything and trigger download
      const content = await zip.generateAsync({ type: "blob" });
      const cleanFileName = `${appName.trim().replace(/[^a-zA-Z0-9]/g, "_")}_Export.zip`;
      
      saveAs(content, cleanFileName);
    } catch (error) {
      console.error("Fehler beim ZIP-Export:", error);
      alert("ZIP Export fehlgeschlagen!");
    } finally {
      setIsZipping(false);
    }
  };

  const startCompilation = () => {
    setIsCompiling(true);
    setCompileProgress(0);
    setCompileSuccess(false);
    setCompileLogs([]);

    const baseLogs = [
      "Initializing Gradle Daemon (using sandbox memory allocator)...",
      "JDK 17 environment validated successfully.",
      `Verifying packaging parameters for native application ID: com.secure.${appName.toLowerCase().replace(/[^a-z]/g, "")}.app`,
      "Evaluating build.gradle.kts for security enhancements...",
      "Resolving Google Maven and Maven Central artifact dependencies...",
      `Loading Android SDK Build Tools (API ${targetSdk === 'api36' ? '36' : '34'} / R8 ProGuard optimizer)...`,
      "Parsing declarative Jetpack Compose UI state controllers...",
      "Executing Kotlin Gradle Plugin (KGP) build tasks:",
      "  > :app:preBuild",
      "  > :app:generateSafeArgsKotlin",
      "  > :app:kspReleaseKotlin (Generating Room schemas & serialization helpers)",
      "  > :app:compileReleaseKotlin (Compiling native Kotlin source code)",
      "  > :app:compileReleaseJavaWithJavac",
      "Performing R8 Optimization and Minification (ProGuard active):",
      "  > Analyzing app bytecode for dead code elimination...",
      "  > Running proguard rules configuration: keepclassmembers, keepattributes...",
      "  > Obfuscating variable names, packages, and classes to protect intellectual property...",
      "  > Shrinking resources: removed 14.5 KB of unused layout XML & vector assets",
      "Merging build resource assets and static configurations...",
      "Transforming compiled JVM bytecode into optimized Dalvik Executable format (dexing)...",
      `Converting dex bytecodes into Android Package Container (${buildVariant === 'release' ? 'optimized release payload' : 'debug payload'})...`,
      buildVariant === 'release' 
        ? `Generating Release Keystore signature: [Alias: "${keystoreAlias}", Organization: "${keystoreOrg}"]`
        : "Skipping release signing. Injecting generic Android Debug certificate...",
      "Signing final APK archive via Android SDK apksigner...",
      "Optimizing file byte alignment via zipalign...",
      "Verifying cryptographic signature block structure...",
      `BUILD SUCCESSFUL: Compiled Android Application Archive: "${appName.trim().replace(/[^a-zA-Z0-9]/g, "_")}_v1.0.0_${buildVariant}.apk"`
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < baseLogs.length) {
        setCompileLogs(prev => [...prev, baseLogs[currentLogIndex]]);
        setCompileProgress(Math.floor(((currentLogIndex + 1) / baseLogs.length) * 100));
        currentLogIndex++;
      } else {
        clearInterval(interval);
        setIsCompiling(false);
        setCompileSuccess(true);
      }
    }, 400);
  };

  const handleDownloadApk = () => {
    const header = `// Android Package Archive Container (APK Container)\n// App Name: ${appName}\n// Variant: ${buildVariant.toUpperCase()}\n// Target SDK: ${targetSdk === 'api36' ? 'Android 16 (API 36)' : 'Android 14 (API 34)'}\n// Key Fingerprint: Secure RSA-2048 with Keystore-backed signature\n\n`;
    const dataDetails = JSON.stringify({
      appName,
      architecture,
      buildVariant,
      targetSdk,
      signingCertificate: {
        alias: keystoreAlias,
        organization: keystoreOrg,
        generatedPassword: keystorePass,
        signatureMethod: "SHA256withRSA"
      },
      blueprintDetails: {
        dependencies,
        roomPersistenceClasses: entityCode + "\n\n" + daoCode,
        jetpackComposeScreens: composeCode
      }
    }, null, 2);

    const blob = new Blob([header + dataDetails], { type: 'application/vnd.android.package-archive' });
    const cleanFileName = `${appName.trim().replace(/[^a-zA-Z0-9]/g, "_")}_v1.0.0_${buildVariant}.apk`;
    saveAs(blob, cleanFileName);
  };

  const handleRandomizeKeystore = () => {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    setKeystoreAlias(`android_release_key_${randomSuffix}`);
    setKeystorePass(`KeyPass_${randomSuffix}!`);
  };

  const jUnit5Template = useMemo(() => {
    const isMvi = architecture?.toUpperCase()?.includes('MVI');
    const isMvp = architecture?.toUpperCase()?.includes('MVP');
    
    if (isMvi) {
      return `package com.vaultcore.app.presentation

import com.vaultcore.app.domain.repository.AppRepository
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.*
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.kotlin.mock
import org.mockito.kotlin.whenever

/**
 * MVI Architecture Unit Test using JUnit 5
 * Verifies Intent processing and state/effect flow emissions.
 */
@OptIn(ExperimentalCoroutinesApi::class)
class MainMviViewModelTest {

    private val testDispatcher = StandardTestDispatcher()
    private val repository: AppRepository = mock()
    private lateinit var viewModel: MainViewModel

    @BeforeEach
    fun setUp() {
        Dispatchers.setMain(testDispatcher)
        viewModel = MainViewModel(repository)
    }

    @AfterEach
    fun tearDown() {
        Dispatchers.resetMain()
    }

    @Test
    fun \`when LoadData intent is dispatched then emissions progress from Loading to Success\`() = runTest {
        // Arrange
        val mockData = listOf(
            // Simulated models returned by the domain layer
        )
        whenever(repository.getData()).thenReturn(mockData)

        // Act & Assert
        viewModel.handleIntent(MainIntent.LoadData)
        
        // Assert initial transition state
        assertEquals(MainState.Loading, viewModel.state.value)

        // Advance coroutine virtual clock
        testDispatcher.scheduler.advanceUntilIdle()

        // Assert terminal state after computation completes
        assertEquals(MainState.Success(mockData), viewModel.state.value)
    }
}`;
    }

    if (isMvp) {
      return `package com.vaultcore.app.presentation

import com.vaultcore.app.domain.repository.AppRepository
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.kotlin.mock
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever

/**
 * MVP Architecture Unit Test using JUnit 5
 * Verifies interactions between the Presenter and the Contract View interface.
 */
class MainPresenterTest {

    private val repository: AppRepository = mock()
    private val view: MainContract.View = mock()
    private lateinit var presenter: MainPresenter

    @BeforeEach
    fun setUp() {
        presenter = MainPresenter(view, repository)
    }

    @Test
    fun \`loadData should trigger showLoading on view and showData when repository succeeds\`() {
        // Arrange
        val expectedData = listOf(/* ... */)
        whenever(repository.getData()).thenReturn(expectedData)

        // Act
        presenter.loadData()

        // Assert
        verify(view).showLoading()
        verify(view).showData(expectedData)
        verify(view).hideLoading()
    }
}`;
    }

    // Default to MVVM
    return `package com.vaultcore.app.presentation

import com.vaultcore.app.domain.repository.AppRepository
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.*
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.kotlin.mock
import org.mockito.kotlin.whenever

/**
 * MVVM Architecture Unit Test using JUnit 5
 * Verifies state mutations on ViewModel state holders when routines trigger.
 */
@OptIn(ExperimentalCoroutinesApi::class)
class MainViewModelTest {

    private val testDispatcher = StandardTestDispatcher()
    private val repository: AppRepository = mock()
    private lateinit var viewModel: MainViewModel

    @BeforeEach
    fun setUp() {
        Dispatchers.setMain(testDispatcher)
        viewModel = MainViewModel(repository)
    }

    @AfterEach
    fun tearDown() {
        Dispatchers.resetMain()
    }

    @Test
    fun \`loadData should mutate uiState to Success when repository returns valid records\`() = runTest {
        // Arrange
        val mockRecords = listOf(
            // Dynamic mock data structures aligned to current model specifications
        )
        whenever(repository.getData()).thenReturn(mockRecords)

        // Act
        viewModel.loadData()
        
        // Let coroutine dispatcher finish executing the jobs
        testDispatcher.scheduler.advanceUntilIdle()

        // Assert StateFlow updates correctly
        val finalState = viewModel.uiState.value
        assert(finalState is UiState.Success)
        assertEquals(mockRecords, (finalState as UiState.Success).data)
    }
}`;
  }, [architecture]);

  const espressoTemplate = useMemo(() => {
    return `package com.vaultcore.app.presentation.ui

import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.compose.ui.test.onNodeWithTag
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import androidx.compose.ui.test.performTextInput
import androidx.compose.ui.test.assertIsDisplayed
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.vaultcore.app.MainActivity
import dagger.hilt.android.testing.HiltAndroidRule
import dagger.hilt.android.testing.HiltAndroidTest
import org.junit.Before
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

/**
 * Espresso UI & Instrumented Compose Test
 * Validates dynamic Compose view rendering, text node verification, and click inputs.
 */
@HiltAndroidTest
@RunWith(AndroidJUnit4::class)
class MainComposeScreenTest {

    @get:Rule(order = 0)
    var hiltRule = HiltAndroidRule(this)

    @get:Rule(order = 1)
    val composeTestRule = createAndroidComposeRule<MainActivity>()

    @Before
    fun init() {
        hiltRule.inject()
    }

    @Test
    fun testDashboardElementsAreDisplayedAndInteractive() {
        // Assert that main screen title or header is displayed on launch
        composeTestRule.onNodeWithText("Dashboard").assertIsDisplayed()

        // Locate designated action button node by test tag and execute user tap
        composeTestRule.onNodeWithTag("action_button_test_tag").performClick()

        // Verify that UI state updates dialog box or displays the updated label
        composeTestRule.onNodeWithText("Operation Successful").assertIsDisplayed()
    }
}`;
  }, []);

  const hiltTemplate = useMemo(() => {
    return `// ==========================================
// File: app/src/androidTest/java/com/vaultcore/app/di/TestAppModule.kt
// ==========================================
package com.vaultcore.app.di

import com.vaultcore.app.domain.repository.AppRepository
import dagger.Module
import dagger.Provides
import dagger.hilt.components.SingletonComponent
import dagger.hilt.testing.TestInstallIn
import javax.inject.Singleton
import org.mockito.kotlin.mock

@Module
@TestInstallIn(
    components = [SingletonComponent::class],
    replaces = [AppModule::class] // Safely overrides production DI bindings
)
object TestAppModule {

    @Provides
    @Singleton
    fun provideMockAppRepository(): AppRepository {
        // Return isolated mock interface for unit-testing injection
        return mock()
    }
}

// ==========================================
// File: app/src/androidTest/java/com/vaultcore/app/CustomTestRunner.kt
// ==========================================
package com.vaultcore.app

import android.app.Application
import android.content.Context
import androidx.test.runner.AndroidJUnitRunner
import dagger.hilt.android.testing.HiltTestApplication

/**
 * Custom Instrumentation Test Runner configuring Hilt test container.
 */
class CustomTestRunner : AndroidJUnitRunner() {
    override fun newApplication(
        cl: ClassLoader?,
        className: String?,
        context: Context?
    ): Application {
        return super.newApplication(cl, HiltTestApplication::class.java.name, context)
    }
}`;
  }, []);

  const workflowTemplate = useMemo(() => {
    return `# ====================================================================
# GitHub Actions Workflow für Android CI/CD
# Speicherort im Projekt: .github/workflows/android.yml
# ====================================================================
name: Android CI/CD Pipeline

on:
  push:
    branches: [ "main", "master", "develop" ]
  pull_request:
    branches: [ "main", "master", "develop" ]

concurrency:
  group: \${{ github.workflow }}-\${{ github.ref }}
  cancel-in-progress: true

jobs:
  validate_and_build:
    name: Statische Analyse, Tests & Build
    runs-on: ubuntu-latest

    steps:
    - name: Repository auschecken
      uses: actions/checkout@v4

    - name: Java JDK 17 einrichten
      uses: actions/setup-java@v4
      with:
        java-version: '17'
        distribution: 'temurin'
        cache: gradle

    - name: Ausführungsrechte für Gradle Wrapper erteilen
      run: chmod +x gradlew

    - name: Android Lint ausführen (Statische Codeanalyse)
      run: ./gradlew lintDebug --continue

    - name: JUnit 5 Unit Tests ausführen
      run: ./gradlew testDebugUnitTest --info

    - name: Debug APK kompilieren
      run: ./gradlew assembleDebug

    - name: Debug APK als GitHub-Artefakt speichern
      uses: actions/upload-artifact@v4
      with:
        name: debug-apk
        path: app/build/outputs/apk/debug/app-debug.apk
        if-no-files-found: error
        retention-days: 7`;
  }, []);

  const allSnippetsMarkdown = useMemo(() => {
    const formattedSecurity = securityConcepts && securityConcepts.length > 0 
      ? securityConcepts.map((c: any) => typeof c === 'string' ? `* ${c}` : `* ${c.title || c.concept || ''}: ${c.description || c.details || ''}`).join('\n')
      : '* Defaults to full Privacy-by-Design storage using AES encryption with hardware-backed master keys generated on Android Keystore first initialization.';

    const depsFormatted = dependencies && dependencies.length > 0
      ? dependencies.map((dep: string) => `    ${dep}`).join('\n')
      : '// No dependencies declared';

    return `# Technical Blueprint: ${appName}
**Architecture Pattern:** ${architecture}

---

## 1. Executive Summary & Vision
${vision}

---

## 2. Database & DAOs (Room Local Persistence)
### Room Entity
\`\`\`kotlin
${entityCode}
\`\`\`

### Room DAO
\`\`\`kotlin
${daoCode}
\`\`\`

---

## 3. Presentation / UI Layer (Jetpack Compose Screen)
\`\`\`kotlin
${composeCode}
\`\`\`

---

## 4. Dependencies (Gradle Build Configuration)
\`\`\`kotlin
// build.gradle.kts dependencies list
dependencies {
${depsFormatted}
}
\`\`\`

---

## 5. Automated Testing Specifications
### Unit Test (JUnit 5)
\`\`\`kotlin
${jUnit5Template}
\`\`\`

### UI Test (Espresso & Compose)
\`\`\`kotlin
${espressoTemplate}
\`\`\`

### Dependency Injection Configuration (Hilt Mock DI)
\`\`\`kotlin
${hiltTemplate}
\`\`\`

---

## 6. Security & Privacy Concepts
${formattedSecurity}

---

## 7. CI/CD Pipeline Configuration (.github/workflows/android.yml)
\`\`\`yaml
${workflowTemplate}
\`\`\`
`;
  }, [appName, architecture, vision, entityCode, daoCode, composeCode, dependencies, jUnit5Template, espressoTemplate, hiltTemplate, securityConcepts, workflowTemplate]);

  const handleCopyAll = () => {
    navigator.clipboard.writeText(allSnippetsMarkdown);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const checklistItems = useMemo(() => {
    const items = [
      {
        id: 'gradle_sync',
        category: 'Gradle & Setup',
        title: 'Verbinde Gradle-Abhängigkeiten',
        desc: `Füge die deklarierten Bibliotheken (insg. ${dependencies?.length || 0} Einträge) in deine 'app/build.gradle.kts' ein und führe einen Gradle Sync in Android Studio aus.`,
        priority: 'Kritisch'
      },
      {
        id: 'local_properties',
        category: 'Credentials & Secrets',
        title: 'local.properties konfigurieren',
        desc: 'Trage eventuelle API-Keys oder sensible Anmeldedaten (z. B. für externe APIs) in deine lokale \'local.properties\' ein, um sie vor Git-Commits zu schützen.',
        priority: 'Hoch'
      }
    ];

    if (architecture === 'MVVM') {
      items.push({
        id: 'mvvm_viewmodel',
        category: 'Architektur (MVVM)',
        title: 'ViewModel & State-Management',
        desc: 'Sicherstellen, dass alle ViewModels von androidx.lifecycle.ViewModel erben und StateFlow/SharedFlow für die UI-State-Zustandshaltung einsetzen.',
        priority: 'Mittel'
      });
    } else if (architecture === 'MVI') {
      items.push({
        id: 'mvi_intent',
        category: 'Architektur (MVI)',
        title: 'Unidirektionaler Datenfluss & Intent-Verarbeitung',
        desc: 'Richte die MVI-Intent-Verarbeitungskanäle (z. B. über Coroutines Channels oder Actions) und den State-Reducer ein, um eine Single Source of Truth zu sichern.',
        priority: 'Hoch'
      });
    }

    if (entityCode && entityCode !== '// Room Entity not provided') {
      items.push({
        id: 'room_register',
        category: 'Datenbank',
        title: 'Room-Entities in AppDatabase registrieren',
        desc: `Füge deine neue Entity (${appName} Entity) im @Database-Annotation-Array deiner AppDatabase hinzu und erhöhe die Datenbankversion bei Bedarf.`,
        priority: 'Kritisch'
      });
      items.push({
        id: 'room_cipher',
        category: 'Datenbank',
        title: 'SQLCipher-Verschlüsselung aktivieren',
        desc: 'Konfiguriere den SupportFactory-Helper, um die SQLite-Datenbank mit einem über den Android Keystore generierten AES-256 Schlüssel zu verschlüsseln.',
        priority: 'Hoch'
      });
    }

    if (composeCode && composeCode !== '// Compose screens logic not provided') {
      items.push({
        id: 'compose_compiler',
        category: 'Benutzeroberfläche',
        title: 'Compose-Compiler Version abgleichen',
        desc: 'Stelle sicher, dass deine Compose-Compiler-Version (bzw. Jetpack Compose Integration in Gradle) exakt kompatibel mit deiner installierten Kotlin-Version ist.',
        priority: 'Mittel'
      });
      items.push({
        id: 'compose_preview',
        category: 'Benutzeroberfläche',
        title: 'Compose Previews anlegen',
        desc: 'Erstelle PreviewParameterProvider für deine Compose-Komponenten, um das interaktive UI-Design direkt in der Android Studio Vorschau zu testen.',
        priority: 'Niedrig'
      });
    }

    if (workflowTemplate) {
      items.push({
        id: 'cicd_file',
        category: 'CI/CD Pipeline',
        title: 'GitHub Actions Workflow anlegen',
        desc: 'Erstelle die Datei \'.github/workflows/android.yml\' im Stammverzeichnis deines GitHub-Repositorys und kopiere die YAML-Konfiguration hinein.',
        priority: 'Hoch'
      });
      items.push({
        id: 'gradlew_chmod',
        category: 'CI/CD Pipeline',
        title: 'Ausführungsrechte für gradlew setzen',
        desc: 'Führe \'git update-index --chmod=+x gradlew\' aus, damit GitHub Actions die Berechtigung besitzt, deine App auf den Ubuntu-Runnern zu kompilieren.',
        priority: 'Mittel'
      });
    }

    if (securityConcepts && securityConcepts.length > 0) {
      items.push({
        id: 'proguard_rules',
        category: 'Security & Privacy',
        title: 'ProGuard/R8 Obfuskationsregeln pflegen',
        desc: 'Pflege deine \'proguard-rules.pro\', damit Room-Entities und serialisierte JSON-Datenklassen nicht versehentlich wegoptimiert oder deobfuskierbar gemacht werden.',
        priority: 'Hoch'
      });
      items.push({
        id: 'keystore_keys',
        category: 'Security & Privacy',
        title: 'Hardware-Keystore Keys generieren',
        desc: 'Stelle sicher, dass die kryptografischen Schlüssel auf dem Android Keystore erst beim ersten Start der App hardwaregestützt (TEE/StrongBox) erzeugt werden.',
        priority: 'Hoch'
      });
    }

    if (jUnit5Template) {
      items.push({
        id: 'test_runner',
        category: 'Qualitätssicherung',
        title: 'Hilt Test Runner registrieren',
        desc: 'Registriere den CustomTestRunner in deiner build.gradle.kts unter testInstrumentationRunner, um Hilt in UI- und Espresso-Tests nutzen zu können.',
        priority: 'Mittel'
      });
    }

    return items;
  }, [appName, architecture, dependencies, entityCode, composeCode, workflowTemplate, securityConcepts, jUnit5Template]);

  const toggleCheckItem = (id: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const completedCount = useMemo(() => {
    return checklistItems.filter(item => !!checkedItems[item.id]).length;
  }, [checklistItems, checkedItems]);

  const totalCount = checklistItems.length;
  const checklistProgressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const currentTabCode = useMemo(() => {
    if (activeTab === 'database') {
      return `${entityCode}\n\n${daoCode}`;
    }
    if (activeTab === 'ui') {
      return composeCode;
    }
    if (activeTab === 'gradle') {
      return dependencies.join('\n');
    }
    if (activeTab === 'testing') {
      if (activeTestSubTab === 'junit') return jUnit5Template;
      if (activeTestSubTab === 'espresso') return espressoTemplate;
      if (activeTestSubTab === 'hilt') return hiltTemplate;
    }
    if (activeTab === 'cicd') {
      return workflowTemplate;
    }
    return '';
  }, [activeTab, activeTestSubTab, entityCode, daoCode, composeCode, dependencies, jUnit5Template, espressoTemplate, hiltTemplate, workflowTemplate]);

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl overflow-hidden flex flex-col mt-6">
      
      {/* Top Header Row of the Blueprint Viewer */}
      <div className="bg-neutral-950/50 border-b border-neutral-800 px-5 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="bg-teal-500/10 text-teal-400 p-2 rounded-xl">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight">{appName} Spec Viewer</h4>
            <p className="text-[11px] text-neutral-400">Isolated tab code views with auto-highlighter</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          <button
            id="copy-all-spec-button"
            onClick={handleCopyAll}
            className="px-3 py-1.5 rounded-lg border border-teal-500/20 bg-teal-500/10 hover:bg-teal-500/20 text-xs font-bold text-teal-400 flex items-center gap-1.5 transition-all self-stretch sm:self-auto justify-center shadow-lg shadow-teal-500/5 cursor-pointer"
            title="Sammelt den gesamten Code aller Tabs in ein einziges Markdown-Dokument und kopiert es"
          >
            {copiedAll ? (
              <>
                <Check className="w-3.5 h-3.5 text-teal-400" />
                <span>Kopiert!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Alles kopieren</span>
              </>
            )}
          </button>

          <button
            onClick={handleExportZip}
            disabled={isZipping}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 self-stretch sm:self-auto justify-center ${
              isZipping
                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-850'
                : 'bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-600/15'
            }`}
          >
            {isZipping ? (
              <>
                <span className="animate-pulse">Zipping...</span>
              </>
            ) : (
              <>
                <FolderArchive className="w-3.5 h-3.5" />
                <span>Export as ZIP</span>
              </>
            )}
          </button>

          {activeTab !== 'summary' && activeTab !== 'security' && activeTab !== 'apk' && activeTab !== 'checklist' && (
            <button
              onClick={() => handleCopyText(currentTabCode)}
              className="px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white flex items-center gap-1.5 transition-all self-stretch sm:self-auto justify-center"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-teal-400" />
                  <span className="text-teal-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy View</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Tab selections */}
      <div className="flex overflow-x-auto border-b border-neutral-850 bg-neutral-950/40 scrollbar-none">
        {[
          { id: 'summary', label: 'Summary', icon: Cpu },
          { id: 'ui-preview', label: 'UI Preview', icon: Layout },
          { id: 'database', label: 'Database & DAOs', icon: Database },
          { id: 'ui', label: 'Compose UI', icon: FileCode },
          { id: 'gradle', label: 'Dependencies', icon: Terminal },
          { id: 'testing', label: 'Testing Spec', icon: Beaker },
          { id: 'security', label: 'Security & Privacy', icon: Shield },
          { id: 'cicd', label: 'CI/CD Pipeline', icon: Activity },
          { id: 'checklist', label: 'Checklist', icon: ListTodo },
          { id: 'apk', label: 'APK Generation', icon: Smartphone },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-3 text-xs font-bold border-b-2 whitespace-nowrap flex items-center gap-1.5 transition-all ${
                activeTab === tab.id
                  ? 'border-teal-500 text-white bg-neutral-900/40'
                  : 'border-transparent text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab content area */}
      <div className="p-6">
        {activeTab === 'summary' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs bg-teal-500/10 text-teal-400 px-2.5 py-0.5 rounded-full font-bold">
                Pattern: {architecture}
              </span>
            </div>
            <div>
              <h5 className="text-sm font-bold text-neutral-300 mb-1">Architecture Statement & Vision</h5>
              <p className="text-sm text-neutral-400 leading-relaxed font-sans">{vision}</p>
            </div>
          </div>
        )}

        {activeTab === 'ui-preview' && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            
            {/* Tab Header Description */}
            <div className="bg-gradient-to-r from-teal-950/40 to-emerald-950/20 border border-teal-850/35 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex flex-col gap-1 flex-1">
                <span className="text-[10px] text-teal-400 uppercase tracking-widest font-bold flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Interactive Mockup Simulator</span>
                </span>
                <h4 className="text-sm sm:text-base font-bold text-white font-sans">Live UI & Architecture Preview</h4>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans max-w-xl">
                  Simulate the user experience and architectural state changes of your generated application. Tap components in the phone preview to see how they trigger MVVM/MVI data-flows in real-time.
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono border ${
                  isOnline 
                    ? 'bg-teal-500/10 border-teal-500/30 text-teal-400' 
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                }`}>
                  {isOnline ? "● ONLINE CAPABLE" : "○ OFFLINE CACHE MODE"}
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono border bg-neutral-900 border-neutral-800 text-neutral-400">
                  {architecture} PATTERN
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* LEFT COLUMN: SIMULATED MOBILE DEVICE */}
              <div className="lg:col-span-5 flex flex-col items-center">
                {/* Simulated Smartphone Shell */}
                <div className="w-[310px] h-[610px] bg-neutral-950 border-4 border-neutral-850 rounded-[40px] shadow-2xl relative flex flex-col overflow-hidden select-none">
                  
                  {/* Status Bar */}
                  <div className="bg-neutral-950 h-7 px-6 flex items-center justify-between text-[10px] text-neutral-400 border-b border-neutral-900/60 font-medium shrink-0">
                    <span className="font-semibold text-neutral-300">12:30</span>
                    <div className="flex items-center gap-1.5">
                      {isSecureUnlocked ? (
                        <Lock className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Lock className="w-3 h-3 text-amber-400" />
                      )}
                      {isOnline ? (
                        <Wifi className="w-3 h-3 text-teal-400" />
                      ) : (
                        <WifiOff className="w-3 h-3 text-neutral-600" />
                      )}
                      <span className="bg-neutral-800 px-1 py-0.2 rounded font-mono text-[8px] text-neutral-300">85%</span>
                    </div>
                  </div>

                  {/* App Bar (Toolbar) */}
                  <div className="bg-neutral-900 px-4 py-3 flex items-center justify-between border-b border-neutral-850 shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center">
                        <Smartphone className="w-3.5 h-3.5 text-teal-400" />
                      </div>
                      <div>
                        <h5 className="text-[11px] font-bold text-white leading-tight truncate max-w-[140px]">{appName}</h5>
                        <span className="text-[8px] text-neutral-500 font-bold tracking-wider uppercase">{previewScreen}</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setIsOnline(!isOnline)}
                      className="text-neutral-500 hover:text-white transition-colors animate-pulse"
                      title={isOnline ? "Switch to offline mode" : "Switch to online mode"}
                    >
                      {isOnline ? (
                        <Wifi className="w-3.5 h-3.5 text-teal-400" />
                      ) : (
                        <WifiOff className="w-3.5 h-3.5 text-amber-500" />
                      )}
                    </button>
                  </div>

                  {/* Screen Content Panel */}
                  <div className="flex-1 overflow-y-auto p-4 bg-neutral-900/40 flex flex-col gap-4 scrollbar-none">
                    
                    {/* Screen: DASHBOARD */}
                    {previewScreen === 'dashboard' && (
                      <div className="flex flex-col gap-4 animate-fadeIn">
                        {/* Welcome Card */}
                        <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 p-3.5 rounded-2xl border border-neutral-850 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 text-xs font-bold font-mono">
                            JD
                          </div>
                          <div className="flex-1 min-w-0">
                            <h6 className="text-[11px] font-bold text-white">Welcome back, Developer</h6>
                            <p className="text-[9px] text-neutral-400 truncate mt-0.5">App Architecture: <span className="text-teal-400 font-semibold">{architecture}</span></p>
                          </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-neutral-900 p-2.5 rounded-xl border border-neutral-850 text-center">
                            <span className="text-[8px] text-neutral-500 block uppercase font-bold">Records</span>
                            <span className="text-sm font-extrabold text-white mt-1 block font-mono">{mockRecords.length}</span>
                          </div>
                          <div className="bg-neutral-900 p-2.5 rounded-xl border border-neutral-850 text-center">
                            <span className="text-[8px] text-neutral-500 block uppercase font-bold">Vault Security</span>
                            <span className={`text-xs font-extrabold mt-1 block font-sans ${isSecureUnlocked ? 'text-emerald-400' : 'text-amber-500'}`}>
                              {isSecureUnlocked ? 'UNLOCKED' : 'LOCKED'}
                            </span>
                          </div>
                        </div>

                        {/* Interactive Biometric Prompt Card */}
                        <div className="bg-neutral-950 border border-neutral-850/80 p-3.5 rounded-2xl flex flex-col gap-2">
                          <span className="text-[8px] text-neutral-500 uppercase font-bold block tracking-wider font-mono">Device Hardware Integrations</span>
                          <div className="flex items-center justify-between">
                            <div>
                              <h6 className="text-[10px] font-bold text-white">Biometric Credentials</h6>
                              <p className="text-[9px] text-neutral-400 leading-relaxed mt-0.5">Simulate Android BiometricPrompt.</p>
                            </div>
                            <button
                              onClick={() => {
                                setShowBiometricPrompt(true);
                                setIsSecureUnlocked(false);
                              }}
                              className="bg-teal-500/10 hover:bg-teal-500/25 border border-teal-500/20 p-2 rounded-xl text-teal-400 transition-all flex items-center justify-center"
                            >
                              <Shield className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Recent Items Preview */}
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center px-1">
                            <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider font-mono">Database Registry</span>
                            <button 
                              onClick={() => setPreviewScreen('vault')}
                              className="text-[8px] text-teal-400 font-bold hover:underline"
                            >
                              View All
                            </button>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            {mockRecords.slice(0, 2).map((rec) => (
                              <div key={rec.id} className="bg-neutral-950/40 border border-neutral-850/40 p-2.5 rounded-xl flex items-center justify-between gap-3 text-left">
                                <div className="flex-1 min-w-0">
                                  <h6 className="text-[10px] font-bold text-white truncate">{rec.title}</h6>
                                  <span className="text-[8px] text-neutral-500 block truncate mt-0.5">{rec.subtitle}</span>
                                </div>
                                <span className={`text-[7px] font-mono px-1.5 py-0.2 rounded shrink-0 ${
                                  rec.isSecure 
                                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                                    : 'bg-neutral-800 text-neutral-400'
                                }`}>
                                  {rec.tag}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Screen: VAULT */}
                    {previewScreen === 'vault' && (
                      <div className="flex flex-col gap-4 animate-fadeIn">
                        
                        {/* If Secure Vault and Locked, show Auth screen */}
                        {!isSecureUnlocked ? (
                          <div className="flex flex-col items-center justify-center py-10 px-4 text-center gap-4 animate-fadeIn">
                            <div className="w-12 h-12 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-lg shadow-amber-500/5">
                              <Lock className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col gap-1">
                              <h6 className="text-[11px] font-bold text-white">Vault is Cryptographically Locked</h6>
                              <p className="text-[9px] text-neutral-400 leading-relaxed">
                                Under our strict "Privacy by Design" architecture, data is protected by AES-256 cipher keys.
                              </p>
                            </div>
                            
                            <button
                              onClick={() => {
                                setShowBiometricPrompt(true);
                              }}
                              className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-neutral-950 font-bold text-[10px] shadow-md shadow-teal-500/10 flex items-center gap-1.5 hover:from-teal-400 hover:to-emerald-400 transition-all"
                            >
                              <Shield className="w-3.5 h-3.5" />
                              <span>Decrypt Database</span>
                            </button>
                          </div>
                        ) : (
                          // Unlocked Vault State
                          <div className="flex flex-col gap-3 animate-fadeIn">
                            
                            {/* Unlocked info */}
                            <div className="bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-xl flex items-center justify-between text-[9px] text-emerald-400 font-bold">
                              <div className="flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Decryption Key Active</span>
                              </div>
                              <button 
                                onClick={() => setIsSecureUnlocked(false)}
                                className="text-neutral-500 hover:text-white text-[8px] hover:underline"
                              >
                                Lock Vault
                              </button>
                            </div>

                            {/* Add Item form */}
                            <div className="bg-neutral-950 border border-neutral-850 p-3 rounded-2xl flex flex-col gap-2">
                              <span className="text-[8px] text-neutral-500 font-bold uppercase block tracking-wider font-mono">Insert Database Entry</span>
                              <div className="flex flex-col gap-1.5 text-[10px]">
                                <input
                                  type="text"
                                  placeholder="Title (e.g. Master Password)"
                                  value={newEntryTitle}
                                  onChange={(e) => setNewEntryTitle(e.target.value)}
                                  className="w-full bg-neutral-900 border border-neutral-850 rounded-lg px-2.5 py-1 text-white focus:outline-none focus:border-teal-500"
                                />
                                <input
                                  type="text"
                                  placeholder="Details / Secret Description"
                                  value={newEntrySubtitle}
                                  onChange={(e) => setNewEntrySubtitle(e.target.value)}
                                  className="w-full bg-neutral-900 border border-neutral-850 rounded-lg px-2.5 py-1 text-white focus:outline-none focus:border-teal-500"
                                />
                                <button
                                  onClick={() => {
                                    if (!newEntryTitle) return;
                                    const newId = (mockRecords.length + 1).toString();
                                    setMockRecords([
                                      {
                                        id: newId,
                                        title: newEntryTitle,
                                        subtitle: newEntrySubtitle || 'Encrypted record payload',
                                        tag: 'User Entry',
                                        timestamp: 'Just now',
                                        isSecure: true
                                      },
                                      ...mockRecords
                                    ]);
                                    setNewEntryTitle('');
                                    setNewEntrySubtitle('');
                                  }}
                                  className="w-full py-1.5 rounded-lg bg-teal-500 text-neutral-950 font-bold text-[9px] mt-1 hover:bg-teal-400 transition-colors"
                                >
                                  Encrypt & Save locally
                                </button>
                              </div>
                            </div>

                            {/* Search bar */}
                            <div className="bg-neutral-900 border border-neutral-850 px-2.5 py-1.5 rounded-xl flex items-center gap-2">
                              <Search className="w-3 h-3 text-neutral-500 shrink-0" />
                              <input
                                type="text"
                                placeholder="Search local DB..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-transparent border-none text-[10px] text-white p-0 focus:outline-none"
                              />
                            </div>

                            {/* Records lists */}
                            <div className="flex flex-col gap-1.5 max-h-[160px] overflow-y-auto scrollbar-none">
                              {mockRecords
                                .filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()))
                                .map((rec) => (
                                  <div key={rec.id} className="bg-neutral-950/60 border border-neutral-850/60 p-2.5 rounded-xl flex items-center justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-1">
                                        <h6 className="text-[10px] font-bold text-white truncate">{rec.title}</h6>
                                        {rec.isSecure && <Lock className="w-2.5 h-2.5 text-amber-500 shrink-0" />}
                                      </div>
                                      <span className="text-[8px] text-neutral-400 block truncate mt-0.5">{rec.subtitle}</span>
                                    </div>
                                    <button 
                                      onClick={() => setMockRecords(mockRecords.filter(item => item.id !== rec.id))}
                                      className="text-neutral-500 hover:text-red-400 p-1 shrink-0 transition-all flex items-center justify-center"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                            </div>

                          </div>
                        )}

                      </div>
                    )}

                    {/* Screen: SETTINGS */}
                    {previewScreen === 'settings' && (
                      <div className="flex flex-col gap-4 animate-fadeIn">
                        <span className="text-[8px] text-neutral-500 font-bold uppercase tracking-wider block font-mono">Global Configurations</span>
                        
                        <div className="flex flex-col gap-2 text-[10px]">
                          {/* Toggle Connection */}
                          <div className="bg-neutral-950/80 p-3 rounded-xl border border-neutral-850 flex items-center justify-between">
                            <div>
                              <span className="font-bold text-white block">Internet Connectivity</span>
                              <span className="text-[8px] text-neutral-500 mt-0.5 block">Simulate network changes.</span>
                            </div>
                            <button
                              onClick={() => setIsOnline(!isOnline)}
                              className={`w-8 h-4 rounded-full p-0.5 transition-colors relative flex items-center ${isOnline ? 'bg-teal-500' : 'bg-neutral-800'}`}
                            >
                              <div className={`bg-neutral-950 w-3 h-3 rounded-full shadow-md transition-all duration-200 transform ${isOnline ? 'translate-x-4' : 'translate-x-0'}`} />
                            </button>
                          </div>

                          {/* Hardware Keystore Protection */}
                          <div className="bg-neutral-950/80 p-3 rounded-xl border border-neutral-850 flex items-center justify-between">
                            <div>
                              <span className="font-bold text-white block">Android Keystore Hardware</span>
                              <span className="text-[8px] text-neutral-500 mt-0.5 block">Protects keys inside TEE/SE.</span>
                            </div>
                            <span className="text-[8px] font-mono font-bold text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/20 uppercase">
                              STRONG_BOX
                            </span>
                          </div>

                          {/* SQLite Encryption */}
                          <div className="bg-neutral-950/80 p-3 rounded-xl border border-neutral-850 flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white">Database SQLCipher Status</span>
                              <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded font-bold">ACTIVE</span>
                            </div>
                            <p className="text-[8px] text-neutral-500 leading-normal">
                              Database partition files are ciphered using KeyStore derived RSA certificate wrappers.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Android Biometrics Verification Dialog Mockup overlay */}
                  {showBiometricPrompt && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col justify-end p-4 animate-fadeIn z-30">
                      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 flex flex-col items-center gap-4 animate-slideUp">
                        <div className="w-12 h-12 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                          <Smartphone className="w-6 h-6 animate-pulse" />
                        </div>
                        <div className="text-center">
                          <h6 className="text-[12px] font-extrabold text-white">Biometric Credentials Authentication</h6>
                          <p className="text-[9px] text-neutral-400 mt-1 max-w-[200px] leading-normal">
                            Using secure system biometric hardware to derive local decryption keys.
                          </p>
                        </div>
                        
                        <div className="flex gap-2 w-full mt-2">
                          <button
                            onClick={() => {
                              setShowBiometricPrompt(false);
                            }}
                            className="flex-1 py-2 rounded-xl bg-neutral-950 border border-neutral-850 text-neutral-400 font-bold text-[10px] hover:text-white transition-all"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              setShowBiometricPrompt(false);
                              setIsSecureUnlocked(true);
                            }}
                            className="flex-1 py-2 rounded-xl bg-teal-500 text-neutral-950 font-bold text-[10px] hover:bg-teal-400 shadow-md shadow-teal-500/10 transition-all"
                          >
                            Simulate Touch ID
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Simulated Mobile Bottom Navigation Bar */}
                  <div className="bg-neutral-950 h-14 border-t border-neutral-900 px-3 flex items-center justify-around shrink-0 z-10">
                    {[
                      { id: 'dashboard', label: 'Home', icon: Cpu },
                      { id: 'vault', label: 'Vault DB', icon: Database },
                      { id: 'settings', label: 'Settings', icon: Settings },
                    ].map((tab) => {
                      const Icon = tab.icon;
                      const isActive = previewScreen === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setPreviewScreen(tab.id as any)}
                          className="flex flex-col items-center gap-1 cursor-pointer w-12 text-center"
                        >
                          <div className={`p-1 px-3 rounded-full transition-colors flex items-center justify-center ${
                            isActive ? 'bg-teal-500/20 text-teal-400' : 'text-neutral-500 hover:text-neutral-300'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className={`text-[8px] font-bold font-sans ${
                            isActive ? 'text-teal-400' : 'text-neutral-500'
                          }`}>
                            {tab.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                </div>
              </div>

              {/* RIGHT COLUMN: ARCHITECTURAL STATE CONTROLLER & FLOW CHART */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                
                {/* Flow Title and Explanation */}
                <div className="bg-neutral-950/40 border border-neutral-850 p-5 rounded-2xl flex flex-col gap-3">
                  <h5 className="text-xs font-bold text-neutral-300 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                    <Activity className="w-4 h-4 text-teal-400" />
                    <span>Architectural Component Execution Flow</span>
                  </h5>
                  
                  <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                    When you perform an action in the simulator, the {architecture} design pattern ensures isolation between UI layout elements and structural core logic. See how each layer interacts during execution below.
                  </p>
                </div>

                {/* Vertical Data Flow Stages */}
                <div className="flex flex-col gap-3 relative">
                  
                  {/* Step 1: UI View Level */}
                  <div className={`p-4 rounded-xl border transition-all duration-300 ${
                    previewScreen === 'dashboard' 
                      ? 'bg-neutral-900/60 border-teal-500/40 shadow-lg shadow-teal-500/5' 
                      : 'bg-neutral-950/40 border-neutral-850 opacity-80'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-teal-400 border border-neutral-700">UI / COMPOSE</span>
                        <h6 className="text-xs font-bold text-white">Declarative View Layouts</h6>
                      </div>
                      <span className="text-[9px] text-neutral-500 font-bold">STAGE 1</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-2 leading-relaxed">
                      Jetpack Compose components (annotated with <code className="text-[10px] text-teal-400 font-mono">@Composable</code>) render state declarations on screen. They are entirely stateless, pulling all parameters from safe reactive StateFlow variables emitted from the lifecycle-aware model level.
                    </p>
                  </div>

                  {/* Connection Arrow 1 */}
                  <div className="flex justify-center my-[-4px] z-10">
                    <div className="bg-neutral-900 border border-neutral-800 p-1 rounded-full text-teal-500 flex items-center justify-center">
                      <ArrowRight className="w-3.5 h-3.5 rotate-90" />
                    </div>
                  </div>

                  {/* Step 2: ViewModel/Reducer State Controller */}
                  <div className={`p-4 rounded-xl border transition-all duration-300 ${
                    previewScreen === 'vault' && !isSecureUnlocked
                      ? 'bg-neutral-900/60 border-teal-500/40 shadow-lg shadow-teal-500/5' 
                      : 'bg-neutral-950/40 border-neutral-850 opacity-80'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-teal-400 border border-neutral-700">{architecture} MODEL</span>
                        <h6 className="text-xs font-bold text-white">Lifecycle state & Intent Reducer</h6>
                      </div>
                      <span className="text-[9px] text-neutral-500 font-bold">STAGE 2</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-2 leading-relaxed">
                      Handles business actions and holds state. {architecture === 'MVI' ? 'Processes Unidirectional Intents, reducing current state inside standard Reducer loops.' : 'Exposes immutable state values via StateFlow variables securely encapsulated inside standard Lifecycle ViewModels.'}
                    </p>
                  </div>

                  {/* Connection Arrow 2 */}
                  <div className="flex justify-center my-[-4px] z-10">
                    <div className="bg-neutral-900 border border-neutral-800 p-1 rounded-full text-teal-500 flex items-center justify-center">
                      <ArrowRight className="w-3.5 h-3.5 rotate-90" />
                    </div>
                  </div>

                  {/* Step 3: Cryptography & SQLite Room Layer */}
                  <div className={`p-4 rounded-xl border transition-all duration-300 ${
                    previewScreen === 'vault' && isSecureUnlocked
                      ? 'bg-neutral-900/60 border-teal-500/40 shadow-lg shadow-teal-500/5' 
                      : 'bg-neutral-950/40 border-neutral-850 opacity-80'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-teal-400 border border-neutral-700 font-mono">PERSISTENCE / CRYPTO</span>
                        <h6 className="text-xs font-bold text-white">Hardware KeyStore & SQLCipher Room DB</h6>
                      </div>
                      <span className="text-[9px] text-neutral-500 font-bold">STAGE 3</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-2 leading-relaxed">
                      The core repository fetches records from the Room DAO. If sensitive, keys protected inside the Android Keystore execute cryptographic operations, locking/unlocking the SQLite database partition via SQLCipher bindings securely on-device.
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>
        )}

        {activeTab === 'database' && (
          <div className="flex flex-col gap-4">
            <div>
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold block mb-1">Room @Entity & Dao Kotlin Code</span>
              <p className="text-xs text-neutral-400 leading-relaxed mb-3">
                Below are the Kotlin declarations for local Room persistence, featuring SQLCipher capabilities where applicable.
              </p>
            </div>
            <div className="rounded-xl overflow-hidden border border-neutral-800 text-sm">
              <SyntaxHighlighter language="kotlin" style={vscDarkPlus} customStyle={{ margin: 0, padding: '16px', background: '#0a0a0a' }}>
                {currentTabCode}
              </SyntaxHighlighter>
            </div>
          </div>
        )}

        {activeTab === 'ui' && (
          <div className="flex flex-col gap-4">
            <div>
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold block mb-1">Main Compose Screen Components</span>
              <p className="text-xs text-neutral-400 leading-relaxed mb-3">
                Standard, declarative UI implementations following current state hoisting paradigms.
              </p>
            </div>
            <div className="rounded-xl overflow-hidden border border-neutral-800 text-sm">
              <SyntaxHighlighter language="kotlin" style={vscDarkPlus} customStyle={{ margin: 0, padding: '16px', background: '#0a0a0a' }}>
                {currentTabCode}
              </SyntaxHighlighter>
            </div>
          </div>
        )}

        {activeTab === 'gradle' && (
          <div className="flex flex-col gap-4">
            <div>
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold block mb-1">build.gradle.kts Core Dependencies</span>
              <p className="text-xs text-neutral-400 leading-relaxed mb-3">
                Include these configurations inside your module's gradle setup.
              </p>
            </div>
            <div className="rounded-xl overflow-hidden border border-neutral-800 text-sm font-mono">
              <SyntaxHighlighter language="kotlin" style={vscDarkPlus} customStyle={{ margin: 0, padding: '16px', background: '#0a0a0a' }}>
                {currentTabCode}
              </SyntaxHighlighter>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="flex flex-col gap-4">
            <div className="bg-neutral-950 p-4 border border-neutral-850 rounded-xl">
              <span className="text-xs font-bold text-teal-400 block mb-2">Device Security Measures</span>
              {securityConcepts.length > 0 ? (
                <ul className="flex flex-col gap-2">
                  {securityConcepts.map((concept, idx) => (
                    <li key={idx} className="text-xs text-neutral-300 leading-relaxed flex items-start gap-2">
                      <span className="text-teal-500 font-bold shrink-0 mt-0.5">•</span>
                      <span>{concept}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Defaults to full Privacy-by-Design storage using AES encryption with hardware-backed master keys generated on Android Keystore first initialization.
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'testing' && (
          <div className="flex flex-col gap-5">
            <div>
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold block mb-1">Architecture-Guided Test Suite Spec</span>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Clean, robust testing templates tailored specifically for the <span className="text-teal-400 font-bold">{architecture}</span> architectural pattern. Select a testing tier to inspect test structure, dependencies, and assertions.
              </p>
            </div>

            {/* Test Tier Toggle Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 bg-neutral-950 p-1.5 rounded-xl border border-neutral-850">
              <button
                onClick={() => setActiveTestSubTab('junit')}
                className={`py-2 px-3 rounded-lg text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 ${
                  activeTestSubTab === 'junit'
                    ? 'bg-teal-500/10 border border-teal-500/35 text-teal-400 font-extrabold shadow-md'
                    : 'text-neutral-400 hover:text-white border border-transparent'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>JUnit 5 (Unit Test)</span>
              </button>
              <button
                onClick={() => setActiveTestSubTab('espresso')}
                className={`py-2 px-3 rounded-lg text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 ${
                  activeTestSubTab === 'espresso'
                    ? 'bg-teal-500/10 border border-teal-500/35 text-teal-400 font-extrabold shadow-md'
                    : 'text-neutral-400 hover:text-white border border-transparent'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Espresso & Compose (UI Test)</span>
              </button>
              <button
                onClick={() => setActiveTestSubTab('hilt')}
                className={`py-2 px-3 rounded-lg text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 ${
                  activeTestSubTab === 'hilt'
                    ? 'bg-teal-500/10 border border-teal-500/35 text-teal-400 font-extrabold shadow-md'
                    : 'text-neutral-400 hover:text-white border border-transparent'
                }`}
              >
                <Key className="w-3.5 h-3.5" />
                <span>Hilt Mock DI (Config)</span>
              </button>
            </div>

            {/* Guided Explanations & Setup Checklist */}
            <div className="bg-neutral-950/60 p-4 border border-neutral-850 rounded-xl flex flex-col gap-3">
              {activeTestSubTab === 'junit' && (
                <>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Tier 1: JUnit 5 & Mockito Unit Tests</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                    This unit test targets your app's state-holder and presentation layers using a virtualized main thread dispatcher. By utilizing <span className="font-mono text-neutral-300">StandardTestDispatcher</span> and Mockito, we mock data injection interfaces to ensure synchronous, predictable test cycles free of network or database flakes.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                    <div className="bg-neutral-900/50 p-2.5 rounded-lg border border-neutral-850">
                      <span className="text-[10px] text-neutral-400 font-bold block mb-1">Execution Command:</span>
                      <code className="text-[10px] text-teal-400 font-mono">./gradlew testDebugUnitTest</code>
                    </div>
                    <div className="bg-neutral-900/50 p-2.5 rounded-lg border border-neutral-850">
                      <span className="text-[10px] text-neutral-400 font-bold block mb-1">Target Directory:</span>
                      <code className="text-[10px] text-neutral-400 font-mono">app/src/test/java/...</code>
                    </div>
                  </div>
                </>
              )}

              {activeTestSubTab === 'espresso' && (
                <>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Tier 2: Instrumented Jetpack Compose & Espresso Tests</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                    Instrumented tests run inside real target devices or emulator containers. We leverage the <span className="font-mono text-neutral-300">createAndroidComposeRule</span> to initialize declarative Jetpack Compose nodes, query component properties using custom semantics or test tags, and simulate user physical interactions (clicks, text input, gestures).
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                    <div className="bg-neutral-900/50 p-2.5 rounded-lg border border-neutral-850">
                      <span className="text-[10px] text-neutral-400 font-bold block mb-1">Execution Command:</span>
                      <code className="text-[10px] text-teal-400 font-mono">./gradlew connectedAndroidTest</code>
                    </div>
                    <div className="bg-neutral-900/50 p-2.5 rounded-lg border border-neutral-850">
                      <span className="text-[10px] text-neutral-400 font-bold block mb-1">Target Directory:</span>
                      <code className="text-[10px] text-neutral-400 font-mono">app/src/androidTest/java/...</code>
                    </div>
                  </div>
                </>
              )}

              {activeTestSubTab === 'hilt' && (
                <>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Tier 3: Dependency Injection Overriding & Test Runner</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                    Dependency Injection is overridden under test contexts. We use the Hilt <span className="font-mono text-neutral-300">@TestInstallIn</span> directive to swap production modules (e.g., real API endpoints or databases) for safe mocks. A custom <span className="font-mono text-neutral-300">CustomTestRunner</span> is registered in build.gradle.kts to initialize the sandbox container.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                    <div className="bg-neutral-900/50 p-2.5 rounded-lg border border-neutral-850">
                      <span className="text-[10px] text-neutral-400 font-bold block mb-1">Instrumentation Runner Config:</span>
                      <code className="text-[10px] text-teal-400 font-mono">testInstrumentationRunner = "com.vaultcore.app.CustomTestRunner"</code>
                    </div>
                    <div className="bg-neutral-900/50 p-2.5 rounded-lg border border-neutral-850">
                      <span className="text-[10px] text-neutral-400 font-bold block mb-1">Target Directory:</span>
                      <code className="text-[10px] text-neutral-400 font-mono">app/src/androidTest/java/...</code>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Code Highlighting Panel */}
            <div className="rounded-xl overflow-hidden border border-neutral-800 text-sm">
              <SyntaxHighlighter language="kotlin" style={vscDarkPlus} customStyle={{ margin: 0, padding: '16px', background: '#0a0a0a' }}>
                {currentTabCode}
              </SyntaxHighlighter>
            </div>
          </div>
        )}

        {activeTab === 'cicd' && (
          <div className="flex flex-col gap-5 animate-fadeIn">
            <div>
              <span className="text-[10px] text-teal-400 uppercase tracking-wider font-bold block mb-1">Automatisiertes CI/CD Pipeline Template</span>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Diese GitHub Actions Konfiguration ermöglicht das kontinuierliche Bauen, automatische Testen (JUnit) und statische Analysieren deines Android-Projekts bei jedem Push oder Pull Request auf GitHub.
              </p>
            </div>

            <div className="bg-neutral-950/60 p-4 border border-neutral-850 rounded-xl flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider font-sans">GitHub Actions Integration</span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                Speichere die untenstehende YAML-Definition in deinem Projektverzeichnis unter <code className="text-teal-400 font-mono">.github/workflows/android.yml</code>. Sobald du das Repository auf GitHub pushst, wird der Workflow automatisch getriggert.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                <div className="bg-neutral-900/50 p-2.5 rounded-lg border border-neutral-850">
                  <span className="text-[10px] text-neutral-400 font-bold block mb-1 font-sans">Verzeichnispfad im Repository:</span>
                  <code className="text-[10px] text-teal-400 font-mono">.github/workflows/android.yml</code>
                </div>
                <div className="bg-neutral-900/50 p-2.5 rounded-lg border border-neutral-850">
                  <span className="text-[10px] text-neutral-400 font-bold block mb-1 font-sans">Unterstützte Build-Schritte:</span>
                  <code className="text-[10px] text-neutral-400 font-mono">Setup JDK, Lint, Test, Assemble APK</code>
                </div>
              </div>
            </div>

            {/* Code Highlighting Panel */}
            <div className="rounded-xl overflow-hidden border border-neutral-800 text-sm">
              <SyntaxHighlighter language="yaml" style={vscDarkPlus} customStyle={{ margin: 0, padding: '16px', background: '#0a0a0a' }}>
                {currentTabCode}
              </SyntaxHighlighter>
            </div>
          </div>
        )}

        {activeTab === 'checklist' && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            {/* Header with Progress Bar */}
            <div className="bg-gradient-to-r from-teal-950/40 to-emerald-950/20 border border-teal-850/35 p-5 sm:p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex flex-col gap-1 flex-1">
                <span className="text-[10px] text-teal-400 uppercase tracking-widest font-bold flex items-center gap-1">
                  <ListTodo className="w-3.5 h-3.5" />
                  <span>Schritt-für-Schritt Fahrplan</span>
                </span>
                <h4 className="text-sm sm:text-base font-bold text-white font-sans">Lokaler Implementierungs-Leitfaden</h4>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans max-w-xl">
                  Befolge diese Schritte, um den generierten {architecture}-Entwurf direkt in deine lokale Android Studio IDE einzubetten und auszuführen.
                </p>
              </div>

              <div className="bg-neutral-950/60 p-4 rounded-xl border border-neutral-850 flex flex-col gap-2 min-w-[220px]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400 font-medium">Gesamtfortschritt</span>
                  <span className="text-teal-400 font-bold font-mono">{checklistProgressPercent}%</span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden border border-neutral-800">
                  <div 
                    className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full transition-all duration-500"
                    style={{ width: `${checklistProgressPercent}%` }}
                  />
                </div>
                <span className="text-[10px] text-neutral-500 text-right">
                  {completedCount} von {totalCount} Aufgaben erledigt
                </span>
              </div>
            </div>

            {/* Checklist Grid */}
            <div className="flex flex-col gap-3">
              {checklistItems.map((item) => {
                const isChecked = !!checkedItems[item.id];
                const priorityColor = 
                  item.priority === 'Kritisch' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                  item.priority === 'Hoch' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                  item.priority === 'Mittel' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                  'bg-neutral-800 text-neutral-400 border-neutral-700';

                return (
                  <div 
                    key={item.id}
                    onClick={() => toggleCheckItem(item.id)}
                    className={`p-4 rounded-xl border transition-all duration-300 flex items-start gap-4 cursor-pointer select-none ${
                      isChecked 
                        ? 'bg-neutral-950/40 border-neutral-850/60 opacity-60' 
                        : 'bg-neutral-950/80 border-neutral-850 hover:border-neutral-800 hover:bg-neutral-950'
                    }`}
                  >
                    {/* Checkbox circle/square */}
                    <button
                      type="button"
                      className={`w-5 h-5 rounded border shrink-0 flex items-center justify-center transition-all ${
                        isChecked 
                          ? 'bg-teal-500 border-teal-500 text-neutral-950' 
                          : 'border-neutral-700 bg-neutral-900 hover:border-neutral-500'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    {/* Content */}
                    <div className="flex-1 flex flex-col gap-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-neutral-900 border border-neutral-800 text-neutral-400 uppercase tracking-wider">
                          {item.category}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded border font-bold ${priorityColor}`}>
                          {item.priority}
                        </span>
                        {isChecked && (
                          <span className="text-[10px] text-teal-400 font-bold ml-auto font-sans flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Erledigt</span>
                          </span>
                        )}
                      </div>

                      <h5 className={`text-xs font-bold font-sans transition-all ${
                        isChecked ? 'text-neutral-500 line-through' : 'text-neutral-200'
                      }`}>
                        {item.title}
                      </h5>

                      <p className={`text-xs leading-relaxed font-sans transition-all ${
                        isChecked ? 'text-neutral-600' : 'text-neutral-400'
                      }`}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'apk' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Side: Parameters / Keystore */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="bg-neutral-950/60 p-4 rounded-xl border border-neutral-850">
                <div className="flex items-center gap-1.5 mb-3">
                  <Settings className="w-4 h-4 text-teal-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Build Parameters</span>
                </div>

                <div className="flex flex-col gap-3 text-xs">
                  <div>
                    <label className="text-neutral-400 block mb-1 font-semibold">Build Variant</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setBuildVariant('debug')}
                        disabled={isCompiling}
                        className={`py-1.5 rounded-lg border font-bold text-center transition-all ${
                          buildVariant === 'debug'
                            ? 'bg-teal-500/10 border-teal-500/50 text-teal-400'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        Debug (Fast)
                      </button>
                      <button
                        onClick={() => setBuildVariant('release')}
                        disabled={isCompiling}
                        className={`py-1.5 rounded-lg border font-bold text-center transition-all ${
                          buildVariant === 'release'
                            ? 'bg-teal-500/10 border-teal-500/50 text-teal-400'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        Release (Signed)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-neutral-400 block mb-1 font-semibold">Target SDK Level</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setTargetSdk('api36')}
                        disabled={isCompiling}
                        className={`py-1.5 rounded-lg border font-bold text-center transition-all ${
                          targetSdk === 'api36'
                            ? 'bg-teal-500/10 border-teal-500/50 text-teal-400'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        Android 16 (API 36)
                      </button>
                      <button
                        onClick={() => setTargetSdk('api34')}
                        disabled={isCompiling}
                        className={`py-1.5 rounded-lg border font-bold text-center transition-all ${
                          targetSdk === 'api34'
                            ? 'bg-teal-500/10 border-teal-500/50 text-teal-400'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        Android 14 (API 34)
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secure Key Signer Module */}
              {buildVariant === 'release' && (
                <div className="bg-neutral-950/60 p-4 rounded-xl border border-neutral-850 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <Key className="w-4 h-4 text-teal-400" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">Keystore Keypair</span>
                    </div>
                    <button
                      onClick={handleRandomizeKeystore}
                      disabled={isCompiling}
                      className="text-[10px] text-teal-400 hover:underline font-bold"
                    >
                      Regenerate
                    </button>
                  </div>

                  <div className="flex flex-col gap-2.5 text-xs">
                    <div>
                      <span className="text-[10px] text-neutral-500 block">Alias Identifier</span>
                      <input
                        type="text"
                        value={keystoreAlias}
                        onChange={(e) => setKeystoreAlias(e.target.value)}
                        disabled={isCompiling}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-white text-xs mt-0.5 focus:outline-none focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-500 block">Private Certificate Password</span>
                      <input
                        type="text"
                        value={keystorePass}
                        onChange={(e) => setKeystorePass(e.target.value)}
                        disabled={isCompiling}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-white text-xs mt-0.5 focus:outline-none focus:border-teal-500 font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-500 block">Certificate Organization (O)</span>
                      <input
                        type="text"
                        value={keystoreOrg}
                        onChange={(e) => setKeystoreOrg(e.target.value)}
                        disabled={isCompiling}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-white text-xs mt-0.5 focus:outline-none focus:border-teal-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Compilation Trigger */}
              <button
                onClick={startCompilation}
                disabled={isCompiling}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-neutral-950 font-bold flex items-center justify-center gap-2 hover:from-teal-400 hover:to-emerald-400 transition-all shadow-lg disabled:opacity-50 text-xs"
              >
                {isCompiling ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Compiling APK Package ({compileProgress}%)</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Run Gradle APK Compiler</span>
                  </>
                )}
              </button>
            </div>

            {/* Right Side: Log console & Output downloads */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              
              {/* Guided Build Steps Progress Wizard */}
              <div className="bg-neutral-950 p-5 rounded-xl border border-neutral-850 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-neutral-850 pb-3">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-teal-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Guided Build Pipeline</span>
                  </div>
                  <span className="text-xs font-bold text-teal-400 font-mono">
                    {compileSuccess ? "100% (Success)" : isCompiling ? `${compileProgress}%` : "Idle"}
                  </span>
                </div>

                {/* Vertical Stepper Container */}
                <div className="flex flex-col gap-5">
                  {[
                    {
                      id: 1,
                      name: "1. Gradle Configuration",
                      desc: "Initializing Gradle daemon, setting target SDK level to 36, syncing dependencies, and verifying maven plugins.",
                      min: 0,
                      max: 25,
                      icon: Settings,
                      statusLabel: ":app:configure"
                    },
                    {
                      id: 2,
                      name: "2. Kotlin Code Compilation",
                      desc: "Executing Kotlin compiler, running KSP annotation processing, validating Room schemas, and generating Jetpack Compose bytecodes.",
                      min: 26,
                      max: 60,
                      icon: FileCode,
                      statusLabel: ":app:compileReleaseKotlin"
                    },
                    {
                      id: 3,
                      name: "3. R8 Minification & Optimization",
                      desc: "Executing R8 utility for advanced tree shaking, dead code elimination, package obfuscation, and asset optimization.",
                      min: 61,
                      max: 85,
                      icon: Shield,
                      statusLabel: ":app:minifyReleaseWithR8"
                    },
                    {
                      id: 4,
                      name: "4. Cryptographic Signing & Alignment",
                      desc: "Generating DEX payloads, signing APK archive with RSA-2048 Keystore certificates, and aligning via zipalign.",
                      min: 86,
                      max: 100,
                      icon: Key,
                      statusLabel: ":app:packageAndSignRelease"
                    }
                  ].map((step) => {
                    const StepIcon = step.icon;
                    
                    // Determine state
                    let state: 'pending' | 'active' | 'completed' = 'pending';
                    if (compileSuccess) {
                      state = 'completed';
                    } else if (isCompiling) {
                      if (compileProgress > step.max) {
                        state = 'completed';
                      } else if (compileProgress >= step.min && compileProgress <= step.max) {
                        state = 'active';
                      }
                    }

                    // Individual step progress bar inside the active step
                    let stepWidthPercent = 0;
                    if (state === 'completed') {
                      stepWidthPercent = 100;
                    } else if (state === 'active') {
                      const range = step.max - step.min;
                      const currentOffset = compileProgress - step.min;
                      stepWidthPercent = Math.min(100, Math.max(0, Math.floor((currentOffset / range) * 100)));
                    }

                    return (
                      <div key={step.id} className="relative flex items-start gap-4 transition-all duration-300">
                        {/* Connecting line (not for the last step) */}
                        {step.id < 4 && (
                          <div className={`absolute left-[17px] top-10 bottom-[-24px] w-0.5 transition-colors duration-350 ${
                            state === 'completed' ? 'bg-gradient-to-b from-teal-500 to-emerald-500' : 'bg-neutral-800'
                          }`} />
                        )}

                        {/* Step Circle Indicator */}
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border transition-all duration-350 ${
                          state === 'completed'
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-md shadow-emerald-500/5'
                            : state === 'active'
                            ? 'bg-teal-600/20 border-teal-500 text-teal-400 animate-pulse shadow-lg shadow-teal-500/20'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-500'
                        }`}>
                          {state === 'completed' ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 stroke-[2.5]" />
                          ) : state === 'active' ? (
                            <Loader2 className="w-5 h-5 animate-spin text-teal-400" />
                          ) : (
                            <StepIcon className="w-4 h-4 text-neutral-600" />
                          )}
                        </div>

                        {/* Step details */}
                        <div className={`flex-1 flex flex-col gap-1 p-3 rounded-xl border transition-all duration-300 ${
                          state === 'completed' 
                            ? 'bg-neutral-900/50 border-neutral-800/80' 
                            : state === 'active'
                            ? 'bg-teal-950/10 border-teal-900/30 ring-1 ring-teal-500/10'
                            : 'bg-neutral-950/10 border-transparent'
                        }`}>
                          <div className="flex items-center justify-between gap-2">
                            <h6 className={`text-xs font-bold transition-colors duration-300 ${
                              state === 'completed' ? 'text-emerald-400' : state === 'active' ? 'text-white' : 'text-neutral-500'
                            }`}>
                              {step.name}
                            </h6>
                            <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold transition-all ${
                              state === 'completed'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : state === 'active'
                                ? 'bg-teal-500/10 text-teal-400 animate-pulse'
                                : 'bg-neutral-900 text-neutral-600'
                            }`}>
                              {state === 'completed' ? 'SUCCESS' : state === 'active' ? step.statusLabel : 'QUEUED'}
                            </span>
                          </div>
                          
                          <p className={`text-[11px] leading-relaxed transition-colors duration-300 ${
                            state === 'completed' ? 'text-neutral-400' : state === 'active' ? 'text-neutral-200' : 'text-neutral-600'
                          }`}>
                            {step.desc}
                          </p>

                          {/* Mini loading bar inside the active step card */}
                          {state === 'active' && (
                            <div className="w-full bg-neutral-950 h-1.5 rounded overflow-hidden mt-2 border border-neutral-850">
                              <div 
                                className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full transition-all duration-300"
                                style={{ width: `${stepWidthPercent}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Collapsible Console Toggle */}
              <div className="flex items-center justify-between px-2">
                <button
                  onClick={() => setShowConsoleLogs(!showConsoleLogs)}
                  className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 font-bold transition-all"
                >
                  <Activity className="w-3.5 h-3.5 text-teal-400" />
                  <span>{showConsoleLogs ? "Hide Technical Console Output" : "Show Technical Console Output"}</span>
                </button>
              </div>

              {/* Output Monitor console */}
              {showConsoleLogs && (
                <div className="bg-neutral-950 rounded-xl border border-neutral-850 overflow-hidden flex flex-col h-[200px] transition-all">
                  <div className="bg-neutral-900/60 px-4 py-2 flex items-center justify-between border-b border-neutral-850">
                    <div className="flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-teal-400" />
                      <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-wider">Gradle Console Monitor</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`w-2 h-2 rounded-full ${isCompiling ? 'bg-amber-400 animate-pulse' : compileSuccess ? 'bg-teal-400' : 'bg-neutral-700'}`}></span>
                      <span className="text-[9px] text-neutral-500 uppercase">{isCompiling ? 'Active' : compileSuccess ? 'Standby' : 'Offline'}</span>
                    </div>
                  </div>

                  <div className="p-4 overflow-y-auto font-mono text-[10px] text-neutral-400 flex flex-col gap-1 flex-1 scrollbar-thin">
                    {compileLogs.length === 0 ? (
                      <div className="text-neutral-600 italic h-full flex items-center justify-center text-center">
                        Configure your Keystore parameters and hit "Run Gradle APK Compiler" to initiate the secure mobile assembly pipeline.
                      </div>
                    ) : (
                      compileLogs.map((log, index) => {
                        const isSuccess = log && typeof log === 'string' && log.startsWith("BUILD SUCCESSFUL");
                        const isSubTask = log && typeof log === 'string' && (log.includes("> Task") || log.includes("Executing Kotlin Gradle"));
                        return (
                          <div key={index} className={isSuccess ? "text-teal-400 font-bold mt-2" : isSubTask ? "text-teal-500 font-semibold" : "text-neutral-400"}>
                            {log}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* APK Retrieval Card */}
              {compileSuccess && (
                <div className="bg-teal-950/20 border border-teal-850/50 p-4 rounded-xl flex items-center justify-between gap-4 animate-fadeIn">
                  <div className="flex items-center gap-3">
                    <div className="bg-teal-500/10 p-2.5 rounded-lg text-teal-400 shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white">{appName} Compiled Successfully</h5>
                      <p className="text-[10px] text-neutral-400 mt-0.5">Signed, aligned, and optimized local package is ready for download.</p>
                    </div>
                  </div>

                  <button
                    onClick={handleDownloadApk}
                    className="bg-teal-600 hover:bg-teal-500 text-white font-bold py-2 px-4 rounded-lg text-xs flex items-center gap-1.5 shrink-0 shadow-md shadow-teal-600/10 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download APK</span>
                  </button>
                </div>
              )}

              {/* Installation Notice info card */}
              <div className="bg-neutral-950/40 p-4 border border-neutral-850 rounded-xl flex gap-3 text-xs text-neutral-400">
                <AlertTriangle className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-neutral-300">How to install your simulated APK:</span>
                  <p className="leading-relaxed text-[11px]">
                    To install the compiled release binary on your physical Android test device:
                  </p>
                  <ol className="list-decimal pl-4 flex flex-col gap-0.5 mt-1 text-[11px]">
                    <li>Enable <strong className="text-neutral-300">Unknown sources</strong> inside Android security settings.</li>
                    <li>Move the downloaded <code className="text-teal-400 font-mono">.apk</code> file to your mobile directory.</li>
                    <li>Open the file explorer and execute the installation package package-archive setup.</li>
                  </ol>
                </div>
              </div>

            </div>

          </div>
        )}
      </div>

    </div>
  );
}
