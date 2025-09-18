// Markdown rendering utilities

/**
 * Convert markdown text to HTML with proper styling
 * Handles headers, lists, code blocks, and inline formatting
 */
export const renderMarkdown = (text: string): string => {
  // First, handle code blocks and inline code
  let html = text
    .replace(/\`\`\`([\s\S]*?)\`\`\`/g, '<pre class="bg-gray-100 p-4 rounded mb-4 overflow-x-auto"><code>$1</code></pre>')
    .replace(/\`(.*?)\`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>');

  // Split into lines for better processing
  const lines = html.split('\n');
  const processedLines: string[] = [];
  const lists: Array<{ type: string; items: string[] }> = [];
  let currentLevel = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // Determine indentation level
    const indentMatch = line.match(/^(\s*)([\*\-\+]|\d+\.)\s/);
    
    if (indentMatch) {
      // This is a list item
      const indent = indentMatch[1].length;
      const level = Math.floor(indent / 2); // 2 spaces = 1 level
      const marker = indentMatch[2];
      const listType = marker.match(/\d+\./) ? 'ol' : 'ul';
      const cleanItem = line.replace(/^(\s*)([\*\-\+]|\d+\.)\s/, '');
      
      // Handle nested lists
      if (level > currentLevel) {
        // Going deeper - start new nested list
        for (let j = currentLevel; j < level; j++) {
          lists.push({ type: listType, items: [] });
        }
        currentLevel = level;
      } else if (level < currentLevel) {
        // Going back up - close nested lists
        while (currentLevel > level) {
          const completedList = lists.pop();
          if (completedList) {
            const listClass = completedList.type === 'ol' ? 'list-decimal' : 'list-disc';
            const nestedList = `<${completedList.type} class="${listClass} list-inside mb-2 ml-4">${completedList.items.join('')}</${completedList.type}>`;
            
            if (lists.length > 0) {
              // Append to parent list
              const lastList = lists[lists.length - 1];
              if (lastList.items.length > 0) {
                lastList.items[lastList.items.length - 1] += nestedList;
              }
            } else {
              // Add to processed lines
              processedLines.push(nestedList);
            }
          }
          currentLevel--;
        }
        currentLevel = level;
      }
      
      // Initialize level if needed
      if (lists.length === 0 || level >= lists.length) {
        lists.push({ type: listType, items: [] });
      }
      
      // Add item to current level
      const currentList = lists[level];
      if (currentList) {
        currentList.items.push(`<li class="mb-1">${cleanItem}</li>`);
      }
    } else {
      // Not a list item - close all open lists
      while (lists.length > 0) {
        const completedList = lists.pop();
        if (completedList) {
          const listClass = completedList.type === 'ol' ? 'list-decimal' : 'list-disc';
          const listElement = `<${completedList.type} class="${listClass} list-inside mb-4 ${lists.length > 0 ? 'ml-4' : ''}">${completedList.items.join('')}</${completedList.type}>`;
          
          if (lists.length > 0) {
            // Append to parent list
            const lastList = lists[lists.length - 1];
            if (lastList.items.length > 0) {
              lastList.items[lastList.items.length - 1] += listElement;
            }
          } else {
            // Add to processed lines
            processedLines.push(listElement);
          }
        }
      }
      currentLevel = 0;
      
      // Process non-list lines
      if (trimmedLine) {
        // Headers
        if (line.startsWith('# ')) {
          processedLines.push(`<h1 class="text-2xl font-bold text-gray-900 mt-8 mb-4">${line.substring(2)}</h1>`);
        } else if (line.startsWith('## ')) {
          processedLines.push(`<h2 class="text-xl font-bold text-gray-900 mt-6 mb-3">${line.substring(3)}</h2>`);
        } else if (line.startsWith('### ')) {
          processedLines.push(`<h3 class="text-lg font-bold text-gray-900 mt-4 mb-2">${line.substring(4)}</h3>`);
        } else {
          // Regular paragraph
          processedLines.push(`<p class="mb-4">${line}</p>`);
        }
      } else {
        // Empty line
        processedLines.push('');
      }
    }
  }
  
  // Close any remaining lists
  while (lists.length > 0) {
    const completedList = lists.pop();
    if (completedList) {
      const listClass = completedList.type === 'ol' ? 'list-decimal' : 'list-disc';
      const listElement = `<${completedList.type} class="${listClass} list-inside mb-4 ${lists.length > 0 ? 'ml-4' : ''}">${completedList.items.join('')}</${completedList.type}>`;
      
      if (lists.length > 0) {
        // Append to parent list
        const lastList = lists[lists.length - 1];
        if (lastList.items.length > 0) {
          lastList.items[lastList.items.length - 1] += listElement;
        }
      } else {
        // Add to processed lines
        processedLines.push(listElement);
      }
    }
  }
  
  // Join processed lines
  html = processedLines.join('\n');
  
  // Handle inline formatting
  html = html
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
    .replace(/__(.*?)__/g, '<strong>$1</strong>') // Alternative bold
    .replace(/_(.*?)_/g, '<em>$1</em>') // Alternative italic
    .replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>'); // Links

  return html;
};
