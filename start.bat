@echo off
echo.
echo 🌟 Starting Beautiful Portfolio Website...
echo.

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Python found - Starting server with Python...
    echo 🌐 Opening website at http://localhost:8000
    echo 🛑 Press Ctrl+C to stop the server
    echo.
    start http://localhost:8000
    python -m http.server 8000
) else (
    REM Check if Node.js is available
    node --version >nul 2>&1
    if %errorlevel% == 0 (
        echo ✅ Node.js found - Starting server with http-server...
        echo 📦 Installing http-server if needed...
        npm install -g http-server
        echo 🌐 Opening website at http://localhost:8000
        echo 🛑 Press Ctrl+C to stop the server
        echo.
        start http://localhost:8000
        http-server . -p 8000 -c-1
    ) else (
        echo ❌ Neither Python nor Node.js found!
        echo.
        echo Please install one of the following:
        echo 📥 Python: https://python.org/downloads
        echo 📥 Node.js: https://nodejs.org/download
        echo.
        echo After installation, run this script again.
        pause
    )
)

pause