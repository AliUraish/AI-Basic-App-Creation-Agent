import { config } from 'dotenv';
import { OpenAI } from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'node:child_process'
import { writeFile } from 'node:fs/promises'

// Get current directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from details.env file
config({ path: path.resolve(__dirname, 'details.env') });

// Check if API key is set
console.log('Checking for API key...');
if (!process.env.OPENAI_API_KEY) {
    console.error('Error: OPENAI_API_KEY is not set in details.env file');
    process.exit(1);
}

console.log('API Key found. Initializing OpenAI client...');
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

function getweatherinfo(cityname) {
    return `${cityname} have 43 degree celsius`;
}

function executeCommand(command) {
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
async function createFile({ fileName, content }) {
    try {
        await writeFile(fileName, content);
        return `File ${fileName} created successfully`;
    } catch (error) {
        return `Error creating file: ${error.message}`;
    }
}

const TOOLS_MAP = {
    getweatherinfo: getweatherinfo,
    executeCommand: executeCommand,
    createFile: createFile
}

const SYSTEM_PROMPT = `
You are a helpful assistant who is designed to resolve user queries.
You work on START, THINK, ACTION, OBSERVE and OUTPUT Mode.

In the START mode, you start with a given user query.
Then, you THINK how to resolve the user query atleast 3-4 times and make sure all is clear.
If there is a need to call a tool, you call the ACTION event with tool and input parameters.
If there is he ACTION event is called, wait for the OBSERVE that is output of the tool.
Based on OBSERVE from prev step, yu either OUTPUT or repeat the loop.

Rules:
- Always wait for the next step.
- Always output a single step and wait for the next step.
- Output must be stricly JSON.
- Only call tool ACTION from Avalaible tools only.
- You can only call tool after ACTION.
- You can only call tool after OBSERVE.
- Strictly follow the output format in JSON.

Available tools:
- getweatherinfo(city: string): string
- executeCommand(command): string Executes a given command on user's device and returns the output.
- createFile({fileName, content}): string Creates a new file with the given filename and content. Returns success/error message.

Example:
START: What is weather of Karachi?
THINK: The user is asking for weather of Karachi.
THINK: From the available tools, I need to call getweatherinfo tool to get weather information of Karachi.
ACTION: Call tool getweatherinfo(Karachi)
OBSERVE: 32 Degree C
THINK: The output of getWeatherInfo for Karachi is 32 Degree C.
OUTPUT: The Weather of Karachi is 32 Degree C Which is quiet hot.

Output Example:
{"role":"user","content":"What is weather of Karachi?"}
{"step":"think","content":"The user is asking for weather of Karachi."}
{"step":"think","content":"From the available tools, I need to call getweatherinfo tool to get weather information of Karachi."}
{"step":"action","tool":"getweatherinfo","input":"Karachi"}
{"step":"observe","content":"32 Degree C"}
{"step":"think","content":"The output of getWeatherInfo for Karachi is 32 Degree C."}
{"step":"output","content":"The Weather of Karachi is 32 Degree C Which is quiet hot."}


Output Format:
{"step":"string","tool":"string","input":"string","content":"string"}

`;

// Export functions for use in web interface
export { init, TOOLS_MAP, SYSTEM_PROMPT, client };

// Only run if this file is executed directly (not imported)
if (import.meta.url === `file://${process.argv[1]}`) {
    console.log('This file is now designed to work with the web interface.');
    console.log('Please use the web app at http://localhost:5173 to interact with the AI.');
}