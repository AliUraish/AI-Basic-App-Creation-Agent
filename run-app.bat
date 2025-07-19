@echo off
echo Stopping any running servers...
taskkill /f /im node.exe 2>nul

echo Building frontend...
cd my-vue-app
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo Build failed!
    pause
    exit /b 1
)
cd ..

echo Starting server on port 5174...
echo Open http://localhost:5174 in your browser
node Index.js 