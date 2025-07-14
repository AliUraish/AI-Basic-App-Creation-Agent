import React, { useState } from 'react';
import { MessageSquare, Clock, Search, Trash2 } from 'lucide-react';

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

const ChatHistory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sessions] = useState<ChatSession[]>([
    {
      id: '1',
      title: 'React Component Design',
      lastMessage: 'Create a modern dashboard with charts...',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      messageCount: 12
    },
    {
      id: '2',
      title: 'API Integration Help',
      lastMessage: 'How to handle authentication with JWT...',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      messageCount: 8
    },
    {
      id: '3',
      title: 'Database Schema Design',
      lastMessage: 'Design a user management system...',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      messageCount: 15
    },
    {
      id: '4',
      title: 'CSS Animation Tutorial',
      lastMessage: 'Create smooth transitions for mobile...',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      messageCount: 6
    }
  ]);

  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Search */}
      <div className="p-3 border-b border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-2 space-y-1">
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              className="p-3 rounded-lg hover:bg-gray-700 cursor-pointer group transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-sm truncate pr-2">{session.title}</h3>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1 hover:bg-gray-600 rounded">
                    <Trash2 className="w-3 h-3 text-red-400" />
                  </button>
                </div>
              </div>
              
              <p className="text-xs text-gray-400 mb-2 line-clamp-2">
                {session.lastMessage}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatTimestamp(session.timestamp)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  <span>{session.messageCount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="p-3 border-t border-gray-700">
        <button className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-purple-600 hover:bg-purple-700 rounded-md text-sm font-medium transition-colors">
          <MessageSquare className="w-4 h-4" />
          New Chat
        </button>
      </div>
    </div>
  );
};

export default ChatHistory;