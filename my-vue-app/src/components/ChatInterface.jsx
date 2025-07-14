import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Edit2, Copy, RotateCcw, Loader2 } from 'lucide-react';

const ChatInterface = ({ onFilesUpdated }) => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      content: 'Hello! I\'m your AI assistant. I can help you create applications, write code, or assist with any development tasks. What would you like to create today?',
      sender: 'ai',
      timestamp: new Date(),
      aiModel: 'gpt4'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt4');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(Date.now().toString());
  const [availableModels, setAvailableModels] = useState({ gpt4: true, gemini: true });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check available models on component mount
  useEffect(() => {
    const checkModels = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/health');
        if (response.ok) {
          const data = await response.json();
          setAvailableModels(data.models);
          
          // If current model is not available, switch to available one
          if (!data.models[selectedModel]) {
            if (data.models.gpt4) {
              setSelectedModel('gpt4');
            } else if (data.models.gemini) {
              setSelectedModel('gemini');
            }
          }
        }
      } catch (error) {
        console.error('Error checking available models:', error);
      }
    };
    
    checkModels();
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          conversationId: conversationId,
          model: selectedModel
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response from AI');
      }

      const data = await response.json();
      
      // Add thinking steps as separate messages
      const thinkingSteps = data.steps.filter(step => step.type === 'thinking');
      const actionSteps = data.steps.filter(step => step.type === 'action');
      const observeSteps = data.steps.filter(step => step.type === 'observe');

      // Add thinking messages
      thinkingSteps.forEach((step, index) => {
        const thinkingMessage = {
          id: `thinking-${Date.now()}-${index}`,
          content: `🤔 ${step.content}`,
          sender: 'ai',
          timestamp: new Date(),
          aiModel: selectedModel,
          type: 'thinking'
        };
        setMessages(prev => [...prev, thinkingMessage]);
      });

      // Add action messages
      actionSteps.forEach((step, index) => {
        const actionMessage = {
          id: `action-${Date.now()}-${index}`,
          content: `⚒️ ${step.content}`,
          sender: 'ai',
          timestamp: new Date(),
          aiModel: selectedModel,
          type: 'action'
        };
        setMessages(prev => [...prev, actionMessage]);
      });

      // Add observe messages
      observeSteps.forEach((step, index) => {
        const observeMessage = {
          id: `observe-${Date.now()}-${index}`,
          content: `📊 ${step.content}`,
          sender: 'ai',
          timestamp: new Date(),
          aiModel: selectedModel,
          type: 'observe'
        };
        setMessages(prev => [...prev, observeMessage]);
      });

      // Add final output message
      if (data.finalOutput) {
        const aiResponse = {
          id: (Date.now() + 1).toString(),
          content: data.finalOutput,
          sender: 'ai',
          timestamp: new Date(),
          aiModel: selectedModel
        };
        setMessages(prev => [...prev, aiResponse]);
      }

      // Check if any files were created and refresh file explorer
      const fileCreationSteps = actionSteps.filter(step => step.tool === 'createFile');
      if (fileCreationSteps.length > 0 && onFilesUpdated) {
        onFilesUpdated();
      }

    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        content: `Sorry, I encountered an error: ${error.message}`,
        sender: 'ai',
        timestamp: new Date(),
        aiModel: selectedModel,
        type: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMessageStyle = (message) => {
    if (message.type === 'thinking') {
      return 'bg-yellow-600/20 text-yellow-200 border border-yellow-600/30';
    }
    if (message.type === 'action') {
      return 'bg-blue-600/20 text-blue-200 border border-blue-600/30';
    }
    if (message.type === 'observe') {
      return 'bg-green-600/20 text-green-200 border border-green-600/30';
    }
    if (message.type === 'error') {
      return 'bg-red-600/20 text-red-200 border border-red-600/30';
    }
    return message.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-100';
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            
            <div className={`max-w-2xl ${message.sender === 'user' ? 'order-1' : ''}`}>
              <div
                className={`p-3 rounded-lg ${getMessageStyle(message)}`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
              
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                <span>{message.timestamp.toLocaleTimeString()}</span>
                {message.aiModel && (
                  <span className={`px-2 py-1 rounded text-xs ${
                    message.aiModel === 'gpt4' ? 'bg-blue-600' : 'bg-purple-600'
                  }`}>
                    {message.aiModel.toUpperCase()}
                  </span>
                )}
                {message.type && (
                  <span className="px-2 py-1 bg-gray-600 rounded text-xs capitalize">
                    {message.type}
                  </span>
                )}
                <button className="hover:text-gray-300">
                  <Copy className="w-3 h-3" />
                </button>
                {message.sender === 'user' && (
                  <button className="hover:text-gray-300">
                    <Edit2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {message.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            </div>
            <div className="bg-gray-700 p-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-700 p-4">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-sm text-gray-400">AI Model:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedModel('gpt4')}
              disabled={!availableModels.gpt4}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                selectedModel === 'gpt4'
                  ? 'bg-blue-600 text-white'
                  : availableModels.gpt4
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
              title={!availableModels.gpt4 ? 'OpenAI API key not configured' : ''}
            >
              GPT-4
            </button>
            <button
              onClick={() => setSelectedModel('gemini')}
              disabled={!availableModels.gemini}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                selectedModel === 'gemini'
                  ? 'bg-purple-600 text-white'
                  : availableModels.gemini
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
              title={!availableModels.gemini ? 'Gemini API key not configured' : ''}
            >
              Gemini
            </button>
          </div>
          {(!availableModels.gpt4 || !availableModels.gemini) && (
            <span className="text-xs text-yellow-400">
              {!availableModels.gpt4 && !availableModels.gemini 
                ? 'No AI models configured' 
                : 'Some models unavailable'}
            </span>
          )}
        </div>
        
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe the app you want to create, or ask for help with development tasks..."
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              rows={3}
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface; 