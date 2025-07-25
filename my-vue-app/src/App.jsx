import React, { useState } from 'react';
import { FileText, MessageSquare, Settings, Menu, X, Monitor } from 'lucide-react';
import FileExplorer from './components/FileExplorer';
import ChatInterface from './components/ChatInterface';
import ChatHistory from './components/ChatHistory';
import Preview from './components/Preview';

function App() {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Handle file selection from FileExplorer
  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setPreviewOpen(true);
  };

  // Handle file preview close
  const handlePreviewClose = () => {
    setPreviewOpen(false);
    // Don't clear selectedFile so user can toggle preview back
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex overflow-hidden">
      {/* Left Sidebar - File Explorer */}
      <div className={`${leftSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 bg-gray-800 border-r border-gray-700 overflow-hidden flex flex-col`}>
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              <span className="font-semibold">Files</span>
            </div>
            <button
              onClick={() => setLeftSidebarOpen(false)}
              className="p-1 hover:bg-gray-700 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <FileExplorer onFileSelect={handleFileSelect} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="h-14 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            {!leftSidebarOpen && (
              <button
                onClick={() => setLeftSidebarOpen(true)}
                className="p-2 hover:bg-gray-700 rounded"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <h1 className="text-xl font-bold">AI Assistant</h1>
          </div>
          <div className="flex items-center gap-4">
            {/* Preview Tab Button */}
            <button
              onClick={() => setPreviewOpen(!previewOpen)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-2 ${
                previewOpen 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Monitor className="w-4 h-4" />
              Preview
            </button>
            
            {!rightSidebarOpen && (
              <button
                onClick={() => setRightSidebarOpen(true)}
                className="p-2 hover:bg-gray-700 rounded"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
            )}
            <Settings className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Main Content - Chat Interface with optional Preview */}
        <div className="flex-1 flex">
          {/* Chat Interface */}
          <div className={`${previewOpen ? 'w-1/2' : 'w-full'} transition-all duration-300 flex flex-col`}>
            <ChatInterface />
          </div>

          {/* Preview Panel */}
          {previewOpen && (
            <div className="w-1/2 border-l border-gray-700 flex flex-col">
              <Preview 
                selectedFile={selectedFile} 
                onClose={handlePreviewClose} 
              />
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Chat History */}
      <div className={`${rightSidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-gray-800 border-l border-gray-700 overflow-hidden flex flex-col`}>
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-400" />
              <span className="font-semibold">History</span>
            </div>
            <button
              onClick={() => setRightSidebarOpen(false)}
              className="p-1 hover:bg-gray-700 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <ChatHistory />
        </div>
      </div>
    </div>
  );
}

export default App;
