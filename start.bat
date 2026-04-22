@echo off
echo ╔══════════════════════════════════════════════╗
echo ║        TaskFlow — Project Management         ║
echo ╚══════════════════════════════════════════════╝
echo.

echo Starting backend (port 5000)...
start "TaskFlow API" cmd /k "cd /d "%~dp0backend" && node server.js"

timeout /t 2 /nobreak >nul

echo Starting frontend (port 5173)...
start "TaskFlow UI" cmd /k "cd /d "%~dp0frontend" && npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo  Both servers are starting up!
echo  Open your browser at: http://localhost:5173
echo.
pause
