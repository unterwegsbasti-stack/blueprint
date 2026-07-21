import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Cpu, 
  Layers,
  Lock, 
  Database, 
  Code,
  FileText,
  Download,
  Check,
  Loader2, 
  Shield, 
  FolderTree,
  Globe,
  MapPin, 
  Bluetooth, 
  Camera, 
  Bell, 
  RefreshCw, 
  Copy,
  Sparkles, 
  BookOpen,
  ChevronRight,
  ChevronDown,
  Printer,
  Info
} from 'lucide-react';
import BlueprintViewer from './components/BlueprintViewer';
import { Header } from './components/Header';
import { QuickStartTemplates } from './components/QuickStartTemplates';
import { InputField, TextAreaField } from './components/FormInput';
import { ErrorMessage } from './components/ErrorMessage';
import { FaqSection } from './components/FaqSection';
import { TEMPLATES, Blueprint, normalizeBlueprint, Template } from './types';

export default function App() {
  const [appName, setAppName] = useState('');
  const [concept, setConcept] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [keyIntegrations, setKeyIntegrations] = useState<string[]>([]);
  const [projectStructure, setProjectStructure] = useState<'single-module' | 'multi-module'>('single-module');
  const [architecturePattern, setArchitecturePattern] = useState<'MVVM' | 'MVI'>('MVVM');
  const [selectedTemplateId, setSelectedTemplateId] = useState('custom');
  
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'stack' | 'features' | 'security' | 'code' | 'tree' | 'backend' | 'license' | 'cicd'>('summary');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [history, setHistory] = useState<Array<{ name: string; timestamp: string; data: Blueprint }>>([]);
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);

  const loadingSteps = [
    "Structuring package dependencies...",
    "Designing Clean Architecture layers...",
    "Establishing local Keystore security protocols...",
    "Drafting Room Database schema definitions...",
    "Finalizing complete Android Technical Blueprint..."
  ];

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('android_blueprint_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Save history helper
  const saveToHistory = (name: string, data: Blueprint) => {
    const newEntry = {
      name: name || "Android Blueprint",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      data
    };
    const updated = [newEntry, ...history.slice(0, 4)];
    setHistory(updated);
    localStorage.setItem('android_blueprint_history', JSON.stringify(updated));
  };

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplateId(template.id);
    setAppName(template.appName);
    setTargetAudience(template.audience);
    setConcept(template.concept);
    setKeyIntegrations(template.integrations || []);
    setProjectStructure((template.structure || "single-module") as any);
    setArchitecturePattern((template.pattern || "MVVM") as any);
  };

  const toggleIntegration = (id: string) => {
    if (keyIntegrations.includes(id)) {
      setKeyIntegrations(keyIntegrations.filter(x => x !== id));
    } else {
      setKeyIntegrations([...keyIntegrations, id]);
    }
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!appName.trim() || !concept.trim()) {
      setError("Please fill in both App Name and App Concept.");
      return;
    }

    setLoading(true);
    setLoadingStep(0);
    setError(null);
    setBlueprint(null);

    // Animate loading steps
    const interval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev < loadingSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 1200);

    try {
      const response = await fetch('/api/generate-blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appName,
          concept,
          targetAudience,
          keyIntegrations,
          projectStructure,
          architecturePattern
        })
      });

      if (!response.ok) {
        let errorMsg = 'Failed to generate technical blueprint.';
        try {
          const errJson = await response.json();
          errorMsg = errJson.error || errorMsg;
        } catch {
          errorMsg = (await response.text()) || errorMsg;
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();
      const normalizedData = normalizeBlueprint(data);
      setBlueprint(normalizedData);
      saveToHistory(appName, normalizedData);
      setActiveTab('summary');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while generating the blueprint. Please try again.');
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(label);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const generateMarkdownExport = (bp: Blueprint) => {
    let md = `# Technical Blueprint: ${appName}\n\n`;
    md += `## 1. Executive Summary\n\n`;
    md += `**Vision:** ${bp.executiveSummary.vision}\n\n`;
    md += `**Target Audience:** ${bp.executiveSummary.targetAudience}\n\n`;
    md += `**Architectural Goals:**\n`;
    bp.executiveSummary.architecturalGoals.forEach(g => {
      md += `- ${g}\n`;
    });
    
    md += `\n## 2. Tech Stack & Recommended Libraries\n\n`;
    md += `| Attribute | Choice |\n| --- | --- |\n`;
    md += `| Language | ${bp.techStack.language} |\n`;
    md += `| UI Framework | ${bp.techStack.uiFramework} |\n`;
    md += `| Dependency Injection | ${bp.techStack.diFramework} |\n`;
    md += `| Architecture Pattern | ${bp.techStack.architecturePattern} |\n`;
    md += `| Local Persistence | ${bp.techStack.persistence} |\n`;
    md += `| Networking | ${bp.techStack.network} |\n`;
    md += `| Async / Flow Framework | ${bp.techStack.asyncFramework} |\n\n`;

    md += `### Core Dependencies (build.gradle.kts)\n\n`;
    bp.techStack.dependencies.forEach(d => {
      md += `**${d.name}**\n\`\`\`kotlin\n${d.dependency}\n\`\`\`\n*${d.description}*\n\n`;
    });

    md += `\n## 3. Core Features & Implementation Details\n\n`;
    bp.coreFeatures.forEach(f => {
      md += `### Feature: ${f.name}\n\n`;
      md += `**Description:** ${f.description}\n\n`;
      md += `**Implementation Details:** ${f.implementationDetails}\n\n`;
      md += `**Key Compose Components:**\n`;
      f.uiComponents.forEach(c => {
        md += `- \`${c}\`\n`;
      });
      md += `\n**State Flow:**\n\`\`\`\n${f.stateFlow}\n\`\`\`\n\n`;
    });

    md += `\n## 4. Security & Privacy Architecture\n\n`;
    md += `**Data Persistence Encryption:** ${bp.securityPrivacy.dataPersistence}\n\n`;
    md += `**Data Transmission Security:** ${bp.securityPrivacy.dataTransmission}\n\n`;
    md += `**Android Keystore usage:** ${bp.securityPrivacy.androidKeystore}\n\n`;
    md += `**Privacy by Design Principles Implemented:**\n`;
    bp.securityPrivacy.privacyByDesign.forEach(p => {
      md += `- ${p}\n`;
    });

    md += `\n## 5. Structured Data Model & Code Blueprint\n\n`;
    md += `### Sample JSON Structure\n\`\`\`json\n${bp.dataModel.jsonStructure}\n\`\`\`\n\n`;
    md += `### Kotlin Data Classes\n\`\`\`kotlin\n${bp.dataModel.kotlinDataClasses}\n\`\`\`\n\n`;
    md += `### Room DB / DAO Interfaces\n\`\`\`kotlin\n${bp.dataModel.roomEntityCode}\n\`\`\`\n\n`;

    md += `\n## 6. Project Package Structure (${bp.packageStructure.type})\n\n`;
    md += `\`\`\`\n${bp.packageStructure.tree}\n\`\`\`\n`;

    return md;
  };

  const handleDownloadMarkdown = (bp: Blueprint) => {
    const mdContent = generateMarkdownExport(bp);
    const blob = new Blob([mdContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${appName.toLowerCase().replace(/\s+/g, '_')}_blueprint.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-teal-500 selection:text-black font-sans">
      {/* Header */}
      <Header />

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column - Architect input panel */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Quick-start Templates */}
          <QuickStartTemplates
            selectedTemplateId={selectedTemplateId}
            onTemplateChange={handleTemplateSelect}
          />

          {/* Core Configuration Form */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl shadow-black/40">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-teal-400" />
              App Specifications
            </h2>
            
            <form onSubmit={handleGenerate} className="flex flex-col gap-5">
              
              {/* App Name */}
              <InputField
                label="App Name"
                value={appName}
                onChange={(val) => {
                  setAppName(val);
                  setSelectedTemplateId('custom');
                }}
                placeholder="e.g. VaultNotes, StealthAuth"
                required
              />

              {/* Target Audience */}
              <InputField
                label="Target Audience"
                value={targetAudience}
                onChange={(val) => {
                  setTargetAudience(val);
                  setSelectedTemplateId('custom');
                }}
                placeholder="e.g. Privacy-conscious journalists, field scientists"
                optionalTag
              />

              {/* Concept / Description */}
              <TextAreaField
                label="App Concept & Core Vision"
                value={concept}
                onChange={(val) => {
                  setConcept(val);
                  setSelectedTemplateId('custom');
                }}
                placeholder="What is the app's ultimate vision? How does it operate? Define why privacy, offline usage, or any custom integrations are vital."
                required
                rows={4}
              />

              {/* Key Integrations (Custom toggle selectors) */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Key Integrations</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'room_db', label: 'Offline Room DB', icon: Database },
                    { id: 'biometrics', label: 'Biometrics & Crypto', icon: Lock },
                    { id: 'location', label: 'Maps & Geofencing', icon: MapPin },
                    { id: 'bluetooth', label: 'Bluetooth / BLE', icon: Bluetooth },
                    { id: 'camera', label: 'Camera & Media', icon: Camera },
                    { id: 'workmanager', label: 'WorkManager Sync', icon: RefreshCw },
                    { id: 'notifications', label: 'Push Alerts', icon: Bell },
                  ].map(item => {
                    const Icon = item.icon;
                    const selected = keyIntegrations.includes(item.id);
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => toggleIntegration(item.id)}
                        className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all text-left ${
                          selected 
                            ? 'bg-teal-500/10 border-teal-500 text-teal-400' 
                            : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${selected ? 'text-teal-400' : 'text-neutral-500'}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Architecture Details Grid */}
              <div className="grid grid-cols-2 gap-4 mt-1">
                {/* Project Structure */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Project Modularization</label>
                  <div className="flex rounded-xl bg-neutral-950 border border-neutral-800 p-1">
                    <button
                      type="button"
                      onClick={() => setProjectStructure('single-module')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        projectStructure === 'single-module'
                          ? 'bg-neutral-800 text-white shadow-sm'
                          : 'text-neutral-500 hover:text-neutral-300'
                      }`}
                    >
                      Single-Module
                    </button>
                    <button
                      type="button"
                      onClick={() => setProjectStructure('multi-module')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        projectStructure === 'multi-module'
                          ? 'bg-neutral-800 text-white shadow-sm'
                          : 'text-neutral-500 hover:text-neutral-300'
                      }`}
                    >
                      Multi-Module
                    </button>
                  </div>
                </div>

                {/* Pattern */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Architecture Pattern</label>
                  <div className="flex rounded-xl bg-neutral-950 border border-neutral-800 p-1">
                    <button
                      type="button"
                      onClick={() => setArchitecturePattern('MVVM')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        architecturePattern === 'MVVM'
                          ? 'bg-neutral-800 text-white shadow-sm'
                          : 'text-neutral-500 hover:text-neutral-300'
                      }`}
                    >
                      MVVM (Clean)
                    </button>
                    <button
                      type="button"
                      onClick={() => setArchitecturePattern('MVI')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        architecturePattern === 'MVI'
                          ? 'bg-neutral-800 text-white shadow-sm'
                          : 'text-neutral-500 hover:text-neutral-300'
                      }`}
                    >
                      MVI (Uni-Flow)
                    </button>
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-neutral-950 font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-teal-500/10 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Analyzing App Idea...</span>
                  </>
                ) : (
                  <>
                    <Cpu className="w-5 h-5 stroke-[2]" />
                    <span>Generate Technical Blueprint</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Generation History */}
          {history.length > 0 && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex flex-col gap-3">
              <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Blueprint History Cache</h3>
              <div className="flex flex-col gap-2">
                {history.map((entry, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setBlueprint(normalizeBlueprint(entry.data));
                      setAppName(entry.name);
                    }}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-left flex justify-between items-center hover:bg-neutral-900 transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-neutral-200">{entry.name}</span>
                      <span className="text-[10px] text-neutral-500">Local Cache • {entry.timestamp}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-600" />
                  </button>
                ))}
              </div>
            </div>
          )}

        </section>

        {/* Right Column - Blueprint output display */}
        <section className="lg:col-span-7">
          
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-950/40 border border-red-800/60 text-red-400 text-sm flex items-center gap-3">
              <Info className="w-5 h-5 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Loading Animation Card */}
          {loading && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-10 h-[600px] flex flex-col items-center justify-center text-center gap-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-neutral-800 overflow-hidden">
                <div className="h-full bg-teal-500 animate-[loadingBar_6s_ease-out_infinite]" style={{ width: `${(loadingStep + 1) * 20}%` }}></div>
              </div>
              
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-neutral-800 border-t-teal-500 animate-spin flex items-center justify-center"></div>
                <Smartphone className="w-6 h-6 text-teal-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">Compiling Technical Blueprint</h3>
                <p className="text-sm text-teal-400 font-mono tracking-wide h-6">{loadingSteps[loadingStep]}</p>
                <p className="text-xs text-neutral-500 max-w-sm mt-2">
                  Gemini Architect is building complete Kotlin data structures, security frameworks, packages, and dependency layouts according to absolute "Privacy by Design" directives.
                </p>
              </div>
            </div>
          )}

          {/* Placeholder state before generation */}
          {!loading && !blueprint && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 min-h-[600px] flex flex-col justify-between gap-8 shadow-xl">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="bg-neutral-950 border border-neutral-800 p-2.5 rounded-xl">
                    <Smartphone className="w-5 h-5 text-teal-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Mobile Architecture Blueprint Stage</h3>
                    <p className="text-xs text-neutral-400">Fill in the specifications on the left to output a professional native Android blueprint</p>
                  </div>
                </div>

                {/* Bento Grid Concept Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="bg-neutral-950 border border-neutral-850 p-5 rounded-2xl flex flex-col gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400 mb-1">
                      <Layers className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Clean Architecture</h4>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Rigid isolation of Domain, Data, and UI layers. Generates either single-module directory layouts or advanced multi-module specifications.
                    </p>
                  </div>

                  <div className="bg-neutral-950 border border-neutral-850 p-5 rounded-2xl flex flex-col gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400 mb-1">
                      <Lock className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Privacy by Design</h4>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Strict guidelines covering secure local persistent DBs, Keystore-backed AES generation, biometric-prompts, and release telemetry scrubbing.
                    </p>
                  </div>

                  <div className="bg-neutral-950 border border-neutral-850 p-5 rounded-2xl flex flex-col gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400 mb-1">
                      <Code className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Production-Ready Code</h4>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Actual Kotlin Room Entities, Data Classes, Retrofit/Ktor networking interfaces, and copyable build.gradle.kts dependencies.
                    </p>
                  </div>

                  <div className="bg-neutral-950 border border-neutral-850 p-5 rounded-2xl flex flex-col gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400 mb-1">
                      <FolderTree className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Directory Visualizer</h4>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Generates full ASCII folder models that fit package structures perfectly, detailing where ViewModels, UseCases, and Repositories belong.
                    </p>
                  </div>
                </div>
              </div>

              {/* Tips/Quotes banner */}
              <div className="border-t border-neutral-800 pt-6 flex items-start gap-3 text-xs text-neutral-500 leading-relaxed">
                <Info className="w-4 h-4 text-neutral-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Architect Recommendation:</strong> For production-grade applications, we recommend preferring <strong>Kotlin Jetpack Compose</strong> paired with <strong>Hilt</strong> for Dependency Injection. If planning major future features, start directly with the <strong>Multi-Module</strong> blueprint.
                </span>
              </div>
            </div>
          )}

          {/* Active Blueprint View */}
          {!loading && blueprint && (
            <>
              <div id="blueprint-card" className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl flex flex-col min-h-[600px] overflow-hidden">
              
              {/* Output Header */}
              <div className="border-b border-neutral-850 bg-neutral-900 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-white">{appName} Spec Sheet</h3>
                    <span className="text-[10px] uppercase font-mono tracking-wider bg-teal-500/10 text-teal-400 px-2 py-0.5 rounded-md font-bold">
                      {blueprint.packageStructure.type}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">Generated by Google AI Studio Android Architect engine</p>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopyText(generateMarkdownExport(blueprint), 'all')}
                    className="px-3.5 py-1.5 rounded-xl border border-neutral-800 bg-neutral-950 hover:bg-neutral-850 text-xs font-bold flex items-center gap-2 transition-all"
                  >
                    {copiedSection === 'all' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-teal-400" />
                        <span className="text-teal-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Copy Markdown</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDownloadMarkdown(blueprint)}
                    className="px-3.5 py-1.5 rounded-xl bg-teal-500 text-neutral-950 hover:bg-teal-400 text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download MD</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-3.5 py-1.5 rounded-xl border border-neutral-800 bg-neutral-950 hover:bg-neutral-850 text-xs font-bold flex items-center gap-1.5 transition-all text-neutral-300 print:hidden"
                    title="Print current blueprint specification sheet"
                  >
                    <Printer className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Print Blueprint</span>
                  </button>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="border-b border-neutral-850 bg-neutral-950/60 flex overflow-x-auto scrollbar-none">
                {[
                  { id: 'summary', label: '1. Summary', icon: BookOpen },
                  { id: 'stack', label: '2. Tech Stack', icon: Cpu },
                  { id: 'features', label: '3. Features', icon: Layers },
                  { id: 'security', label: '4. Security', icon: Shield },
                  { id: 'code', label: '5. Models & Code', icon: Code },
                  { id: 'tree', label: '6. Packages', icon: FolderTree },
                  { id: 'backend', label: '7. Node.js Backend', icon: Code },
                  { id: 'license', label: '8. Open Source', icon: FileText },
                  { id: 'cicd', label: '9. CI/CD Pipeline', icon: RefreshCw },
                ].map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-5 py-3 text-xs font-bold border-b-2 whitespace-nowrap flex items-center gap-1.5 transition-all ${
                        activeTab === tab.id 
                          ? 'border-teal-500 text-white bg-neutral-900/50' 
                          : 'border-transparent text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Tab Panel Content */}
              <div className="p-6 flex-1 overflow-y-auto max-h-[600px] leading-relaxed">
                
                {/* 1. Summary Tab */}
                {activeTab === 'summary' && (
                  <div className="flex flex-col gap-6">
                    {/* Vision Statement */}
                    <div className="bg-neutral-950/50 border border-neutral-850 p-5 rounded-2xl">
                      <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-2.5">Vision & Core Intent</h4>
                      <p className="text-sm text-neutral-200 leading-relaxed font-sans">{blueprint.executiveSummary.vision}</p>
                    </div>

                    {/* Target Audience Profile */}
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                      <div className="bg-neutral-950/50 border border-neutral-850 p-5 rounded-2xl">
                        <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-2.5">Target Audience & UX Integration</h4>
                        <p className="text-sm text-neutral-200 leading-relaxed">{blueprint.executiveSummary.targetAudience}</p>
                      </div>
                    </div>

                    {/* Architectural Goals */}
                    <div className="bg-neutral-950/50 border border-neutral-850 p-5 rounded-2xl flex flex-col gap-3">
                      <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider">Architectural Goals</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                        {blueprint.executiveSummary.architecturalGoals.map((goal, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm text-neutral-300">
                            <Check className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                            <span>{goal}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Tech Stack Tab */}
                {activeTab === 'stack' && (
                  <div className="flex flex-col gap-6">
                    {/* Architectural Parameters Grid */}
                    <div className="bg-neutral-950/50 border border-neutral-850 rounded-2xl p-5">
                      <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-4">Core Tech Stack Configurations</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { label: 'Language', val: blueprint.techStack.language },
                          { label: 'UI Toolkit', val: blueprint.techStack.uiFramework },
                          { label: 'DI Framework', val: blueprint.techStack.diFramework },
                          { label: 'Pattern', val: blueprint.techStack.architecturePattern },
                          { label: 'Local Storage', val: blueprint.techStack.persistence },
                          { label: 'Networking', val: blueprint.techStack.network },
                          { label: 'Async Flows', val: blueprint.techStack.asyncFramework },
                        ].map((item, idx) => (
                          <div key={idx} className="border-r border-neutral-850 last:border-0 pr-4">
                            <span className="text-[10px] text-neutral-500 uppercase tracking-wider block font-bold">{item.label}</span>
                            <span className="text-sm font-semibold text-white block mt-0.5">{item.val}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Gradle Dependencies Block */}
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Recommended build.gradle.kts Declarations</h4>
                        <span className="text-[10px] text-neutral-500 font-mono">Copy separate gradle entries below</span>
                      </div>

                      {blueprint.techStack.dependencies.map((dep, idx) => (
                        <div key={idx} className="bg-neutral-950 border border-neutral-850 rounded-2xl overflow-hidden flex flex-col">
                          <div className="border-b border-neutral-900 bg-neutral-950 px-4 py-3 flex justify-between items-center">
                            <div>
                              <span className="text-xs font-bold text-white block">{dep.name}</span>
                              <span className="text-[10px] text-neutral-500 leading-none">{dep.description}</span>
                            </div>
                            <button
                              onClick={() => handleCopyText(dep.dependency, dep.name)}
                              className="p-1.5 rounded-lg hover:bg-neutral-900 text-neutral-400 hover:text-white transition-colors"
                            >
                              {copiedSection === dep.name ? (
                                <Check className="w-3.5 h-3.5 text-teal-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                          <div className="p-4 font-mono text-xs text-neutral-300 bg-neutral-950 overflow-x-auto whitespace-pre">
                            {dep.dependency}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Plugins Block */}
                    {blueprint.techStack.plugins && blueprint.techStack.plugins.length > 0 && (
                      <div className="flex flex-col gap-4">
                        <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Gradle Build Plugins</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {blueprint.techStack.plugins.map((pl, idx) => (
                            <div key={idx} className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl flex flex-col justify-between gap-3">
                              <div>
                                <span className="text-xs font-bold text-white block">{pl.name}</span>
                                <span className="text-[10px] text-neutral-500 block leading-relaxed mt-1">{pl.description}</span>
                              </div>
                              <div className="bg-neutral-950/80 border border-neutral-900 p-2 rounded-lg font-mono text-[10px] text-teal-400 truncate">
                                {pl.plugin}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                )}

                {/* 3. Features Tab */}
                {activeTab === 'features' && (
                  <div className="flex flex-col gap-6">
                    {blueprint.coreFeatures.map((feat, idx) => (
                      <div key={idx} className="bg-neutral-950/50 border border-neutral-850 rounded-2xl overflow-hidden flex flex-col">
                        
                        {/* Header */}
                        <div className="border-b border-neutral-850 bg-neutral-950/80 px-5 py-4">
                          <span className="text-xs font-extrabold text-teal-400 block uppercase tracking-wider">Feature module {idx + 1}</span>
                          <h4 className="text-base font-bold text-white mt-1">{feat.name}</h4>
                          <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{feat.description}</p>
                        </div>

                        {/* Details body */}
                        <div className="p-5 flex flex-col gap-4">
                          {/* Implementation plan */}
                          <div>
                            <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold block">Implementation Blueprint</span>
                            <p className="text-sm text-neutral-200 mt-1.5 leading-relaxed">{feat.implementationDetails}</p>
                          </div>

                          {/* Jetpack Compose UI layout */}
                          <div>
                            <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold block mb-2">Composables / UI Component Tree</span>
                            <div className="flex flex-wrap gap-1.5">
                              {feat.uiComponents.map((comp, compIdx) => (
                                <span key={compIdx} className="px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-850 font-mono text-xs text-teal-400 font-semibold">
                                  {comp}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Data Flow & Architecture Loop */}
                          <div className="bg-neutral-950 p-4 border border-neutral-900 rounded-xl">
                            <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold block">Unidirectional Data Flow Sequence</span>
                            <pre className="mt-2 font-mono text-[11px] text-neutral-300 leading-relaxed overflow-x-auto scrollbar-none whitespace-pre-wrap">
                              {feat.stateFlow}
                            </pre>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}

                {/* 4. Security Tab */}
                {activeTab === 'security' && (
                  <div className="flex flex-col gap-6">
                    
                    {/* Highlights bento info */}
                    <div className="bg-neutral-950/50 border border-neutral-850 p-5 rounded-2xl">
                      <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-2.5">Security Architecture Overview</h4>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        To maintain absolute "Privacy by Design", this blueprint employs robust, native Android security components. All cryptographic keys are protected by hardware inside the Android Keystore system, mitigating extraction vectors even on compromised systems.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Secure Local Db */}
                      <div className="bg-neutral-950/50 border border-neutral-850 p-5 rounded-2xl flex flex-col gap-2">
                        <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
                          <Database className="w-4 h-4" />
                        </div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider mt-1">Data persistence Security</h4>
                        <p className="text-xs text-neutral-300 leading-relaxed mt-1">
                          {blueprint.securityPrivacy.dataPersistence}
                        </p>
                      </div>

                      {/* Data Transmission */}
                      <div className="bg-neutral-950/50 border border-neutral-850 p-5 rounded-2xl flex flex-col gap-2">
                        <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
                          <Globe className="w-4 h-4" />
                        </div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider mt-1">Network Transmission Security</h4>
                        <p className="text-xs text-neutral-300 leading-relaxed mt-1">
                          {blueprint.securityPrivacy.dataTransmission}
                        </p>
                      </div>

                      {/* Keystore */}
                      <div className="bg-neutral-950/50 border border-neutral-850 p-5 rounded-2xl flex flex-col gap-2">
                        <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
                          <Lock className="w-4 h-4" />
                        </div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider mt-1">Android Keystore API Integration</h4>
                        <p className="text-xs text-neutral-300 leading-relaxed mt-1">
                          {blueprint.securityPrivacy.androidKeystore}
                        </p>
                      </div>

                      {/* Privacy design principles */}
                      <div className="bg-neutral-950/50 border border-neutral-850 p-5 rounded-2xl flex flex-col gap-2">
                        <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
                          <Shield className="w-4 h-4" />
                        </div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider mt-1">Privacy by Design Principles</h4>
                        <div className="flex flex-col gap-1.5 mt-2">
                          {blueprint.securityPrivacy.privacyByDesign.map((p, idx) => (
                            <div key={idx} className="flex items-start gap-1.5 text-xs text-neutral-300">
                              <Check className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
                              <span>{p}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* 5. Models & Code Tab */}
                {activeTab === 'code' && (
                  <div className="flex flex-col gap-6">
                    {/* JSON Structure */}
                    <div className="bg-neutral-950 border border-neutral-850 rounded-2xl overflow-hidden flex flex-col">
                      <div className="border-b border-neutral-900 bg-neutral-950 px-5 py-3.5 flex justify-between items-center">
                        <div>
                          <span className="text-xs font-bold text-white block">JSON Data Payload Sample</span>
                          <span className="text-[10px] text-neutral-500 leading-none">Format representing primary network/local payloads</span>
                        </div>
                        <button
                          onClick={() => handleCopyText(blueprint.dataModel.jsonStructure, 'json')}
                          className="px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-950 hover:bg-neutral-900 text-xs font-bold flex items-center gap-1.5 transition-all"
                        >
                          {copiedSection === 'json' ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-teal-400" />
                              <span className="text-teal-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy JSON</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className="p-5 font-mono text-xs text-neutral-300 bg-neutral-950 overflow-x-auto whitespace-pre">
                        {blueprint.dataModel.jsonStructure}
                      </div>
                    </div>

                    {/* Kotlin Data Classes */}
                    <div className="bg-neutral-950 border border-neutral-850 rounded-2xl overflow-hidden flex flex-col">
                      <div className="border-b border-neutral-900 bg-neutral-950 px-5 py-3.5 flex justify-between items-center">
                        <div>
                          <span className="text-xs font-bold text-white block">Kotlin Data classes</span>
                          <span className="text-[10px] text-neutral-500 leading-none">Serializable domain and data entities</span>
                        </div>
                        <button
                          onClick={() => handleCopyText(blueprint.dataModel.kotlinDataClasses, 'kotlin')}
                          className="px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-950 hover:bg-neutral-900 text-xs font-bold flex items-center gap-1.5 transition-all"
                        >
                          {copiedSection === 'kotlin' ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-teal-400" />
                              <span className="text-teal-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Code</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className="p-5 font-mono text-xs text-teal-300 bg-neutral-950 overflow-x-auto whitespace-pre leading-relaxed">
                        {blueprint.dataModel.kotlinDataClasses}
                      </div>
                    </div>

                    {/* Room Database Code */}
                    <div className="bg-neutral-950 border border-neutral-850 rounded-2xl overflow-hidden flex flex-col">
                      <div className="border-b border-neutral-900 bg-neutral-950 px-5 py-3.5 flex justify-between items-center">
                        <div>
                          <span className="text-xs font-bold text-white block">Room Persistence Entities & DAOs</span>
                          <span className="text-[10px] text-neutral-500 leading-none">Data Access Object interface definitions</span>
                        </div>
                        <button
                          onClick={() => handleCopyText(blueprint.dataModel.roomEntityCode, 'room')}
                          className="px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-950 hover:bg-neutral-900 text-xs font-bold flex items-center gap-1.5 transition-all"
                        >
                          {copiedSection === 'room' ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-teal-400" />
                              <span className="text-teal-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy DAO</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className="p-5 font-mono text-xs text-teal-300 bg-neutral-950 overflow-x-auto whitespace-pre leading-relaxed">
                        {blueprint.dataModel.roomEntityCode}
                      </div>
                    </div>

                  </div>
                )}

                {/* 6. Package Structure Tree Tab */}
                {activeTab === 'tree' && (
                  <div className="flex flex-col gap-6">
                    <div className="bg-neutral-950 border border-neutral-850 rounded-2xl overflow-hidden flex flex-col">
                      <div className="border-b border-neutral-900 bg-neutral-950 px-5 py-3.5 flex justify-between items-center">
                        <div>
                          <span className="text-xs font-bold text-white block">Project package Tree Diagram</span>
                          <span className="text-[10px] text-neutral-500 leading-none">Architectural layout for {blueprint.packageStructure.type} configuration</span>
                        </div>
                        <button
                          onClick={() => handleCopyText(blueprint.packageStructure.tree, 'tree')}
                          className="px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-950 hover:bg-neutral-900 text-xs font-bold flex items-center gap-1.5 transition-all"
                        >
                          {copiedSection === 'tree' ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-teal-400" />
                              <span className="text-teal-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Tree</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className="p-5 font-mono text-xs text-neutral-300 bg-neutral-950 overflow-x-auto whitespace-pre select-all leading-relaxed">
                        {blueprint.packageStructure.tree}
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. Node.js Backend Guide Tab */}
                {activeTab === 'backend' && (
                  <div className="flex flex-col gap-6">
                    <div className="bg-neutral-950/50 border border-neutral-850 p-5 rounded-2xl">
                      <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-2.5">Integration Guide: Self-Hosted Node.js Backend</h4>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Use this implementation blueprint to build your own server-side integration. This handles communication with Gemini's models securely and enforces the strict "Privacy by Design" directives out-of-the-box.
                      </p>
                    </div>

                    <div className="bg-neutral-950 border border-neutral-850 rounded-2xl overflow-hidden flex flex-col">
                      <div className="border-b border-neutral-900 bg-neutral-950 px-5 py-3.5 flex justify-between items-center">
                        <div>
                          <span className="text-xs font-bold text-white block">Node.js Express Server Snippet</span>
                          <span className="text-[10px] text-neutral-500 leading-none">Handles prompt engineering and returns the structured blueprint JSON</span>
                        </div>
                        <button
                          onClick={() => handleCopyText(`// Node.js Backend Beispiel-Logik
const userAppIdea = req.body.idea; // z.B. "Ein verschlüsselter Notiz-Tresor"
const userArchitecture = req.body.architecture || "MVI";

const prompt = \`
Analyze the following app concept and generate a comprehensive Technical Blueprint in JSON format.

App Concept: "\${userAppIdea}"
Preferred Architecture: "\${userArchitecture}"

The JSON object MUST strictly follow this exact schema:
{
  "appName": "String (A catchy, professional name)",
  "architecturePattern": "String",
  "projectStructure": "String (e.g., modular, single-module)",
  "executiveSummary": {
    "vision": "String",
    "targetAudience": "String",
    "architecturalGoals": ["Array of Strings"]
  },
  "techStack": {
    "language": "String",
    "uiFramework": "String",
    "diFramework": "String"
  },
  "database": {
    "entityCode": "String (Raw Kotlin code for a primary Room @Entity, including SQLCipher considerations)",
    "daoCode": "String (Raw Kotlin code for the corresponding @Dao with Flow/Coroutines)"
  },
  "security": {
    "concepts": ["Array of Strings (e.g., KeyStore usage, Biometrics)"]
  }
}
\`;

const generationConfig = {
  temperature: 0.2, // Hält das Modell fokussiert
  responseMimeType: "application/json", // Das ist der Gamechanger!
};

const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig
});`, 'backend_snippet')}
                          className="px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-950 hover:bg-neutral-900 text-xs font-bold flex items-center gap-1.5 transition-all"
                        >
                          {copiedSection === 'backend_snippet' ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-teal-400" />
                              <span className="text-teal-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Sample</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className="p-5 font-mono text-xs text-neutral-300 bg-neutral-950 overflow-x-auto whitespace-pre leading-relaxed">
{`// Node.js Backend Beispiel-Logik
const userAppIdea = req.body.idea; // z.B. "Ein verschlüsselter Notiz-Tresor"
const userArchitecture = req.body.architecture || "MVI";

const prompt = \`
Analyze the following app concept and generate a comprehensive Technical Blueprint in JSON format.

App Concept: "\${userAppIdea}"
Preferred Architecture: "\${userArchitecture}"

The JSON object MUST strictly follow this exact schema:
{
  "appName": "String (A catchy, professional name)",
  "architecturePattern": "String",
  "projectStructure": "String (e.g., modular, single-module)",
  "executiveSummary": {
    "vision": "String",
    "targetAudience": "String",
    "architecturalGoals": ["Array of Strings"]
  },
  "techStack": {
    "language": "String",
    "uiFramework": "String",
    "diFramework": "String"
  },
  "database": {
    "entityCode": "String (Raw Kotlin code for a primary Room @Entity, including SQLCipher considerations)",
    "daoCode": "String (Raw Kotlin code for the corresponding @Dao with Flow/Coroutines)"
  },
  "security": {
    "concepts": ["Array of Strings (e.g., KeyStore usage, Biometrics)"]
  }
}
\`;

const generationConfig = {
  temperature: 0.2, // Hält das Modell fokussiert
  responseMimeType: "application/json", // Das ist der Gamechanger!
};

const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig
});`}
                      </div>
                    </div>

                    <div className="bg-neutral-950 border border-neutral-850 rounded-2xl overflow-hidden flex flex-col mt-6">
                      <div className="border-b border-neutral-900 bg-neutral-950 px-5 py-3.5 flex justify-between items-center">
                        <div>
                          <span className="text-xs font-bold text-white block">Expert Architect Prompt Example</span>
                          <span className="text-[10px] text-neutral-500 leading-none">Strict structure instruction with a raw Zero-Knowledge Vault example idea</span>
                        </div>
                        <button
                          onClick={() => handleCopyText(`You are an expert Android Software Architect. Your task is to design a secure, modern Android application based on the user's idea.

CRITICAL INSTRUCTION:
You must respond with a raw, valid JSON object ONLY. Do not include any Markdown formatting, explanations, or text outside the JSON structure.

Use this exact JSON schema for your response:
{
  "appName": "String",
  "executiveSummary": {
    "vision": "String",
    "targetAudience": "String",
    "architecturalGoals": ["String", "String"]
  },
  "techStack": {
    "language": "String",
    "uiFramework": "String",
    "diFramework": "String",
    "localPersistence": "String",
    "asyncFramework": "String"
  },
  "coreDependencies": [
    { "name": "String", "gradleImplementation": "String", "purpose": "String" }
  ],
  "securityArchitecture": [
    "String"
  ],
  "codeBlueprints": {
    "roomEntityKotlin": "String (Raw Kotlin code)",
    "roomDaoKotlin": "String (Raw Kotlin code)"
  },
  "projectStructure": [
    "String (File paths)"
  ]
}

User Idea: "Ein verschlüsselter Markdown-Notiz-Tresor mit Audio-Funktion und Zero-Knowledge Cloud Sync."`, 'architect_prompt')}
                          className="px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-950 hover:bg-neutral-900 text-xs font-bold flex items-center gap-1.5 transition-all"
                        >
                          {copiedSection === 'architect_prompt' ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-teal-400" />
                              <span className="text-teal-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Prompt</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className="p-5 font-mono text-xs text-neutral-300 bg-neutral-950 overflow-x-auto whitespace-pre leading-relaxed">
{`You are an expert Android Software Architect. Your task is to design a secure, modern Android application based on the user's idea.

CRITICAL INSTRUCTION:
You must respond with a raw, valid JSON object ONLY. Do not include any Markdown formatting, explanations, or text outside the JSON structure.

Use this exact JSON schema for your response:
{
  "appName": "String",
  "executiveSummary": {
    "vision": "String",
    "targetAudience": "String",
    "architecturalGoals": ["String", "String"]
  },
  "techStack": {
    "language": "String",
    "uiFramework": "String",
    "diFramework": "String",
    "localPersistence": "String",
    "asyncFramework": "String"
  },
  "coreDependencies": [
    { "name": "String", "gradleImplementation": "String", "purpose": "String" }
  ],
  "securityArchitecture": [
    "String"
  ],
  "codeBlueprints": {
    "roomEntityKotlin": "String (Raw Kotlin code)",
    "roomDaoKotlin": "String (Raw Kotlin code)"
  },
  "projectStructure": [
    "String (File paths)"
  ]
}

User Idea: "Ein verschlüsselter Markdown-Notiz-Tresor mit Audio-Funktion und Zero-Knowledge Cloud Sync."`}
                      </div>
                    </div>

                    <div className="bg-neutral-950 border border-neutral-850 rounded-2xl overflow-hidden flex flex-col mt-6">
                      <div className="border-b border-neutral-900 bg-neutral-950 px-5 py-3.5 flex justify-between items-center">
                        <div>
                          <span className="text-xs font-bold text-white block">Critical Output Format Schema</span>
                          <span className="text-[10px] text-neutral-500 leading-none">Strict structure for clean tab-based rendering</span>
                        </div>
                        <button
                          onClick={() => handleCopyText(`CRITICAL OUTPUT FORMAT:
You must return the entire Technical Blueprint EXCLUSIVELY as a valid JSON object. Do not wrap it in \`\`\`json blocks. Do not add conversational text. The JSON must exactly match the following structure to allow the frontend to render it in separate tabs:

{
  "summaryTab": {
    "appName": "String",
    "vision": "String",
    "architecturePattern": "String"
  },
  "gradleTab": {
    "dependencies": ["String (List of implementation strings)"]
  },
  "databaseTab": {
    "entityCode": "String (Raw Kotlin code for Room Entities, preserve line breaks with \\n)",
    "daoCode": "String (Raw Kotlin code for Room DAOs)"
  },
  "uiTab": {
    "composeCode": "String (Raw Jetpack Compose Kotlin code for the main screens)"
  },
  "securityTab": {
    "concepts": ["String (Details on KeyStore, SQLCipher, etc.)"]
  }
}`, 'critical_format')}
                          className="px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-950 hover:bg-neutral-900 text-xs font-bold flex items-center gap-1.5 transition-all"
                        >
                          {copiedSection === 'critical_format' ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-teal-400" />
                              <span className="text-teal-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Format</span>
                            </>
                          )
                          }
                        </button>
                      </div>
                      <div className="p-5 font-mono text-xs text-neutral-300 bg-neutral-950 overflow-x-auto whitespace-pre leading-relaxed">
{`CRITICAL OUTPUT FORMAT:
You must return the entire Technical Blueprint EXCLUSIVELY as a valid JSON object. Do not wrap it in \`\`\`json blocks. Do not add conversational text. The JSON must exactly match the following structure to allow the frontend to render it in separate tabs:

{
  "summaryTab": {
    "appName": "String",
    "vision": "String",
    "architecturePattern": "String"
  },
  "gradleTab": {
    "dependencies": ["String (List of implementation strings)"]
  },
  "databaseTab": {
    "entityCode": "String (Raw Kotlin code for Room Entities, preserve line breaks with \\n)",
    "daoCode": "String (Raw Kotlin code for Room DAOs)"
  },
  "uiTab": {
    "composeCode": "String (Raw Jetpack Compose Kotlin code for the main screens)"
  },
  "securityTab": {
    "concepts": ["String (Details on KeyStore, SQLCipher, etc.)"]
  }
}`}
                      </div>
                    </div>

                  </div>
                )}

                {/* 8. Open Source License Tab */}
                {activeTab === 'license' && (
                  <div className="flex flex-col gap-6 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      <div className="md:col-span-5 flex flex-col gap-4">
                        <div className="bg-neutral-950/50 border border-neutral-850 p-5 rounded-2xl flex flex-col gap-3">
                          <h4 className="text-sm font-bold text-teal-400 uppercase tracking-wider">MIT Open Source Lizenz</h4>
                          <p className="text-xs text-neutral-300 leading-relaxed">
                            Dieses Projekt und alle generierten technischen Blueprints, Kotlin-Klassen, Datenbankmodelle sowie Benutzeroberflächen stehen unter der hochgradig permissiven <strong>MIT-Lizenz</strong>.
                          </p>
                          <p className="text-xs text-neutral-400 leading-relaxed">
                            Das bedeutet: Du bist absolut frei, das Konzept und den generierten Code für private Zwecke, kommerzielle Großprojekte, Modifikationen oder Schulungen zu nutzen, zu kopieren, zu verändern und zu verteilen.
                          </p>
                          <div className="bg-teal-500/10 border border-teal-500/20 p-3.5 rounded-xl flex items-start gap-3 mt-1">
                            <Shield className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="text-xs font-bold text-teal-400 block">Privacy-First & Freedom</span>
                              <span className="text-[11px] text-neutral-400 leading-relaxed">Keine versteckten Gebühren, keine Telemetrie-Tracer, kein Vendor-Lock-in.</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-neutral-950/50 border border-neutral-850 p-5 rounded-2xl flex flex-col gap-3">
                          <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Deine Vorteile als Entwickler:</h4>
                          <div className="flex flex-col gap-2.5 text-xs">
                            <div className="flex gap-2">
                              <span className="text-teal-400 font-bold">•</span>
                              <span className="text-neutral-300"><strong>Volle Flexibilität:</strong> Ändere Datenbanken, Netzwerktreiber oder das UI nach deinen Wünschen.</span>
                            </div>
                            <div className="flex gap-2">
                              <span className="text-teal-400 font-bold">•</span>
                              <span className="text-neutral-300"><strong>Auditierbare Sicherheit:</strong> Keine Blackboxes – jede Zeile Code kann von Sicherheitsforschern verifiziert werden.</span>
                            </div>
                            <div className="flex gap-2">
                              <span className="text-teal-400 font-bold">•</span>
                              <span className="text-neutral-300"><strong>Zukunftssicher:</strong> Unabhängig von SaaS-Drittanbietern. Dein Code gehört zu 100% dir.</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-7 flex flex-col gap-4">
                        <div className="bg-neutral-950 border border-neutral-850 rounded-2xl overflow-hidden flex flex-col">
                          <div className="border-b border-neutral-900 bg-neutral-950 px-5 py-3.5 flex justify-between items-center">
                            <div>
                              <span className="text-xs font-bold text-white block">Lizenztext (LICENSE)</span>
                              <span className="text-[10px] text-neutral-500 leading-none">Offizieller MIT-Lizenzvertrag für dieses Projekt</span>
                            </div>
                            <button
                              onClick={() => handleCopyText(`MIT License

Copyright (c) 2026 Android Technical Blueprint Generator Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`, 'license_text')}
                              className="px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-950 hover:bg-neutral-900 text-xs font-bold flex items-center gap-1.5 transition-all"
                            >
                              {copiedSection === 'license_text' ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-teal-400" />
                                  <span className="text-teal-400">Kopiert</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Kopieren</span>
                                </>
                              )}
                            </button>
                          </div>
                          <div className="p-5 font-mono text-xs text-neutral-400 bg-neutral-950 overflow-y-auto max-h-[350px] leading-relaxed whitespace-pre-wrap select-all">
{`MIT License

Copyright (c) 2026 Android Technical Blueprint Generator Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 9. CI/CD Pipeline Tab */}
                {activeTab === 'cicd' && (
                  <div className="flex flex-col gap-6 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      <div className="md:col-span-5 flex flex-col gap-4">
                        <div className="bg-neutral-950/50 border border-neutral-850 p-5 rounded-2xl flex flex-col gap-3">
                          <h4 className="text-sm font-bold text-teal-400 uppercase tracking-wider">Automatisierte CI/CD Pipeline</h4>
                          <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                            Dieses Projekt beinhaltet ein vorkonfiguriertes, produktionsreifes GitHub Actions Pipeline-Template.
                          </p>
                          <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                            Sobald du deine App in ein GitHub-Repository hochlädst und diese Konfigurationsdatei im Pfad <strong className="text-neutral-300">.github/workflows/android.yml</strong> speicherst, wird jede Code-Änderung (Push oder Pull Request) vollautomatisch überprüft und verifiziert.
                          </p>
                          <div className="bg-teal-500/10 border border-teal-500/20 p-3.5 rounded-xl flex items-start gap-3 mt-1">
                            <RefreshCw className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="text-xs font-bold text-teal-400 block font-sans">Continuous Integration</span>
                              <span className="text-[11px] text-neutral-400 leading-relaxed font-sans">Sorgt für fehlerfreie Builds, automatisiertes Testen und sichert konstante Softwarequalität nach jedem Commit.</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-neutral-950/50 border border-neutral-850 p-5 rounded-2xl flex flex-col gap-3">
                          <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider font-sans">Pipeline-Phasen:</h4>
                          <div className="flex flex-col gap-3 text-xs">
                            <div className="flex gap-2">
                              <span className="text-teal-400 font-bold">1.</span>
                              <div>
                                <span className="text-neutral-300 font-bold block">Checkout & JDK Setup:</span>
                                <span className="text-neutral-400 text-[11px]">Holt den Code und richtet Java JDK 17 (Temurin) mit Gradle-Caching ein.</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <span className="text-teal-400 font-bold">2.</span>
                              <div>
                                <span className="text-neutral-300 font-bold block">Static Analysis (Linting):</span>
                                <span className="text-neutral-400 text-[11px]">Sucht nach Programmierfehlern, Performance-Problemen und Architektur-Verletzungen.</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <span className="text-teal-400 font-bold">3.</span>
                              <div>
                                <span className="text-neutral-300 font-bold block">Unit-Testing:</span>
                                <span className="text-neutral-400 text-[11px]">Führt alle JUnit-Tests aus, um Kernlogik und Datenflüsse abzusichern.</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <span className="text-teal-400 font-bold">4.</span>
                              <div>
                                <span className="text-neutral-300 font-bold block">Artifact Assembly:</span>
                                <span className="text-neutral-400 text-[11px]">Kompiliert das ausführbare Debug-APK und speichert es als wiederverwendbares Pipeline-Artefakt ab.</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-7 flex flex-col gap-4">
                        <div className="bg-neutral-950 border border-neutral-850 rounded-2xl overflow-hidden flex flex-col">
                          <div className="border-b border-neutral-900 bg-neutral-950 px-5 py-3.5 flex justify-between items-center">
                            <div>
                              <span className="text-xs font-bold text-white block font-sans">Workflow-Code (android.yml)</span>
                              <span className="text-[10px] text-neutral-500 leading-none">Vollständiger GitHub Actions Workflow für Android-Builds</span>
                            </div>
                            <button
                              onClick={() => handleCopyText(`# ====================================================================
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
        retention-days: 7`, 'cicd_workflow')}
                              className="px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-950 hover:bg-neutral-900 text-xs font-bold flex items-center gap-1.5 transition-all"
                            >
                              {copiedSection === 'cicd_workflow' ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-teal-400" />
                                  <span className="text-teal-400">Kopiert</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Kopieren</span>
                                </>
                              )}
                            </button>
                          </div>
                          <div className="p-5 font-mono text-xs text-neutral-400 bg-neutral-950 overflow-y-auto max-h-[480px] leading-relaxed whitespace-pre-wrap select-all">
{`# ====================================================================
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
        retention-days: 7`}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
              
            </div>

            {/* Interactive Code Viewer Companion */}
            <div className="mt-8">
              <h3 className="text-sm font-bold text-teal-400 uppercase tracking-widest mb-1">Code Highlights & SDK Integration</h3>
              <p className="text-xs text-neutral-500 mb-4">Click through the tabs below to copy clean compilable Kotlin code blocks for your Android project.</p>
              <BlueprintViewer rawResponse={blueprint} />
            </div>
          </>
        )}

        </section>

        {/* FAQ & Tool Introduction Section */}
        <section className="lg:col-span-12 border-t border-neutral-800/80 pt-12 mt-12 flex flex-col gap-10">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto flex flex-col gap-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold w-fit mx-auto">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Handbuch & FAQ</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Einführung & Häufig gestellte Fragen
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans">
              Alles, was du über den Android Technical Blueprint Generator wissen musst, um deine App-Konzepte nach modernsten Industriestandards zu realisieren.
            </p>
          </div>

          {/* Tool Introduction Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-neutral-900/40 border border-neutral-850 p-6 rounded-2xl flex flex-col gap-3 hover:border-neutral-800 transition-all">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 shrink-0">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-neutral-200">1. Architektur-Copilot</h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Übersetzt unstrukturierte App-Ideen sofort in saubere, testbare Android-Strukturen. Perfekt geeignet für Product Owner, CTOs und Entwickler vor dem Projektstart.
              </p>
            </div>

            <div className="bg-neutral-900/40 border border-neutral-850 p-6 rounded-2xl flex flex-col gap-3 hover:border-neutral-800 transition-all">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-neutral-200">2. Privacy by Design</h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Standardmäßig offline-first. Integriert modernste Verschlüsselungsmethoden, Biometrie-Absicherung und lokale Datenbankstrukturen (Room mit SQLCipher).
              </p>
            </div>

            <div className="bg-neutral-900/40 border border-neutral-850 p-6 rounded-2xl flex flex-col gap-3 hover:border-neutral-800 transition-all">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 shrink-0">
                <Code className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-neutral-200">3. Ready-to-use Code</h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Erzeugt sofort kompilierbaren Kotlin-Code, Dagger Hilt DI-Konfigurationen, Jetpack Compose Interfaces, Room DAOs und eine vollständige CI/CD GitHub Pipeline.
              </p>
            </div>
          </div>

          {/* Accordion FAQ Area */}
          <FaqSection
            activeFaqIndex={activeFaqIndex}
            onToggleFaq={(idx) => setActiveFaqIndex(idx)}
          />
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950/80 py-8 px-4 text-center mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© 2026 Android Architecture Co-pilot. Lizenziert unter der hochgradig permissiven <a href="#/" onClick={(e) => { e.preventDefault(); if (blueprint) { setActiveTab('license'); document.getElementById('blueprint-card')?.scrollIntoView({ behavior: 'smooth' }); } }} className="text-teal-400 hover:underline font-bold">MIT Open Source Lizenz</a>. Frei nutzbar, veränderbar und verteilbar für jeden.</p>
          <div className="flex gap-4">
            <span>Kotlin 2.0+</span>
            <span>•</span>
            <span>Compose Material 3</span>
            <span>•</span>
            <span>Hilt DI</span>
            <span>•</span>
            <span>Privacy By Design</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
