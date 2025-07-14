import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Folder, File, Plus, Search, ChevronRight, ChevronDown, RefreshCw, Eye, Trash2, Code, FileText } from 'lucide-react';

const FileExplorer = forwardRef((props, ref) => {
  const [expandedFolders, setExpandedFolders] = useState(new Set(['src']));
  const [searchTerm, setSearchTerm] = useState('');
  const [fileStructure, setFileStructure] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Function to build file tree from a flat list
  const buildFileTree = (files) => {
    const tree = [];
    const fileMap = new Map();

    files.forEach(file => {
      const parts = file.name.split('/');
      let currentPath = '';
      
      parts.forEach((part, index) => {
        const isLast = index === parts.length - 1;
        const path = currentPath ? `${currentPath}/${part}` : part;
        
        if (!fileMap.has(path)) {
          const node = {
            id: path,
            name: part,
            type: isLast ? 'file' : 'folder',
            children: [],
            fileData: isLast ? file : null
          };
          
          if (currentPath && fileMap.has(currentPath)) {
            fileMap.get(currentPath).children.push(node);
          } else {
            tree.push(node);
          }
          
          fileMap.set(path, node);
        }
        
        currentPath = path;
      });
    });

    return tree;
  };

  // Function to get files from the virtual file system
  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/files');
      if (response.ok) {
        const files = await response.json();
        const tree = buildFileTree(files);
        setFileStructure(tree);
      } else {
        console.error('Failed to fetch files');
        setFileStructure([]);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
      setFileStructure([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Expose fetchFiles function to parent component
  useImperativeHandle(ref, () => ({
    fetchFiles
  }));

  useEffect(() => {
    fetchFiles();
  }, []);

  const toggleFolder = (folderId) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleFileClick = (fileData) => {
    setSelectedFile(fileData);
    setShowPreview(true);
  };

  const handleDeleteFile = async (fileName) => {
    if (window.confirm(`Are you sure you want to delete ${fileName}?`)) {
      try {
        const response = await fetch(`http://localhost:3001/api/files/${encodeURIComponent(fileName)}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          fetchFiles(); // Refresh file list
          if (selectedFile && selectedFile.name === fileName) {
            setSelectedFile(null);
            setShowPreview(false);
          }
        } else {
          console.error('Failed to delete file');
        }
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
        return <Code className="w-4 h-4 mr-2 text-yellow-400" />;
      case 'json':
        return <FileText className="w-4 h-4 mr-2 text-green-400" />;
      case 'css':
      case 'scss':
        return <FileText className="w-4 h-4 mr-2 text-blue-400" />;
      case 'html':
        return <FileText className="w-4 h-4 mr-2 text-orange-400" />;
      case 'md':
        return <FileText className="w-4 h-4 mr-2 text-purple-400" />;
      default:
        return <File className="w-4 h-4 mr-2 text-gray-400" />;
    }
  };

  const renderFileNode = (node, depth = 0) => {
    const isExpanded = expandedFolders.has(node.id);
    const paddingLeft = depth * 16 + 8;

    return (
      <div key={node.id}>
        <div
          className="flex items-center py-1 px-2 hover:bg-gray-700 cursor-pointer group"
          style={{ paddingLeft }}
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(node.id);
            } else if (node.fileData) {
              handleFileClick(node.fileData);
            }
          }}
        >
          {node.type === 'folder' && (
            <div className="w-4 h-4 mr-1">
              {isExpanded ? (
                <ChevronDown className="w-3 h-3 text-gray-400" />
              ) : (
                <ChevronRight className="w-3 h-3 text-gray-400" />
              )}
            </div>
          )}
          {node.type === 'folder' ? (
            <Folder className="w-4 h-4 mr-2 text-blue-400" />
          ) : (
            getFileIcon(node.name)
          )}
          <span className="text-sm truncate flex-1">{node.name}</span>
          
          {node.type === 'file' && node.fileData && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFileClick(node.fileData);
                }}
                className="p-1 hover:bg-gray-600 rounded"
                title="Preview file"
              >
                <Eye className="w-3 h-3 text-blue-400" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteFile(node.fileData.name);
                }}
                className="p-1 hover:bg-gray-600 rounded"
                title="Delete file"
              >
                <Trash2 className="w-3 h-3 text-red-400" />
              </button>
            </div>
          )}
        </div>
        {node.type === 'folder' && isExpanded && node.children && (
          <div>
            {node.children.map(child => renderFileNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const filteredFiles = fileStructure.filter(node => 
    node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (node.children && node.children.some(child => 
      child.name.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="p-3 border-b border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={fetchFiles}
            disabled={isLoading}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
            title="Refresh files"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              <span className="text-sm text-gray-400">Loading files...</span>
            </div>
          ) : filteredFiles.length > 0 ? (
            filteredFiles.map(node => renderFileNode(node))
          ) : (
            <div className="text-center py-4 text-gray-400 text-sm">
              {searchTerm ? 'No files found' : 'No files created yet. Ask the AI to create some files!'}
            </div>
          )}
        </div>
      </div>

      {/* File Preview Modal */}
      {showPreview && selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg w-3/4 h-3/4 flex flex-col">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold">{selectedFile.name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">
                  {selectedFile.size} characters • {new Date(selectedFile.createdAt).toLocaleString()}
                </span>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-1 hover:bg-gray-700 rounded"
                >
                  <span className="text-xl">&times;</span>
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                {selectedFile.content}
              </pre>
            </div>
          </div>
        </div>
      )}

      <div className="p-3 border-t border-gray-700">
        <button className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" />
          Ask AI to Create Files
        </button>
      </div>
    </div>
  );
});

FileExplorer.displayName = 'FileExplorer';

export default FileExplorer; 