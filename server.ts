import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Gemini SDK with named parameters as per SKILL.md
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Route for Technical Blueprint Generation
  app.post('/api/generate-blueprint', async (req, res) => {
    try {
      const {
        appName,
        concept,
        targetAudience,
        keyIntegrations = [],
        projectStructure = 'single-module',
        architecturePattern = 'MVVM'
      } = req.body;

      if (!appName || !concept) {
        return res.status(400).json({ error: 'App Name and Concept are required.' });
      }

      const integrationsText = keyIntegrations.length > 0 
        ? keyIntegrations.join(', ') 
        : 'None specified';

      const prompt = `You are a Senior Android Software Architect and Product Manager. Your task is to design a professional, complete technical concept (Technical Blueprint) for a native Android application.
This concept will serve as a direct guide for a team of experienced developers to write production-grade code.

App Details provided by user:
- App Name: ${appName}
- Loose Idea/Concept: ${concept}
- Target Audience: ${targetAudience || 'General Audience'}
- Selected Key Integrations: ${integrationsText}
- Requested Project Structure: ${projectStructure} (e.g. single-module MVVM or multi-module modularized clean architecture)
- Architecture Pattern: ${architecturePattern}

Guidelines:
1. Focus heavily on modern Android-Standards: Kotlin, Jetpack Compose, Clean Architecture, Dependency Injection (Hilt), Asynchronous flows (Kotlin Coroutines & Flow), Local Persistence (Room/EncryptedSharedPreferences), and Networking (Retrofit/Ktor).
2. Adhere strictly to "Privacy by Design" principles. Ensure data is stored securely (biometrics, keystore, DB encryption) and minimized.
3. Keep the blueprint practical, detailed, and directly action-oriented, featuring real Gradle coordinate declarations, a structured package/directory tree, and a sample data model with complete Kotlin Data Classes/Entities.

Generate the blueprint adhering to the structured JSON response schema provided. Please ensure all values are highly detailed, realistic, and expert-grade.`;

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          summaryTab: {
            type: Type.OBJECT,
            properties: {
              appName: { type: Type.STRING, description: "A professional, catchy name based on the idea" },
              vision: { type: Type.STRING, description: "Short executive summary" },
              architecturePattern: { type: Type.STRING, description: "Architecture pattern, e.g., MVI with Clean Architecture" }
            },
            required: ["appName", "vision", "architecturePattern"]
          },
          databaseTab: {
            type: Type.OBJECT,
            properties: {
              entityCode: { type: Type.STRING, description: "Raw Room Entity Kotlin code, preserve line breaks with \\n" },
              daoCode: { type: Type.STRING, description: "Raw Room DAO Kotlin code, preserve line breaks with \\n" }
            },
            required: ["entityCode", "daoCode"]
          },
          uiTab: {
            type: Type.OBJECT,
            properties: {
              composeCode: { type: Type.STRING, description: "Raw Kotlin Jetpack Compose code, preserve line breaks with \\n" }
            },
            required: ["composeCode"]
          },
          gradleTab: {
            type: Type.OBJECT,
            properties: {
              dependencies: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of dependency implementation strings, e.g., implementation(\"androidx.room:room-ktx:2.6.1\")"
              }
            },
            required: ["dependencies"]
          },
          securityTab: {
            type: Type.OBJECT,
            properties: {
              concepts: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Security architecture implementations"
              }
            },
            required: ["concepts"]
          }
        },
        required: ["summaryTab", "databaseTab", "uiTab", "gradleTab", "securityTab"]
      };

      const result = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          temperature: 0.2, // Low temperature for deterministic output
          responseMimeType: "application/json",
          responseSchema: responseSchema,
          systemInstruction: `You are an elite Android Software Architect and Privacy Engineer. Your primary task is to generate comprehensive, production-ready Android Technical Blueprints based on the user's application concept.

CRITICAL INSTRUCTION - OUTPUT FORMAT:
You MUST output the result EXCLUSIVELY as a raw, valid JSON object. Do not wrap the JSON in markdown blocks (e.g., \`\`\`json ... \`\`\`). Do not add any introductory or concluding text. The frontend relies on this exact parsing.

The JSON MUST adhere exactly to the schema provided.

ENGINEERING DIRECTIVES FOR KOTLIN CODE:
1. Room & SQLCipher (databaseTab): 
   - Write robust Room \`@Entity\` data classes and \`@Dao\` interfaces.
   - Use Kotlin Coroutines (\`suspend\` functions) and \`Flow\` for database operations.
   - Include inline code comments explaining how \`net.zetetic:android-database-sqlcipher\` and its \`SupportFactory\` are initialized to encrypt the Room database.
   - Assume keys are fetched securely via the Android Keystore system.

2. Jetpack Compose & MVI (uiTab): 
   - Use Modern Android Development (MAD) and Material Design 3.
   - Write a primary UI screen using \`@Composable\`.
   - Strictly implement the MVI (Model-View-Intent) pattern. 
   - Explicitly define a \`data class\` for the \`UiState\` and a \`sealed class\` (or interface) for the \`UiIntent\` / \`UiEvent\`.
   - Ensure the UI code demonstrates subscribing to StateFlow and dispatching intents to a ViewModel.

3. Privacy by Design: 
   - Ensure all architectural choices reflect absolute data security, zero-knowledge principles, and local-only data persistence.
   - Code must be clean, use strong typing, avoid deprecated APIs, and follow SOLID principles.`,
        }
      });

      if (!result || !result.text) {
        return res.status(502).json({ error: 'The AI model generated an empty response. Please retry.' });
      }

      let parsedBlueprint: any;
      try {
        parsedBlueprint = JSON.parse(result.text);
      } catch (parseError) {
        console.error('JSON parse error from Gemini output:', parseError, result.text);
        return res.status(502).json({ 
          error: 'The AI response contained invalid JSON formatting. Please retry your generation request.' 
        });
      }

      res.json(parsedBlueprint);

    } catch (error: any) {
      console.error('Generation error:', error);
      const isTimeout = error.message?.toLowerCase().includes('timeout') || error.code === 'ETIMEDOUT';
      const isAuthError = error.status === 401 || error.message?.includes('API_KEY');

      if (isTimeout) {
        return res.status(504).json({ error: 'The generation request timed out. Please try again with a slightly simpler app concept.' });
      } else if (isAuthError) {
        return res.status(401).json({ error: 'Gemini API authentication failed. Please verify process.env.GEMINI_API_KEY.' });
      }

      res.status(500).json({ error: error.message || 'Failed to generate technical blueprint. Please check server logs.' });
    }
  });

  // Serve Client
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

startServer();
