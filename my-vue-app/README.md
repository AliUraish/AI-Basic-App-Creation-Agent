# AI Assistant App

A modern AI-powered application builder with a beautiful chat interface. This app allows you to create applications by simply describing what you want in natural language. Supports both OpenAI GPT-4 and Google Gemini models.

## Features

- 🤖 **AI-Powered App Creation**: Describe your app idea and watch the AI build it for you
- 🧠 **Dual AI Models**: Choose between OpenAI GPT-4 and Google Gemini
- 💬 **Real-time Chat Interface**: Interactive chat with thinking process visualization
- 📁 **Virtual File System**: Files are created and stored in memory, not on disk
- 👁️ **File Preview**: Click any file to preview its contents in a beautiful modal
- 📚 **Chat History**: Keep track of all your conversations and app creation sessions
- 🎨 **Modern UI**: Beautiful dark theme with smooth animations
- ⚡ **Real-time Updates**: See files being created as the AI works

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- OpenAI API key (for GPT-4)
- Google AI API key (for Gemini)

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd my-vue-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up your API keys:**
   - Copy `details.env.example` to `details.env` in the parent directory (same level as `my-vue-app`)
   - Add your actual API keys to `details.env`:
     ```
     OPENAI_API_KEY=your_openai_api_key_here
     GEMINI_API_KEY=your_gemini_api_key_here
     ```
   
   **Note:** You can use either one or both API keys. The app will automatically detect which models are available.
   
   **Security:** The `details.env` file is automatically ignored by Git to protect your API keys.

4. **Start the development server:**
   ```bash
   npm run dev:full
   ```
   
   This will start both the frontend (Vite dev server) and backend (Express server) simultaneously.

5. **Open your browser:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## How to Use

### Creating Apps with AI

1. **Open the chat interface** in the main area
2. **Choose your AI model** (GPT-4 or Gemini) using the model selector
3. **Describe your app idea** in natural language. For example:
   - "Create a todo app with React"
   - "Build a weather dashboard with charts"
   - "Make a simple calculator app"
   - "Create a blog with user authentication"

4. **Watch the AI work:**
   - 🤔 **Thinking**: The AI analyzes your request
   - ⚒️ **Action**: The AI executes tools to create files
   - 📊 **Observe**: See the results of each action
   - 💬 **Output**: Get the final result and next steps

### Virtual File System

The app uses a **virtual file system** that stores files in memory:

- **No Disk Files**: Files are not created on your local system
- **Safe Environment**: Experiment freely without cluttering your directory
- **Real-time Updates**: Files appear instantly as the AI creates them
- **File Preview**: Click any file to see its contents in a beautiful modal
- **File Management**: Delete files you don't need

### File Explorer Features

- **📁 Tree View**: Navigate through folders and files
- **🔍 Search**: Quickly find specific files
- **👁️ Preview**: Click any file to see its contents
- **🗑️ Delete**: Remove files you don't need
- **🔄 Refresh**: Update the file list manually
- **📊 File Info**: See file size and creation time

### AI Models

The app supports two powerful AI models:

#### OpenAI GPT-4
- **Best for**: Complex reasoning, detailed code generation
- **Setup**: Get API key from [OpenAI Platform](https://platform.openai.com/)
- **Cost**: Pay-per-use pricing

#### Google Gemini
- **Best for**: Creative tasks, multimodal understanding
- **Setup**: Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- **Cost**: Generous free tier available

### Available Tools

The AI can use these tools to build your applications:

- **`createFile`**: Creates new files in the virtual file system
- **`executeCommand`**: Simulates terminal commands (npm install, git, etc.)
- **`getweatherinfo`**: Gets weather information (example tool)

### Chat History

- **View conversations**: See all your previous app creation sessions
- **Search history**: Find specific conversations
- **Message count**: See how many messages in each conversation

## Project Structure

```
my-vue-app/
├── src/
│   ├── components/
│   │   ├── ChatInterface.jsx    # Main chat interface
│   │   ├── FileExplorer.jsx     # Virtual file tree viewer
│   │   └── ChatHistory.jsx      # Conversation history
│   ├── App.jsx                  # Main app layout
│   └── main.jsx                 # App entry point
├── server.js                    # Backend API server with virtual file system
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## Development

### Available Scripts

- `npm run dev` - Start frontend only
- `npm run server` - Start backend only
- `npm run dev:full` - Start both frontend and backend
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Customization

You can customize the AI behavior by modifying:

1. **System Prompt** in `server.js` - Change how the AI thinks and responds
2. **Available Tools** in `server.js` - Add new tools for the AI to use
3. **UI Components** in `src/components/` - Modify the interface design
4. **Styling** in `src/index.css` - Update colors and themes

## Examples

### Example Prompts

Here are some example prompts you can try:

1. **Simple App:**
   ```
   Create a simple counter app with React that has increment and decrement buttons
   ```

2. **Todo App:**
   ```
   Build a todo app with add, delete, and mark as complete functionality
   ```

3. **Weather App:**
   ```
   Create a weather app that shows current weather and 5-day forecast
   ```

4. **Calculator:**
   ```
   Make a calculator with basic arithmetic operations and a clean UI
   ```

## API Key Setup

### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Add it to your `details.env` file

### Google Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key
5. Add it to your `details.env` file

## Troubleshooting

### Common Issues

1. **API Key Errors:**
   - Make sure `details.env` exists in the parent directory
   - Verify your API keys are valid and have credits
   - Check that the keys are properly formatted

2. **Model Not Available:**
   - The app will show which models are available on startup
   - If a model is grayed out, check your API key configuration
   - You can still use the app with just one model configured

3. **Server Connection Error:**
   - Ensure the backend server is running on port 3001
   - Check that CORS is properly configured

4. **File Not Appearing:**
   - Click the refresh button in the file explorer
   - Check that the AI successfully created the file
   - Files are stored in memory, so they persist until the server restarts

### Getting Help

If you encounter any issues:

1. Check the browser console for frontend errors
2. Check the terminal for backend errors
3. Verify your API keys and credits
4. Make sure all dependencies are installed
5. Check the server startup logs for model availability

## Contributing

Feel free to contribute to this project by:

1. Adding new AI tools
2. Improving the UI/UX
3. Adding new features
4. Fixing bugs
5. Improving documentation

## License

This project is open source and available under the MIT License.
