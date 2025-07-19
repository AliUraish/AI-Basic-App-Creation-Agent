import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { OpenAI } from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
config({ path: path.resolve(__dirname, '../details.env') });

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Serve static files from the built frontend
app.use(express.static(path.join(__dirname, 'dist')));

// Initialize AI clients
const openaiClient = process.env.OPENAI_API_KEY ? new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
}) : null;

const geminiClient = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

console.log('🔑 OpenAI Client:', openaiClient ? 'Available' : 'Not Available');
console.log('🔑 Gemini Client:', geminiClient ? 'Available' : 'Not Available');

// Virtual file system - stores files in memory
const virtualFileSystem = new Map();

// Initialize with some sample files
function initializeSampleFiles() {
    virtualFileSystem.set('src/App.jsx', {
        content: `import React, { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to My React App</h1>
        <p>Count: {count}</p>
        <button onClick={() => setCount(count + 1)}>
          Increment
        </button>
        <button onClick={() => setCount(count - 1)}>
          Decrement
        </button>
      </header>
    </div>
  );
}

export default App;`,
        createdAt: new Date().toISOString(),
        size: 0
    });

    virtualFileSystem.set('src/App.css', {
        content: `.App {
  text-align: center;
}

.App-header {
  background-color: #282c34;
  padding: 20px;
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

button {
  background-color: #61dafb;
  border: none;
  padding: 10px 20px;
  margin: 5px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #21a9c7;
}`,
        createdAt: new Date().toISOString(),
        size: 0
    });

    virtualFileSystem.set('package.json', {
        content: `{
  "name": "my-react-app",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}`,
        createdAt: new Date().toISOString(),
        size: 0
    });

    // Update sizes
    virtualFileSystem.forEach((fileData, fileName) => {
        fileData.size = fileData.content.length;
    });
}

// Initialize sample files
initializeSampleFiles();

// Tool functions
function getweatherinfo(cityname) {
    return `The weather in ${cityname} is 25°C with clear skies.`;
}

function executeCommand(command) {
    console.log(`📝 Simulating command: ${command}`);
    
    if (command.includes('ls') || command.includes('dir')) {
        return 'src/  public/  package.json  README.md  node_modules/';
    } else if (command.includes('npm install')) {
        return 'Dependencies installed successfully!';
    } else if (command.includes('git')) {
        return 'Git operation completed successfully.';
    } else {
        return `Command executed: ${command}`;
    }
}

async function createFile({ fileName, content }) {
    try {
        console.log(`📁 Creating file: ${fileName}`);
        
        virtualFileSystem.set(fileName, {
            content: content,
            createdAt: new Date().toISOString(),
            size: content.length
        });
        
        console.log(`✅ File created successfully: ${fileName}`);
        return `File '${fileName}' created successfully with ${content.length} characters.`;
    } catch (error) {
        console.error(`❌ Error creating file: ${error.message}`);
        return `Error creating file: ${error.message}`;
    }
}

const TOOLS_MAP = {
    getweatherinfo: getweatherinfo,
    executeCommand: executeCommand,
    createFile: createFile
};

// Simplified system prompt that works better
const SYSTEM_PROMPT = `You are a helpful AI assistant that helps users create applications and files.

RESPONSE FORMAT: You must respond with ONLY valid JSON in one of these formats:

To think: {"step":"think","content":"your thoughts"}
To use a tool: {"step":"action","tool":"toolName","input":"inputValue"}
To give final answer: {"step":"output","content":"your response"}

AVAILABLE TOOLS:
- getweatherinfo(cityName) - gets weather for a city
- executeCommand(command) - runs a command  
- createFile({fileName, content}) - creates a file

EXAMPLES:

User asks for weather:
{"step":"think","content":"User wants weather info, I'll use getweatherinfo tool"}
Then: {"step":"action","tool":"getweatherinfo","input":"Paris"}
Then: {"step":"output","content":"The weather in Paris is 25°C with clear skies"}

User asks to create file:
{"step":"think","content":"User wants me to create a file, I'll use createFile"}
Then: {"step":"action","tool":"createFile","input":{"fileName":"hello.txt","content":"Hello World!"}}
Then: {"step":"output","content":"I created the hello.txt file successfully"}

IMPORTANT: 
- Always respond with valid JSON only
- Use proper tool input format
- For createFile, input must be an object with fileName and content
- Think first, then act if needed, then output`;

// Store conversation history
const conversations = new Map();

// Simple AI response function
async function getAIResponse(messages, model) {
    console.log(`🤖 Getting AI response using ${model}`);
    
    try {
        if (model === 'gpt4' && openaiClient) {
            console.log('🔄 Calling OpenAI API...');
            const response = await openaiClient.chat.completions.create({
                model: "gpt-4o-mini",
                messages: messages,
                temperature: 0.3,
                max_tokens: 1000
            });
            console.log('✅ OpenAI response received');
            return response.choices[0].message.content;
        } else if (model === 'gemini' && geminiClient) {
            console.log('🔄 Calling Gemini API...');
            const geminiModel = geminiClient.getGenerativeModel({ model: "gemini-pro" });
            
            const prompt = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n\n');
            const result = await geminiModel.generateContent(prompt);
            const response = await result.response;
            console.log('✅ Gemini response received');
            return response.text();
        } else {
            throw new Error(`Model ${model} is not available`);
        }
    } catch (error) {
        console.error(`❌ AI Error: ${error.message}`);
        throw error;
    }
}

app.post('/api/chat', async (req, res) => {
    try {
        console.log('💬 Received chat request');
        const { message, conversationId, model = 'gpt4' } = req.body;
        
        console.log(`📨 Message: ${message}`);
        console.log(`🆔 Conversation ID: ${conversationId}`);
        console.log(`🤖 Model: ${model}`);
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Check if selected model is available
        if (model === 'gpt4' && !openaiClient) {
            console.log('❌ OpenAI not available');
            return res.status(400).json({ error: 'OpenAI API key is not configured' });
        }
        if (model === 'gemini' && !geminiClient) {
            console.log('❌ Gemini not available');
            return res.status(400).json({ error: 'Gemini API key is not configured' });
        }

        // Get or create conversation
        if (!conversations.has(conversationId)) {
            conversations.set(conversationId, [
                { role: "system", content: SYSTEM_PROMPT }
            ]);
        }

        const messages = conversations.get(conversationId);
        messages.push({ role: 'user', content: message });

        const responseSteps = [];
        let finalOutput = '';
        let maxIterations = 8;
        let iteration = 0;

        while (iteration < maxIterations) {
            iteration++;
            console.log(`🔄 Iteration ${iteration}`);
            
            try {
                const assistantMessage = await getAIResponse(messages, model);
                console.log(`📤 AI Response: ${assistantMessage}`);
                
                messages.push({ role: "assistant", content: assistantMessage });
                
                // Try to parse JSON response
                let parsedResponse;
                try {
                    parsedResponse = JSON.parse(assistantMessage);
                } catch (parseError) {
                    console.log('📝 Non-JSON response, treating as final output');
                    finalOutput = assistantMessage;
                    responseSteps.push({
                        type: 'output',
                        content: assistantMessage
                    });
                    break;
                }

                if (parsedResponse.step === "think") {
                    console.log('🤔 Thinking step');
                    responseSteps.push({
                        type: 'thinking',
                        content: parsedResponse.content
                    });
                    continue;
                }
                
                if (parsedResponse.step === "output") {
                    console.log('📤 Output step');
                    finalOutput = parsedResponse.content;
                    responseSteps.push({
                        type: 'output',
                        content: parsedResponse.content
                    });
                    break;
                }
                
                if (parsedResponse.step === "action") {
                    console.log('⚡ Action step');
                    const tool = parsedResponse.tool;
                    const input = parsedResponse.input;
                    
                    responseSteps.push({
                        type: 'action',
                        tool: tool,
                        input: JSON.stringify(input),
                        content: `Executing ${tool}`
                    });

                    try {
                        const value = await TOOLS_MAP[tool](input);
                        console.log(`🔍 Tool result: ${value}`);
                        responseSteps.push({
                            type: 'observe',
                            content: value
                        });
                        
                        messages.push({ role: "assistant", content: JSON.stringify({ step: "observe", content: value }) });
                    } catch (toolError) {
                        console.error(`❌ Tool Error: ${toolError.message}`);
                        responseSteps.push({
                            type: 'error',
                            content: `Error executing tool: ${toolError.message}`
                        });
                        break;
                    }
                    continue;
                }
                
                // Unexpected format
                console.log('❓ Unexpected step format');
                finalOutput = assistantMessage;
                responseSteps.push({
                    type: 'output',
                    content: assistantMessage
                });
                break;
                
            } catch (error) {
                console.error(`❌ AI Error: ${error.message}`);
                responseSteps.push({
                    type: 'error',
                    content: `Error: ${error.message}`
                });
                break;
            }
        }

        if (iteration >= maxIterations) {
            console.log('⚠️ Max iterations reached');
            finalOutput = "I've completed the task. Please let me know if you need anything else!";
            responseSteps.push({
                type: 'output',
                content: finalOutput
            });
        }

        // Update conversation
        conversations.set(conversationId, messages);

        console.log(`✅ Sending response with ${responseSteps.length} steps`);
        res.json({
            steps: responseSteps,
            finalOutput: finalOutput,
            conversationId: conversationId,
            model: model
        });

    } catch (error) {
        console.error(`❌ Server Error: ${error.message}`);
        res.status(500).json({ error: `Internal server error: ${error.message}` });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'running',
        models: {
            gpt4: !!openaiClient,
            gemini: !!geminiClient
        }
    });
});

// Get all files from virtual file system
app.get('/api/files', (req, res) => {
    const files = Array.from(virtualFileSystem.entries()).map(([fileName, fileData]) => ({
        name: fileName,
        content: fileData.content,
        createdAt: fileData.createdAt,
        size: fileData.size
    }));
    res.json(files);
});

// Get specific file content
app.get('/api/files/:fileName(*)', (req, res) => {
    const fileName = req.params.fileName;
    const fileData = virtualFileSystem.get(fileName);
    
    if (fileData) {
        res.json({
            name: fileName,
            content: fileData.content,
            createdAt: fileData.createdAt,
            size: fileData.size
        });
    } else {
        res.status(404).json({ error: 'File not found' });
    }
});

// Delete file from virtual file system
app.delete('/api/files/:fileName(*)', (req, res) => {
    const fileName = req.params.fileName;
    
    if (virtualFileSystem.has(fileName)) {
        virtualFileSystem.delete(fileName);
        res.json({ message: 'File deleted successfully' });
    } else {
        res.status(404).json({ error: 'File not found' });
    }
});

// Serve React app for non-API routes
app.get('*', (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📁 Virtual files initialized: ${virtualFileSystem.size} files`);
    console.log(`🌐 Frontend served from /dist`);
}); 