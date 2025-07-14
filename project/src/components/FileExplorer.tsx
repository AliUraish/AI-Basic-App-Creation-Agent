import React, { useState } from 'react';
import { Folder, File, Plus, Search, ChevronRight, ChevronDown } from 'lucide-react';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
}

const FileExplorer: React.FC = () => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src']));
  const [searchTerm, setSearchTerm] = useState('');

  const fileStructure: FileNode[] = [
    {
      id: 'src',
      name: 'src',
      type: 'folder',
      children: [
        { id: 'app', name: 'App.tsx', type: 'file' },
        { id: 'main', name: 'main.tsx', type: 'file' },
        {
          id: 'components',
          name: 'components',
          type: 'folder',
          children: [
            { id: 'chat', name: 'ChatInterface.tsx', type: 'file' },
            { id: 'file-exp', name: 'FileExplorer.tsx', type: 'file' },
          ]
        }
      ]
    },
    { id: 'package', name: 'package.json', type: 'file' },
    { id: 'readme', name: 'README.md', type: 'file' }
  ];

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFileNode = (node: FileNode, depth: number = 0) => {
    const isExpanded = expandedFolders.has(node.id);
    const paddingLeft = depth * 16 + 8;

    return (
      <div key={node.id}>
        <div
          className="flex items-center py-1 px-2 hover:bg-gray-700 cursor-pointer group"
          style={{ paddingLeft }}
          onClick={() => node.type === 'folder' && toggleFolder(node.id)}
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
            <File className="w-4 h-4 mr-2 text-gray-400" />
          )}
          <span className="text-sm truncate">{node.name}</span>
        </div>
        {node.type === 'folder' && isExpanded && node.children && (
          <div>
            {node.children.map(child => renderFileNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
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
          {fileStructure.map(node => renderFileNode(node))}
        </div>
      </div>

      <div className="p-3 border-t border-gray-700">
        <button className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" />
          New File
        </button>
      </div>
    </div>
  );
};

export default FileExplorer;