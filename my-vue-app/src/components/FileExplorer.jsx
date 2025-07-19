import React, { useState, useEffect } from 'react';
import { Folder, File, Plus, Search, ChevronRight, ChevronDown, Eye, Trash2, X } from 'lucide-react';

const FileExplorer = () => {
  const [files, setFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Fetch files from backend
  const fetchFiles = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/files');
      if (response.ok) {
        const data = await response.json();
        setFiles(data.files || []);
      } else {
        console.error('Failed to fetch files');
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load files on component mount
  useEffect(() => {
    fetchFiles();
    
    // Refresh files every 3 seconds to show new files created by AI
    const interval = setInterval(fetchFiles, 3000);
    return () => clearInterval(interval);
  }, []);

  // Preview file content
  const previewFile = async (fileName) => {
    try {
      console.log(`🔍 Previewing file: ${fileName}`);
      const response = await fetch(`/api/files/${encodeURIComponent(fileName)}/content`);
      
      if (response.ok) {
        const data = await response.json();
        setSelectedFile({
          name: data.name,
          content: data.content,
          type: data.type,
          path: data.path
        });
        setShowPreview(true);
      } else {
        const errorData = await response.json();
        console.error('Preview error:', errorData);
        alert(`Could not load file content: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error previewing file:', error);
      alert(`Could not load file content: ${error.message}`);
    }
  };

  // Delete file
  const deleteFile = async (fileName) => {
    if (!confirm(`Are you sure you want to delete ${fileName}?`)) return;
    
    try {
      const response = await fetch('/api/files/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName }),
      });

      if (response.ok) {
        await fetchFiles(); // Refresh file list
        // Close preview if the deleted file was being previewed
        if (selectedFile && selectedFile.name === fileName) {
          setShowPreview(false);
          setSelectedFile(null);
        }
        alert(`File ${fileName} deleted successfully`);
      } else {
        const data = await response.json();
        alert(`Error deleting file: ${data.error}`);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      alert(`Error deleting file: ${error.message}`);
    }
  };

  // Get file extension for syntax highlighting
  const getFileExtension = (fileName) => {
    return fileName.split('.').pop()?.toLowerCase() || '';
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
        return 'text-orange-400';
      case 'css':
        return 'text-green-400';
      case 'json':
        return 'text-purple-400';
      case 'md':
        return 'text-gray-300';
      default:
        return 'text-gray-400';
    }
  };

  // Filter files based on search term
  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="flex-1 flex flex-col min-h-0">
        <div className="p-3 border-b border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-2">
            {isLoading ? (
              <div className="text-center text-gray-400 py-4">
                Loading files...
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="text-center text-gray-400 py-4">
                {searchTerm ? 'No files match your search' : 'No files available'}
              </div>
            ) : (
              filteredFiles.map((file) => (
                <div
                  key={file.name}
                  className="flex items-center py-2 px-2 hover:bg-gray-700 cursor-pointer group rounded-md"
                >
                  <File className={`w-4 h-4 mr-2 ${getFileIconColor(file.name)}`} />
                  <span className="text-sm truncate flex-1">{file.name}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        previewFile(file.name);
                      }}
                      className="p-1 hover:bg-gray-600 rounded"
                      title="Preview file"
                    >
                      <Eye className="w-3 h-3 text-blue-400" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFile(file.name);
                      }}
                      className="p-1 hover:bg-gray-600 rounded"
                      title="Delete file"
                    >
                      <Trash2 className="w-3 h-3 text-red-400" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-3 border-t border-gray-700">
          <div className="text-xs text-gray-400 mb-2">
            {filteredFiles.length} file{filteredFiles.length !== 1 ? 's' : ''}
          </div>
          <button 
            onClick={fetchFiles}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Refresh Files
          </button>
        </div>
      </div>

      {/* File Preview Modal */}
      {showPreview && selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-4xl h-5/6 flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <File className={`w-5 h-5 ${getFileIconColor(selectedFile.name)}`} />
                <div>
                  <h3 className="text-lg font-semibold text-white">{selectedFile.name}</h3>
                  <p className="text-sm text-gray-400">
                    {getFileExtension(selectedFile.name).toUpperCase()} File • {selectedFile.content.length} characters
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowPreview(false);
                  setSelectedFile(null);
                }}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto p-4">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono bg-gray-900 p-4 rounded-lg border border-gray-600 leading-relaxed">
                  {selectedFile.content}
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-700 flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Path: {selectedFile.path}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedFile.content);
                    alert('Content copied to clipboard!');
                  }}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium transition-colors"
                >
                  Copy Content
                </button>
                <button
                  onClick={() => deleteFile(selectedFile.name)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm font-medium transition-colors"
                >
                  Delete File
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FileExplorer; 