import { describe, it, expect } from 'vitest';
import { normalizeBlueprint, TEMPLATES } from './types';

describe('normalizeBlueprint', () => {
  it('should normalize minimal/empty input with sensible defaults', () => {
    const raw = {};
    const result = normalizeBlueprint(raw);

    expect(result.summaryTab?.appName).toBe('Android App');
    expect(result.summaryTab?.vision).toBe('No vision statement provided.');
    expect(result.summaryTab?.architecturePattern).toBe('MVVM with Clean Architecture');
    expect(result.databaseTab?.entityCode).toContain('// Room Entities not provided');
    expect(result.techStack.language).toBe('Kotlin');
    expect(result.techStack.diFramework).toBe('Dagger Hilt');
    expect(result.packageStructure.type).toBe('single-module');
  });

  it('should preserve existing tab structures correctly', () => {
    const raw = {
      summaryTab: {
        appName: 'VaultCore',
        vision: 'Zero Knowledge vault app',
        architecturePattern: 'MVI'
      },
      gradleTab: {
        dependencies: ['implementation("androidx.room:room-runtime:2.6.1")']
      },
      databaseTab: {
        entityCode: '@Entity data class Note(val id: Int)',
        daoCode: '@Dao interface NoteDao'
      },
      securityTab: {
        concepts: ['SQLCipher encryption', 'Android KeyStore']
      }
    };

    const result = normalizeBlueprint(raw);

    expect(result.summaryTab?.appName).toBe('VaultCore');
    expect(result.gradleTab?.dependencies).toHaveLength(1);
    expect(result.databaseTab?.entityCode).toContain('@Entity data class Note');
    expect(result.techStack.dependencies[0].name).toBe('room-runtime');
    expect(result.executiveSummary.vision).toBe('Zero Knowledge vault app');
  });

  it('should fall back to legacy executiveSummary structure if summaryTab is absent', () => {
    const raw = {
      executiveSummary: {
        vision: 'Legacy vision string',
        targetAudience: 'Developers',
        architecturalGoals: ['Clean Arch']
      },
      techStack: {
        architecturePattern: 'MVVM'
      }
    };

    const result = normalizeBlueprint(raw);

    expect(result.summaryTab?.vision).toBe('Legacy vision string');
    expect(result.summaryTab?.architecturePattern).toBe('MVVM');
  });
});

describe('TEMPLATES', () => {
  it('should include the custom template and pre-configured templates', () => {
    expect(TEMPLATES.length).toBeGreaterThanOrEqual(4);
    expect(TEMPLATES[0].id).toBe('custom');
    expect(TEMPLATES.find(t => t.id === 'vault')).toBeDefined();
  });
});
