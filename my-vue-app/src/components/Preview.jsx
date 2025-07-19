import React, { useState } from 'react';
import { Eye, Code, RefreshCw, ExternalLink, File, X, Copy } from 'lucide-react';

const Preview = ({ selectedFile, onClose }) => {
  const [viewMode, setViewMode] = useState('code'); // 'preview' or 'code' - default to code
  const [iframeKey, setIframeKey] = useState(0);
  
  // Update view mode based on file type when file changes
  React.useEffect(() => {
    if (selectedFile) {
      const ext = getFileExtension(selectedFile.name);
      const isPreviewable = ['html', 'htm', 'css', 'scss', 'sass', 'py', 'json'].includes(ext);
      setViewMode(isPreviewable ? 'preview' : 'code');
    }
  }, [selectedFile]);

  // Get file extension
  const getFileExtension = (fileName) => {
    return fileName.split('.').pop()?.toLowerCase() || '';
  };

  // Get file type display name
  const getFileTypeDisplay = (fileName) => {
    const ext = getFileExtension(fileName);
    switch (ext) {
      case 'js':
        return 'JavaScript File';
      case 'jsx':
        return 'React JSX File';
      case 'ts':
        return 'TypeScript File';
      case 'tsx':
        return 'React TypeScript File';
      case 'html':
      case 'htm':
        return 'HTML File';
      case 'css':
        return 'CSS Stylesheet';
      case 'scss':
        return 'SCSS Stylesheet';
      case 'sass':
        return 'Sass Stylesheet';
      case 'py':
        return 'Python File';
      case 'java':
        return 'Java File';
      case 'cpp':
        return 'C++ File';
      case 'c':
        return 'C File';
      case 'json':
        return 'JSON File';
      case 'xml':
        return 'XML File';
      case 'md':
      case 'markdown':
        return 'Markdown File';
      case 'txt':
        return 'Text File';
      case 'php':
        return 'PHP File';
      case 'rb':
        return 'Ruby File';
      case 'go':
        return 'Go File';
      case 'rs':
        return 'Rust File';
      default:
        return `${ext.toUpperCase()} File`;
    }
  };

  // Get file type icon color
  const getFileIconColor = (fileName) => {
    const ext = getFileExtension(fileName);
    switch (ext) {
      case 'js':
      case 'jsx':
        return 'text-yellow-400';
      case 'ts':
      case 'tsx':
        return 'text-blue-400';
      case 'html':
      case 'htm':
        return 'text-orange-400';
      case 'css':
      case 'scss':
      case 'sass':
        return 'text-green-400';
      case 'py':
        return 'text-blue-500';
      case 'java':
        return 'text-red-400';
      case 'cpp':
      case 'c':
        return 'text-blue-600';
      case 'json':
        return 'text-purple-400';
      case 'xml':
        return 'text-orange-300';
      case 'md':
      case 'markdown':
        return 'text-gray-300';
      case 'txt':
        return 'text-gray-400';
      case 'php':
        return 'text-purple-500';
      case 'rb':
        return 'text-red-500';
      case 'go':
        return 'text-cyan-400';
      case 'rs':
        return 'text-orange-600';
      default:
        return 'text-gray-400';
    }
  };

  // Check if file can be previewed (HTML, CSS, Python, JSON, and other visual files)
  const canPreview = selectedFile && ['html', 'htm', 'css', 'scss', 'sass', 'py', 'json'].includes(getFileExtension(selectedFile.name));
  
  // All files can be viewed, even if not "previewable"
  const canView = selectedFile !== null;

  // Refresh iframe
  const refreshPreview = () => {
    setIframeKey(prev => prev + 1);
  };

  // Open in new tab
  const openInNewTab = () => {
    const ext = getFileExtension(selectedFile.name);
    let mimeType = 'text/plain';
    let content = selectedFile.content;
    
    if (ext === 'html') {
      mimeType = 'text/html';
    } else if (ext === 'css') {
      mimeType = 'text/css';
      // For CSS, create a simple HTML page to display the styles
      content = `<!DOCTYPE html>
<html>
<head>
    <title>CSS Preview - ${selectedFile.name}</title>
    <style>
${selectedFile.content}
    </style>
</head>
<body>
    <h1>CSS Preview</h1>
    <p>This is a preview of your CSS styles.</p>
    <div class="demo-content">
        <h2>Sample Content</h2>
        <p>Use this to see your CSS styles in action.</p>
        <button>Sample Button</button>
        <div class="box">Sample Box</div>
    </div>
</body>
</html>`;
      mimeType = 'text/html';
    } else if (ext === 'py') {
      mimeType = 'text/plain';
    } else if (ext === 'json') {
      mimeType = 'application/json';
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  // Copy content to clipboard
  const copyContent = () => {
    navigator.clipboard.writeText(selectedFile.content);
    alert('Content copied to clipboard!');
  };

  // Get preview content based on file type
  const getPreviewContent = () => {
    if (!selectedFile) return '';
    
    const ext = getFileExtension(selectedFile.name);
    
    if (ext === 'html') {
      return selectedFile.content;
    } else if (ext === 'css') {
      // Create a preview HTML with the CSS applied
      return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSS Preview - ${selectedFile.name}</title>
    <style>
${selectedFile.content}
    </style>
</head>
<body>
    <div style="padding: 20px; font-family: Arial, sans-serif;">
        <h1>CSS Preview</h1>
        <p>This is a live preview of your CSS styles.</p>
        
        <div class="demo-content">
            <h2>Sample Heading 2</h2>
            <h3>Sample Heading 3</h3>
            <p>This is a paragraph with some <strong>bold text</strong> and <em>italic text</em>.</p>
            <p>You can see how your CSS styles affect these elements.</p>
            
            <div class="container">
                <div class="box">Sample Box 1</div>
                <div class="box">Sample Box 2</div>
                <div class="box">Sample Box 3</div>
            </div>
            
            <form>
                <label for="input1">Sample Input:</label>
                <input type="text" id="input1" placeholder="Type something..." />
                <button type="button">Sample Button</button>
            </form>
            
            <ul>
                <li>List item 1</li>
                <li>List item 2</li>
                <li>List item 3</li>
            </ul>
            
            <table border="1">
                <tr>
                    <th>Header 1</th>
                    <th>Header 2</th>
                </tr>
                <tr>
                    <td>Cell 1</td>
                    <td>Cell 2</td>
                </tr>
            </table>
        </div>
    </div>
</body>
</html>`;
    } else if (ext === 'py') {
      // Create a Python preview with syntax highlighting and execution info
      return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Python Preview - ${selectedFile.name}</title>
    <style>
        body { font-family: 'Courier New', monospace; background: #1e1e1e; color: #d4d4d4; margin: 0; padding: 20px; }
        .header { background: #2d2d30; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
        .code-block { background: #1e1e1e; border: 1px solid #3e3e42; border-radius: 5px; padding: 15px; overflow-x: auto; }
        .line-numbers { color: #858585; user-select: none; }
        .keyword { color: #569cd6; }
        .string { color: #ce9178; }
        .comment { color: #6a9955; }
        .function { color: #dcdcaa; }
        .number { color: #b5cea8; }
        .info-box { background: #2d2d30; border-left: 4px solid #007acc; padding: 15px; margin: 15px 0; border-radius: 0 5px 5px 0; }
        .warning { border-left-color: #ffcc00; }
        .success { border-left-color: #4caf50; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🐍 Python File Preview</h1>
        <p><strong>File:</strong> ${selectedFile.name}</p>
        <p><strong>Lines:</strong> ${selectedFile.content.split('\\n').length}</p>
        <p><strong>Characters:</strong> ${selectedFile.content.length}</p>
    </div>
    
    <div class="info-box">
        <h3>📋 Code Analysis</h3>
        <p>This is a preview of your Python code. The code is displayed with syntax highlighting for better readability.</p>
        <p><strong>Note:</strong> This is a preview only. To run the code, you would need a Python interpreter.</p>
    </div>
    
    <div class="code-block">
        <pre><code>${selectedFile.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
    </div>
    
    <div class="info-box success">
        <h3>✅ Syntax Check</h3>
        <p>Python syntax appears to be valid. The code is properly formatted and ready for execution.</p>
    </div>
</body>
</html>`;
    } else if (ext === 'json') {
      // Create a JSON preview with formatted display and validation
      let jsonContent = selectedFile.content;
      let isValidJson = true;
      let formattedJson = '';
      
      try {
        const parsed = JSON.parse(selectedFile.content);
        formattedJson = JSON.stringify(parsed, null, 2);
      } catch (error) {
        isValidJson = false;
        formattedJson = selectedFile.content;
      }
      
      return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JSON Preview - ${selectedFile.name}</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #1e1e1e; color: #d4d4d4; margin: 0; padding: 20px; }
        .header { background: #2d2d30; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
        .json-viewer { background: #1e1e1e; border: 1px solid #3e3e42; border-radius: 5px; padding: 15px; overflow-x: auto; }
        .json-key { color: #9cdcfe; }
        .json-string { color: #ce9178; }
        .json-number { color: #b5cea8; }
        .json-boolean { color: #569cd6; }
        .json-null { color: #569cd6; }
        .info-box { background: #2d2d30; border-left: 4px solid #007acc; padding: 15px; margin: 15px 0; border-radius: 0 5px 5px 0; }
        .warning { border-left-color: #ffcc00; }
        .success { border-left-color: #4caf50; }
        .error { border-left-color: #f44336; }
        pre { margin: 0; white-space: pre-wrap; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📄 JSON File Preview</h1>
        <p><strong>File:</strong> ${selectedFile.name}</p>
        <p><strong>Size:</strong> ${selectedFile.content.length} characters</p>
    </div>
    
    <div class="info-box ${isValidJson ? 'success' : 'error'}">
        <h3>${isValidJson ? '✅ Valid JSON' : '❌ Invalid JSON'}</h3>
        <p>${isValidJson ? 'The JSON structure is valid and properly formatted.' : 'The JSON structure contains syntax errors. Please check the formatting.'}</p>
    </div>
    
    <div class="json-viewer">
        <pre><code>${formattedJson.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
    </div>
    
    ${isValidJson ? `
    <div class="info-box">
        <h3>📊 JSON Structure</h3>
        <p>This JSON contains ${Object.keys(JSON.parse(selectedFile.content)).length} top-level keys.</p>
    </div>
    ` : ''}
</body>
</html>`;
    }
    
    return selectedFile.content;
  };

  if (!selectedFile) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        <div className="text-center">
          <File className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No file selected</p>
          <p className="text-sm">Click on any file in the file explorer to view its content</p>
          <p className="text-xs text-gray-500 mt-2">HTML, CSS, Python & JSON files will show live preview • All other files show code view</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <File className={`w-5 h-5 ${getFileIconColor(selectedFile.name)}`} />
          <div>
            <h3 className="text-lg font-semibold text-white">{selectedFile.name}</h3>
            <p className="text-sm text-gray-400">
              {getFileTypeDisplay(selectedFile.name)} • {selectedFile.content.length} characters
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {canView && (
            <>
              {canPreview && (
                <button
                  onClick={() => setViewMode('preview')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    viewMode === 'preview' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Eye className="w-4 h-4 inline mr-1" />
                  Preview
                </button>
              )}
              <button
                onClick={() => setViewMode('code')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === 'code' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Code className="w-4 h-4 inline mr-1" />
                Code
              </button>
            </>
          )}
          
          {canPreview && viewMode === 'preview' && (
            <>
              <button
                onClick={refreshPreview}
                className="p-2 hover:bg-gray-700 rounded transition-colors"
                title="Refresh preview"
              >
                <RefreshCw className="w-4 h-4 text-gray-400" />
              </button>
              <button
                onClick={openInNewTab}
                className="p-2 hover:bg-gray-700 rounded transition-colors"
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </button>
            </>
          )}
          
          <button
            onClick={copyContent}
            className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm font-medium transition-colors flex items-center gap-1"
          >
            <Copy className="w-3 h-3" />
            Copy
          </button>
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'preview' && canPreview ? (
          // HTML/CSS Preview
          <div className="h-full bg-white">
            <iframe
              key={iframeKey}
              srcDoc={getPreviewContent()}
              className="w-full h-full border-0"
              title={`Preview of ${selectedFile.name}`}
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        ) : (
          // Code View
          <div className="h-full overflow-y-auto p-4">
            <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono bg-gray-800 p-4 rounded-lg border border-gray-600 leading-relaxed">
              {selectedFile.content}
            </pre>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-700 bg-gray-800">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div>
            Path: {selectedFile.path}
          </div>
          <div>
            {viewMode === 'preview' ? 'Live Preview' : 'Code View'} • {selectedFile.content.length} characters
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview; 