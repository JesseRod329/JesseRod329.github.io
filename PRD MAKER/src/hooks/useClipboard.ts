// Clipboard functionality hook
import { useCallback } from 'react';

/**
 * Custom hook for clipboard operations
 * Provides copy and download functionality
 */
export const useClipboard = () => {
  /**
   * Copy text to clipboard
   */
  const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      return false;
    }
  }, []);

  /**
   * Download text as markdown file
   */
  const downloadAsMarkdown = useCallback((content: string, filename: string = 'prd.md'): void => {
    try {
      const element = document.createElement('a');
      const file = new Blob([content], { type: 'text/markdown' });
      element.href = URL.createObjectURL(file);
      element.download = filename;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (err) {
      console.error('Failed to download file:', err);
    }
  }, []);

  return {
    copyToClipboard,
    downloadAsMarkdown,
  };
};
