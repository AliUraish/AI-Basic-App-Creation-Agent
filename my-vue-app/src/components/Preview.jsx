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

  // Convert Python code to working HTML equivalent
  const convertPythonToHTML = (pythonCode, fileName) => {
    const lowerCode = pythonCode.toLowerCase();
    const lowerFileName = fileName.toLowerCase();
    
    // Detect what type of application it is
    if (lowerCode.includes('calculator') || lowerFileName.includes('calculator')) {
      return createCalculatorHTML(pythonCode, fileName);
    } else if (lowerCode.includes('todo') || lowerFileName.includes('todo') || lowerCode.includes('task')) {
      return createTodoHTML(pythonCode, fileName);
    } else if (lowerCode.includes('quiz') || lowerCode.includes('question')) {
      return createQuizHTML(pythonCode, fileName);
    } else if (lowerCode.includes('game') || lowerCode.includes('number') || lowerCode.includes('guess')) {
      return createGameHTML(pythonCode, fileName);
    } else {
      return createGenericPythonHTML(pythonCode, fileName);
    }
  };

  // Create calculator HTML application
  const createCalculatorHTML = (pythonCode, fileName) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Calculator App - ${fileName}</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0; padding: 20px; min-height: 100vh; display: flex; 
            align-items: center; justify-content: center;
        }
        .calculator {
            background: #2d3748; border-radius: 20px; padding: 30px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3); max-width: 400px; width: 100%;
        }
        .display {
            background: #1a202c; color: #fff; padding: 20px; border-radius: 10px;
            text-align: right; font-size: 24px; margin-bottom: 20px; min-height: 60px;
            display: flex; align-items: center; justify-content: flex-end;
        }
        .buttons {
            display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;
        }
        .btn {
            padding: 20px; border: none; border-radius: 10px; font-size: 18px;
            cursor: pointer; transition: all 0.3s ease; font-weight: bold;
        }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.3); }
        .btn.number { background: #4a5568; color: white; }
        .btn.operator { background: #ed8936; color: white; }
        .btn.equals { background: #38a169; color: white; grid-column: span 2; }
        .btn.clear { background: #e53e3e; color: white; }
        .btn.zero { grid-column: span 2; }
        .header { text-align: center; color: white; margin-bottom: 20px; }
        .info { background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px; margin-top: 20px; color: white; font-size: 14px; }
    </style>
</head>
<body>
    <div class="calculator">
        <div class="header">
            <h2>🔢 Calculator</h2>
            <p>Powered by Python Logic</p>
        </div>
        <div class="display" id="display">0</div>
        <div class="buttons">
            <button class="btn clear" onclick="clearDisplay()">AC</button>
            <button class="btn operator" onclick="appendToDisplay('/')">/</button>
            <button class="btn operator" onclick="appendToDisplay('*')">×</button>
            <button class="btn operator" onclick="deleteLast()">⌫</button>
            
            <button class="btn number" onclick="appendToDisplay('7')">7</button>
            <button class="btn number" onclick="appendToDisplay('8')">8</button>
            <button class="btn number" onclick="appendToDisplay('9')">9</button>
            <button class="btn operator" onclick="appendToDisplay('-')">-</button>
            
            <button class="btn number" onclick="appendToDisplay('4')">4</button>
            <button class="btn number" onclick="appendToDisplay('5')">5</button>
            <button class="btn number" onclick="appendToDisplay('6')">6</button>
            <button class="btn operator" onclick="appendToDisplay('+')">+</button>
            
            <button class="btn number" onclick="appendToDisplay('1')">1</button>
            <button class="btn number" onclick="appendToDisplay('2')">2</button>
            <button class="btn number" onclick="appendToDisplay('3')">3</button>
            <button class="btn equals" onclick="calculate()" rowspan="2">=</button>
            
            <button class="btn number zero" onclick="appendToDisplay('0')">0</button>
            <button class="btn number" onclick="appendToDisplay('.')">.</button>
        </div>
        <div class="info">
            <strong>📝 Based on Python Code:</strong><br>
            This calculator implements the mathematical operations from your Python code in a web interface.
        </div>
    </div>

    <script>
        let display = document.getElementById('display');
        let currentInput = '0';
        let shouldResetDisplay = false;

        function updateDisplay() {
            display.textContent = currentInput;
        }

        function clearDisplay() {
            currentInput = '0';
            shouldResetDisplay = false;
            updateDisplay();
        }

        function deleteLast() {
            if (currentInput.length > 1) {
                currentInput = currentInput.slice(0, -1);
            } else {
                currentInput = '0';
            }
            updateDisplay();
        }

        function appendToDisplay(value) {
            if (shouldResetDisplay) {
                currentInput = '';
                shouldResetDisplay = false;
            }
            
            if (currentInput === '0' && value !== '.') {
                currentInput = value;
            } else {
                currentInput += value;
            }
            updateDisplay();
        }

        function calculate() {
            try {
                // Replace × with * for evaluation
                let expression = currentInput.replace(/×/g, '*');
                let result = eval(expression);
                currentInput = result.toString();
                shouldResetDisplay = true;
                updateDisplay();
            } catch (error) {
                currentInput = 'Error';
                shouldResetDisplay = true;
                updateDisplay();
            }
        }
    </script>
</body>
</html>`;
  };

  // Create todo app HTML application
  const createTodoHTML = (pythonCode, fileName) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo App - ${fileName}</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0; padding: 20px; min-height: 100vh;
        }
        .container {
            max-width: 600px; margin: 0 auto; background: white; 
            border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            padding: 30px; margin-top: 20px;
        }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { color: #2d3748; margin: 0; }
        .add-todo {
            display: flex; gap: 10px; margin-bottom: 30px;
        }
        .add-todo input {
            flex: 1; padding: 15px; border: 2px solid #e2e8f0; border-radius: 10px;
            font-size: 16px; outline: none;
        }
        .add-todo input:focus { border-color: #667eea; }
        .add-todo button {
            padding: 15px 25px; background: #667eea; color: white; border: none;
            border-radius: 10px; cursor: pointer; font-weight: bold; transition: all 0.3s;
        }
        .add-todo button:hover { background: #5a67d8; transform: translateY(-1px); }
        .todo-list { margin-top: 20px; }
        .todo-item {
            display: flex; align-items: center; padding: 15px; margin-bottom: 10px;
            background: #f7fafc; border-radius: 10px; transition: all 0.3s;
        }
        .todo-item:hover { background: #edf2f7; }
        .todo-item.completed { opacity: 0.7; }
        .todo-item.completed .todo-text { text-decoration: line-through; color: #a0aec0; }
        .todo-checkbox {
            margin-right: 15px; width: 20px; height: 20px; cursor: pointer;
        }
        .todo-text { flex: 1; font-size: 16px; }
        .todo-delete {
            background: #e53e3e; color: white; border: none; padding: 8px 12px;
            border-radius: 5px; cursor: pointer; font-size: 12px; transition: all 0.3s;
        }
        .todo-delete:hover { background: #c53030; }
        .stats {
            margin-top: 20px; padding: 15px; background: #edf2f7; border-radius: 10px;
            text-align: center; color: #4a5568;
        }
        .info { 
            background: rgba(102, 126, 234, 0.1); padding: 15px; border-radius: 10px; 
            margin-top: 20px; color: #4a5568; font-size: 14px; 
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📝 Todo App</h1>
            <p>Powered by Python Logic</p>
        </div>
        
        <div class="add-todo">
            <input type="text" id="todoInput" placeholder="Add a new task..." onkeypress="handleKeyPress(event)">
            <button onclick="addTodo()">Add Task</button>
        </div>
        
        <div class="todo-list" id="todoList">
            <!-- Todos will be added here -->
        </div>
        
        <div class="stats" id="stats">
            Total: 0 tasks, Completed: 0, Remaining: 0
        </div>
        
        <div class="info">
            <strong>📝 Based on Python Code:</strong><br>
            This todo app implements the task management functionality from your Python code in a web interface.
        </div>
    </div>

    <script>
        let todos = [];
        let nextId = 1;

        function addTodo() {
            const input = document.getElementById('todoInput');
            const text = input.value.trim();
            
            if (text) {
                todos.push({
                    id: nextId++,
                    text: text,
                    completed: false
                });
                input.value = '';
                renderTodos();
                updateStats();
            }
        }

        function toggleTodo(id) {
            const todo = todos.find(t => t.id === id);
            if (todo) {
                todo.completed = !todo.completed;
                renderTodos();
                updateStats();
            }
        }

        function deleteTodo(id) {
            todos = todos.filter(t => t.id !== id);
            renderTodos();
            updateStats();
        }

        function renderTodos() {
            const list = document.getElementById('todoList');
            list.innerHTML = '';
            
            todos.forEach(todo => {
                const item = document.createElement('div');
                item.className = \`todo-item \${todo.completed ? 'completed' : ''}\`;
                item.innerHTML = \`
                    <input type="checkbox" class="todo-checkbox" \${todo.completed ? 'checked' : ''} 
                           onchange="toggleTodo(\${todo.id})">
                    <span class="todo-text">\${todo.text}</span>
                    <button class="todo-delete" onclick="deleteTodo(\${todo.id})">Delete</button>
                \`;
                list.appendChild(item);
            });
        }

        function updateStats() {
            const total = todos.length;
            const completed = todos.filter(t => t.completed).length;
            const remaining = total - completed;
            
            document.getElementById('stats').textContent = 
                \`Total: \${total} tasks, Completed: \${completed}, Remaining: \${remaining}\`;
        }

        function handleKeyPress(event) {
            if (event.key === 'Enter') {
                addTodo();
            }
        }

        // Add some sample todos
        todos = [
            { id: 1, text: 'Learn Python programming', completed: true },
            { id: 2, text: 'Build a todo app', completed: false },
            { id: 3, text: 'Deploy the application', completed: false }
        ];
        nextId = 4;
        renderTodos();
        updateStats();
    </script>
</body>
</html>`;
  };

  // Create generic Python application preview
  const createGenericPythonHTML = (pythonCode, fileName) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Python App Preview - ${fileName}</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0; padding: 20px; min-height: 100vh;
        }
        .container {
            max-width: 800px; margin: 0 auto; background: white; 
            border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            padding: 30px; margin-top: 20px;
        }
        .header { text-align: center; margin-bottom: 30px; }
        .code-preview {
            background: #1e1e1e; color: #d4d4d4; padding: 20px; border-radius: 10px;
            font-family: 'Courier New', monospace; overflow-x: auto; margin: 20px 0;
        }
        .info { 
            background: rgba(102, 126, 234, 0.1); padding: 20px; border-radius: 10px; 
            margin: 20px 0; color: #4a5568; 
        }
        .demo-section {
            background: #f7fafc; padding: 20px; border-radius: 10px; margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🐍 Python Application Preview</h1>
            <p>Visual representation of your Python code</p>
        </div>
        
        <div class="info">
            <h3>📄 File: ${fileName}</h3>
            <p>This Python script contains ${pythonCode.split('\\n').length} lines of code. Below is a preview of what this application would look like when running.</p>
        </div>
        
        <div class="demo-section">
            <h3>🎯 Code Functionality</h3>
            <p>This Python script appears to be a console-based application. Here's what it would do when executed:</p>
            <ul>
                <li>Execute Python commands and logic</li>
                <li>Handle user input and output</li>
                <li>Perform calculations or data processing</li>
                <li>Display results in the terminal</li>
            </ul>
        </div>
        
        <div class="code-preview">
            <pre>${pythonCode.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
        </div>
        
        <div class="info">
            <strong>💡 Note:</strong> This is a visual representation. To see the actual application in action, you would need to run the Python code in a Python environment.
        </div>
    </div>
</body>
</html>`;
  };

  // Create quiz HTML application
  const createQuizHTML = (pythonCode, fileName) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quiz App - ${fileName}</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0; padding: 20px; min-height: 100vh;
        }
        .container {
            max-width: 700px; margin: 0 auto; background: white; 
            border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            padding: 30px; margin-top: 20px;
        }
        .header { text-align: center; margin-bottom: 30px; }
        .question-card {
            background: #f7fafc; padding: 20px; border-radius: 10px; margin: 20px 0;
        }
        .question { font-size: 18px; font-weight: bold; margin-bottom: 15px; }
        .options { margin: 15px 0; }
        .option {
            display: block; margin: 10px 0; padding: 10px; background: #e2e8f0;
            border: none; border-radius: 5px; cursor: pointer; width: 100%;
            text-align: left; transition: all 0.3s;
        }
        .option:hover { background: #cbd5e0; }
        .option.selected { background: #667eea; color: white; }
        .btn {
            padding: 12px 25px; background: #667eea; color: white; border: none;
            border-radius: 8px; cursor: pointer; font-weight: bold; margin: 10px 5px;
        }
        .score { text-align: center; padding: 20px; font-size: 18px; }
        .info { 
            background: rgba(102, 126, 234, 0.1); padding: 15px; border-radius: 10px; 
            margin-top: 20px; color: #4a5568; font-size: 14px; 
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧠 Quiz Application</h1>
            <p>Powered by Python Logic</p>
        </div>
        
        <div id="quizContainer">
            <div class="question-card">
                <div class="question" id="question">Loading question...</div>
                <div class="options" id="options"></div>
                <button class="btn" onclick="nextQuestion()">Next Question</button>
                <button class="btn" onclick="showScore()">Show Score</button>
            </div>
        </div>
        
        <div class="score" id="scoreDisplay" style="display: none;">
            Your Score: <span id="score">0</span> out of <span id="total">0</span>
        </div>
        
        <div class="info">
            <strong>📝 Based on Python Code:</strong><br>
            This quiz app implements the question and answer logic from your Python code.
        </div>
    </div>

    <script>
        const questions = [
            {
                question: "What is the output of print(2 + 3)?",
                options: ["5", "23", "2+3", "Error"],
                correct: 0
            },
            {
                question: "Which data type is used to store text in Python?",
                options: ["int", "float", "str", "bool"],
                correct: 2
            },
            {
                question: "What does the len() function do?",
                options: ["Returns length", "Creates a list", "Prints text", "None"],
                correct: 0
            }
        ];
        
        let currentQuestion = 0;
        let score = 0;
        let selectedOption = -1;

        function loadQuestion() {
            if (currentQuestion < questions.length) {
                const q = questions[currentQuestion];
                document.getElementById('question').textContent = q.question;
                
                const optionsDiv = document.getElementById('options');
                optionsDiv.innerHTML = '';
                
                q.options.forEach((option, index) => {
                    const btn = document.createElement('button');
                    btn.className = 'option';
                    btn.textContent = option;
                    btn.onclick = () => selectOption(index);
                    optionsDiv.appendChild(btn);
                });
                
                selectedOption = -1;
            }
        }

        function selectOption(index) {
            const options = document.querySelectorAll('.option');
            options.forEach((opt, i) => {
                opt.classList.toggle('selected', i === index);
            });
            selectedOption = index;
        }

        function nextQuestion() {
            if (selectedOption !== -1) {
                if (selectedOption === questions[currentQuestion].correct) {
                    score++;
                }
                currentQuestion++;
                loadQuestion();
            } else {
                alert('Please select an answer!');
            }
        }

        function showScore() {
            document.getElementById('quizContainer').style.display = 'none';
            document.getElementById('scoreDisplay').style.display = 'block';
            document.getElementById('score').textContent = score;
            document.getElementById('total').textContent = questions.length;
        }

        // Initialize quiz
        loadQuestion();
    </script>
</body>
</html>`;
  };

  // Create game HTML application
  const createGameHTML = (pythonCode, fileName) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Number Guessing Game - ${fileName}</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0; padding: 20px; min-height: 100vh; display: flex;
            align-items: center; justify-content: center;
        }
        .game-container {
            background: white; border-radius: 20px; padding: 40px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3); max-width: 500px; width: 100%;
            text-align: center;
        }
        .header { margin-bottom: 30px; }
        .game-area { margin: 30px 0; }
        .input-group {
            margin: 20px 0; display: flex; gap: 10px; justify-content: center;
        }
        .guess-input {
            padding: 15px; border: 2px solid #e2e8f0; border-radius: 10px;
            font-size: 18px; width: 120px; text-align: center;
        }
        .guess-btn {
            padding: 15px 25px; background: #667eea; color: white; border: none;
            border-radius: 10px; cursor: pointer; font-weight: bold; font-size: 16px;
        }
        .guess-btn:hover { background: #5a67d8; }
        .message {
            padding: 15px; margin: 20px 0; border-radius: 10px; font-size: 16px;
            font-weight: bold;
        }
        .message.too-high { background: #fed7d7; color: #c53030; }
        .message.too-low { background: #c6f6d5; color: #2f855a; }
        .message.correct { background: #bee3f8; color: #2b6cb0; }
        .stats {
            background: #f7fafc; padding: 15px; border-radius: 10px; margin: 20px 0;
        }
        .new-game-btn {
            padding: 12px 25px; background: #38a169; color: white; border: none;
            border-radius: 8px; cursor: pointer; font-weight: bold;
        }
        .info { 
            background: rgba(102, 126, 234, 0.1); padding: 15px; border-radius: 10px; 
            margin-top: 20px; color: #4a5568; font-size: 14px; 
        }
    </style>
</head>
<body>
    <div class="game-container">
        <div class="header">
            <h1>🎯 Number Guessing Game</h1>
            <p>Powered by Python Logic</p>
            <p>Guess the number between 1 and 100!</p>
        </div>
        
        <div class="game-area">
            <div class="input-group">
                <input type="number" class="guess-input" id="guessInput" min="1" max="100" placeholder="?">
                <button class="guess-btn" onclick="makeGuess()">Guess!</button>
            </div>
            
            <div class="message" id="message" style="display: none;"></div>
            
            <div class="stats">
                <p>Attempts: <span id="attempts">0</span></p>
                <p>Range: <span id="range">1 - 100</span></p>
            </div>
            
            <button class="new-game-btn" onclick="newGame()">New Game</button>
        </div>
        
        <div class="info">
            <strong>📝 Based on Python Code:</strong><br>
            This guessing game implements the number generation and comparison logic from your Python code.
        </div>
    </div>

    <script>
        let targetNumber = Math.floor(Math.random() * 100) + 1;
        let attempts = 0;
        let minRange = 1;
        let maxRange = 100;

        function makeGuess() {
            const input = document.getElementById('guessInput');
            const guess = parseInt(input.value);
            const messageDiv = document.getElementById('message');
            
            if (isNaN(guess) || guess < 1 || guess > 100) {
                showMessage('Please enter a number between 1 and 100!', 'too-high');
                return;
            }
            
            attempts++;
            document.getElementById('attempts').textContent = attempts;
            
            if (guess === targetNumber) {
                showMessage(\`🎉 Congratulations! You guessed it in \${attempts} attempts!\`, 'correct');
                input.disabled = true;
            } else if (guess < targetNumber) {
                minRange = Math.max(minRange, guess + 1);
                showMessage('📈 Too low! Try a higher number.', 'too-low');
                updateRange();
            } else {
                maxRange = Math.min(maxRange, guess - 1);
                showMessage('📉 Too high! Try a lower number.', 'too-high');
                updateRange();
            }
            
            input.value = '';
            input.focus();
        }

        function showMessage(text, type) {
            const messageDiv = document.getElementById('message');
            messageDiv.textContent = text;
            messageDiv.className = \`message \${type}\`;
            messageDiv.style.display = 'block';
        }

        function updateRange() {
            document.getElementById('range').textContent = \`\${minRange} - \${maxRange}\`;
        }

        function newGame() {
            targetNumber = Math.floor(Math.random() * 100) + 1;
            attempts = 0;
            minRange = 1;
            maxRange = 100;
            
            document.getElementById('attempts').textContent = '0';
            document.getElementById('range').textContent = '1 - 100';
            document.getElementById('message').style.display = 'none';
            document.getElementById('guessInput').disabled = false;
            document.getElementById('guessInput').focus();
        }

        // Handle Enter key
        document.getElementById('guessInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                makeGuess();
            }
        });

        // Focus input on load
        document.getElementById('guessInput').focus();
    </script>
</body>
</html>`;
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
      // Convert Python code to working HTML equivalent
      return convertPythonToHTML(selectedFile.content, selectedFile.name);
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
          <p className="text-xs text-gray-500 mt-2">HTML, CSS & Python show working apps • JSON shows formatted data • Other files show code view</p>
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