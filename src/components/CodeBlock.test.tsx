// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import React from 'react';
import { CodeBlock } from './CodeBlock';

describe('CodeBlock Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders code content and language badge correctly', () => {
    render(<CodeBlock code="val name = 'Android'" language="kotlin" title="MainActivity.kt" />);

    expect(screen.getByText('MainActivity.kt')).not.toBeNull();
    expect(screen.getByText('kotlin')).not.toBeNull();
    expect(screen.getByText("val name = 'Android'")).not.toBeNull();
  });

  it('handles clipboard copy correctly', async () => {
    // Mock navigator.clipboard
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    vi.useFakeTimers();

    render(<CodeBlock code="fun main() {}" language="kotlin" />);

    const copyBtn = screen.getByTitle('Copy code');
    expect(copyBtn).not.toBeNull();

    act(() => {
      fireEvent.click(copyBtn);
    });

    expect(writeTextMock).toHaveBeenCalledWith('fun main() {}');
    expect(screen.getByText('Copied!')).not.toBeNull();

    act(() => {
      vi.advanceTimersByTime(2100);
    });

    expect(screen.getByText('Copy')).not.toBeNull();

    vi.useRealTimers();
  });
});
