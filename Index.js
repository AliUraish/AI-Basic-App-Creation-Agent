import { config } from 'dotenv';
import { OpenAI } from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'node:child_process'
import { writeFile } from 'node:fs/promises'
import express from 'express';
import cors from 'cors';

// Get current directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from details.env file
config({ path: path.resolve(__dirname, 'details.env') });

// Initialize AI clients
let openaiClient = null;
let geminiClient = null;

// Check for OpenAI API key
console.log('Checking for OpenAI API key...');
if (process.env.OPENAI_API_KEY) {
    console.log('OpenAI API Key found. Initializing OpenAI client...');
    openaiClient = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });
} else {
    console.log('OpenAI API key not found.');
}

// Check for Gemini API key
console.log('Checking for Gemini API key...');
if (process.env.GEMINI_API_KEY) {
    console.log('Gemini API Key found. Initializing Gemini client...');
    geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
} else {
    console.log('Gemini API key not found.');
}

// Ensure at least one API key is available
if (!openaiClient && !geminiClient) {
    console.error('Error: Neither OPENAI_API_KEY nor GEMINI_API_KEY is set in details.env file');
    console.error('Please add at least one API key to use the application.');
    process.exit(1);
}

// Virtual file system (in-memory storage)
const virtualFileSystem = {
    files: new Map(),
    folders: new Map()
};

// Initialize with some sample files
virtualFileSystem.files.set('sample.txt', {
    name: 'sample.txt',
    content: 'This is a sample file content.',
    type: 'file',
    path: '/sample.txt'
});

virtualFileSystem.folders.set('src', {
    name: 'src',
    type: 'folder',
    path: '/src',
    children: []
});

function getweatherinfo(args) {
    const { cityname } = args;
    return `${cityname} have 43 degree celsius`;
}

function executeCommand(args) {
    const { command } = args;
    return new Promise((resolve, reject) => { 
        exec(command, { shell: 'powershell.exe' }, function(error, stdout, stderr) {
            if (error) {
                console.error('Command error:', error);
                reject(error);
                return;
            }
            resolve(stdout || stderr || 'Command executed successfully');
        });
    });
}

async function createFile(args) {
    try {
        const { fileName, content } = args;
        // Add to virtual file system instead of writing to disk
        virtualFileSystem.files.set(fileName, {
            name: fileName,
            content: content,
            type: 'file',
            path: `/${fileName}`
        });
        return `File ${fileName} created successfully in virtual file system`;
    } catch (error) {
        return `Error creating file: ${error.message}`;
    }
}

const TOOLS_MAP = {
    getweatherinfo: getweatherinfo,
    executeCommand: executeCommand,
    createFile: createFile
}

// Function to extract code blocks and create files automatically
async function extractAndCreateFiles(response, userMessage) {
    const createdFiles = [];
    
    console.log(`🔍 Extracting files from response for message: "${userMessage}"`);
    console.log(`📝 Response content: ${response.substring(0, 200)}...`);
    
    // Look for code blocks with file extensions
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let match;
    let fileCounter = 1;
    
    while ((match = codeBlockRegex.exec(response)) !== null) {
        const language = match[1] || 'txt';
        const content = match[2].trim();
        
        console.log(`📄 Found code block: language="${language}", content length=${content.length}`);
        
        // Skip empty content
        if (!content) {
            console.log(`⚠️ Skipping empty code block`);
            continue;
        }
        
        // Determine file name based on language and user request
        let fileName = `file${fileCounter}`;
        
        // Smart file naming based on user request
        const userRequest = userMessage.toLowerCase();
        if (userRequest.includes('calculator')) {
            if (language === 'html') fileName = 'calculator.html';
            else if (language === 'css') fileName = 'calculator.css';
            else if (language === 'javascript' || language === 'js') fileName = 'calculator.js';
        } else if (userRequest.includes('todo')) {
            if (language === 'html') fileName = 'todo.html';
            else if (language === 'css') fileName = 'todo.css';
            else if (language === 'javascript' || language === 'js') fileName = 'todo.js';
        } else if (userRequest.includes('game')) {
            if (language === 'html') fileName = 'game.html';
            else if (language === 'css') fileName = 'game.css';
            else if (language === 'javascript' || language === 'js') fileName = 'game.js';
        } else {
            // Generic naming based on language
            if (language === 'html') fileName = `index.html`;
            else if (language === 'css') fileName = `styles.css`;
            else if (language === 'javascript' || language === 'js') fileName = `script.js`;
            else if (language === 'json') fileName = `data.json`;
            else if (language === 'python' || language === 'py') fileName = `app.py`;
            else if (language === 'typescript' || language === 'ts') fileName = `app.ts`;
            else fileName = `file${fileCounter}.${language}`;
        }
        
        // Create the file
        try {
            const result = await createFile({ fileName, content });
            createdFiles.push(`✅ ${fileName}: ${result}`);
            console.log(`✅ Auto-created file: ${fileName} (${content.length} characters)`);
        } catch (error) {
            createdFiles.push(`❌ ${fileName}: Error - ${error.message}`);
            console.error(`❌ Failed to create file ${fileName}:`, error);
        }
        
        fileCounter++;
    }
    
    console.log(`📊 File extraction complete: ${createdFiles.length} files processed`);
    return createdFiles;
}

const SYSTEM_PROMPT = `You are a helpful AI assistant that creates applications and code files.

When users ask for applications or websites:
1. Use the createFile function to create files directly - do NOT show code in your response
2. Create functional, well-structured applications
3. Include all necessary files (HTML, CSS, JavaScript)
4. Respond with a brief description of what you created, but do NOT include code blocks in your response

For example, if user asks for "calculator app":
- Use createFile to create calculator.html with complete HTML
- Use createFile to create calculator.css with complete CSS  
- Use createFile to create calculator.js with complete JavaScript
- Respond with: "I have created a calculator app for you! Check the file explorer to see the HTML, CSS, and JavaScript files."

IMPORTANT: Never include code blocks in your responses. Always use the createFile function instead.
Always provide helpful descriptions of what you created without showing the actual code.`;

const GEMINI_SYSTEM_PROMPT = `You are a helpful AI assistant that creates applications and code files.

When users ask for applications or websites:
1. Create functional, well-structured applications
2. Include all necessary files (HTML, CSS, JavaScript)
3. ALWAYS show your code in properly formatted code blocks with language labels
4. Use descriptive file names based on the project type

For example, if user asks for "calculator app":
- Show the HTML code in a code block with html language label
- Show the CSS code in a code block with css language label  
- Show the JavaScript code in a code block with javascript language label
- Respond with: "I have created a calculator app for you! Here are the files:"

IMPORTANT: Always include complete, functional code in properly formatted code blocks with language labels like html, css, javascript, etc.
Make sure each code block contains complete, working code that can be saved as files.`;

// Helper function to call Gemini API
async function callGeminiAPI(message, systemPrompt) {
    if (!geminiClient) {
        throw new Error('Gemini API client not available');
    }
    
    const model = geminiClient.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: systemPrompt
    });
    
    const result = await model.generateContent(message);
    const response = await result.response;
    return response.text();
}

// Helper function to call OpenAI API
async function callOpenAIAPI(message, systemPrompt, model = 'gpt-4') {
    if (!openaiClient) {
        throw new Error('OpenAI API client not available');
    }
    
    const completion = await openaiClient.chat.completions.create({
        model: model,
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        tools: [
            {
                type: "function",
                function: {
                    name: "createFile",
                    description: "Create a new file with specified content",
                    parameters: {
                        type: "object",
                        properties: {
                            fileName: {
                                type: "string",
                                description: "The name of the file to create"
                            },
                            content: {
                                type: "string",
                                description: "The content to write to the file"
                            }
                        },
                        required: ["fileName", "content"]
                    }
                }
            },
            {
                type: "function",
                function: {
                    name: "executeCommand",
                    description: "Execute a command on the user's system",
                    parameters: {
                        type: "object",
                        properties: {
                            command: {
                                type: "string",
                                description: "The command to execute"
                            }
                        },
                        required: ["command"]
                    }
                }
            },
            {
                type: "function",
                function: {
                    name: "getweatherinfo",
                    description: "Get weather information for a city",
                    parameters: {
                        type: "object",
                        properties: {
                            cityname: {
                                type: "string",
                                description: "The name of the city"
                            }
                        },
                        required: ["cityname"]
                    }
                }
            }
        ],
        tool_choice: "auto"
    });
    
    return completion;
}

// Create Express app
const app = express();
const PORT = process.env.PORT || 5174;

// Middleware
app.use(cors({
    origin: ['http://localhost:5174', 'http://127.0.0.1:5174', 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
}));
app.use(express.json());

// API Routes (MUST come before static file serving)
app.post('/api/chat', async (req, res) => {
    try {
        const { message, model = 'gpt-4' } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        console.log(`Processing message: ${message} with model: ${model}`);

                 let response = '';
         let actualModel = '';

         // Handle model selection and API calls
         if (model === 'gemini' && geminiClient) {
             console.log('Using Gemini API');
             try {
                 const fullResponse = await callGeminiAPI(message, GEMINI_SYSTEM_PROMPT);
                 actualModel = 'Gemini';
                 
                 // For Gemini, we need to extract and create files manually since it doesn't support function calling
                 const createdFiles = await extractAndCreateFiles(fullResponse, message);
                 
                 if (createdFiles.length > 0) {
                     // Create a clean response without showing the code
                     response = `I have created ${createdFiles.length} file${createdFiles.length !== 1 ? 's' : ''} for you! Check the file explorer to see the files.\n\n🚀 Files created:\n` + createdFiles.join('\n');
                 } else {
                     // If no files were created, show the original response
                     response = fullResponse;
                 }
             } catch (error) {
                 console.error('Gemini API error:', error);
                 throw error;
             }
         } else if (openaiClient) {
             console.log('Using OpenAI API');
             try {
                 const completion = await callOpenAIAPI(message, SYSTEM_PROMPT, 'gpt-4');
                 actualModel = 'GPT-4';
                 
                 const aiMessage = completion.choices[0]?.message;
                 response = aiMessage?.content || '';
                 
                 // Handle function calls for OpenAI
                 if (aiMessage?.tool_calls) {
                     const toolResults = [];
                     
                     for (const toolCall of aiMessage.tool_calls) {
                         const functionName = toolCall.function.name;
                         
                         try {
                             const functionArgs = JSON.parse(toolCall.function.arguments);
                             console.log(`Calling function: ${functionName} with args:`, functionArgs);
                             
                             if (TOOLS_MAP[functionName]) {
                                 try {
                                     const result = await TOOLS_MAP[functionName](functionArgs);
                                     toolResults.push(`✅ ${functionName}: ${result}`);
                                 } catch (error) {
                                     toolResults.push(`❌ ${functionName}: Error - ${error.message}`);
                                 }
                             }
                         } catch (jsonError) {
                             console.error(`JSON parsing error for ${functionName}:`, jsonError);
                             console.error(`Raw arguments:`, toolCall.function.arguments);
                             toolResults.push(`❌ ${functionName}: JSON parsing error - ${jsonError.message}`);
                         }
                     }
                     
                     // If there were tool calls, append the results to the response
                     if (toolResults.length > 0) {
                         response += '\n\n' + toolResults.join('\n');
                     }
                 }
                 
                 // FALLBACK: If AI mentions creating files but didn't use function calls, extract and create them
                 if (!aiMessage?.tool_calls && (message.toLowerCase().includes('create') || message.toLowerCase().includes('app'))) {
                     const createdFiles = await extractAndCreateFiles(response, message);
                     if (createdFiles.length > 0) {
                         response += '\n\n🚀 Files created:\n' + createdFiles.join('\n');
                     }
                 }
             } catch (error) {
                 console.error('OpenAI API error:', error);
                 throw error;
             }
         } else {
             return res.status(503).json({ error: 'No available AI model client. Please check your API keys.' });
         }
        
        if (!response) {
            response = 'No response from AI';
        }
        
        console.log(`AI Response: ${response}`);
        
        res.json({ 
            response,
            model: actualModel,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error processing chat request:', error);
        
        // Send a proper error response
        res.status(500).json({ 
            error: 'Failed to process request',
            details: error.message,
            response: 'Sorry, I encountered an error while processing your request. Please try again.'
        });
    }
});

// Get virtual file system
app.get('/api/files', (req, res) => {
    try {
        const files = Array.from(virtualFileSystem.files.values());
        const folders = Array.from(virtualFileSystem.folders.values());
        
        res.json({
            files,
            folders,
            totalFiles: files.length,
            totalFolders: folders.length
        });
    } catch (error) {
        console.error('Error getting files:', error);
        res.status(500).json({ error: 'Failed to get files' });
    }
});

// Delete file from virtual file system - using specific route handler
app.delete('/api/files/delete', (req, res) => {
    try {
        const { fileName } = req.body;
        
        if (!fileName) {
            return res.status(400).json({ error: 'fileName is required' });
        }
        
        if (virtualFileSystem.files.has(fileName)) {
            virtualFileSystem.files.delete(fileName);
            res.json({ message: 'File deleted successfully' });
        } else {
            res.status(404).json({ error: 'File not found' });
        }
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ error: 'Failed to delete file' });
    }
});

// Get file content for preview
app.get('/api/files/:fileName/content', (req, res) => {
    try {
        const fileName = decodeURIComponent(req.params.fileName);
        console.log(`🔍 Requesting file content for: "${fileName}"`);
        console.log(`📁 Available files:`, Array.from(virtualFileSystem.files.keys()));
        
        const file = virtualFileSystem.files.get(fileName);
        
        if (file) {
            console.log(`✅ File found: ${fileName}`);
            res.json({
                name: file.name,
                content: file.content,
                type: file.type,
                path: file.path
            });
        } else {
            console.log(`❌ File not found: "${fileName}"`);
            console.log(`📝 Available files: ${Array.from(virtualFileSystem.files.keys()).join(', ')}`);
            res.status(404).json({ 
                error: 'File not found',
                requested: fileName,
                available: Array.from(virtualFileSystem.files.keys())
            });
        }
    } catch (error) {
        console.error('Error getting file content:', error);
        res.status(500).json({ error: 'Failed to get file content' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        message: 'Backend server is running',
        filesCount: virtualFileSystem.files.size
    });
});

// Serve static files from my-vue-app frontend (AFTER API routes)
app.use(express.static(path.join(__dirname, 'my-vue-app/dist')));

// Catch-all handler for SPA routing
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'my-vue-app/dist/index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📁 Virtual file system initialized with ${virtualFileSystem.files.size} files`);
    console.log(`🤖 AI models ready for processing`);
    console.log(`🌐 Frontend served from /my-vue-app/dist`);
    console.log(`📡 API endpoints available at /api/*`);
});

// Export functions for use in web interface
export { TOOLS_MAP, SYSTEM_PROMPT, openaiClient, geminiClient, virtualFileSystem };