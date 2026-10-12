@echo off
REM Organization: Orbytes Global Solutions, Owner: Kirthik, Created at: 2026-10-11
REM Description: One-Click Startup Script launching MySQL check, Spring Boot backend, and Vite frontend

echo ==========================================================
echo        BUILDPILOT AI PRO - ONE-CLICK SYSTEM LAUNCHER
echo                 Orbytes Global Solutions
echo ==========================================================
echo.

echo [1/3] Checking MySQL Database connection on port 3306...
netstat -ano | findstr :3306 >nul
if %errorlevel% neq 0 (
    echo [WARNING] MySQL service not detected on port 3306. Ensure MySQL 8.0 is running.
) else (
    echo [OK] MySQL is active on port 3306.
)
echo.

echo [2/3] Starting Spring Boot Backend (Java 17, Port 8080)...
start "BuildPilot Backend (Spring Boot)" cmd /k "mvnw.cmd spring-boot:run"
echo Backend launched in separate window.
echo.

echo [3/3] Starting React + Vite Frontend (Port 5173)...
start "BuildPilot Frontend (Vite)" cmd /k "cd frontend && npm run dev"
echo Frontend launched in separate window.
echo.

echo Waiting 5 seconds for services to initialize...
timeout /t 5 /nobreak >nul

echo Launching browser to http://localhost:5173 ...
start http://localhost:5173

echo.
echo ==========================================================
echo  BuildPilot AI Pro is now running!
echo  Frontend: http://localhost:5173
echo  Backend:  http://localhost:8080/api/dashboard
echo  Demo Credentials: demo@buildpilot.dev / demo123
echo ==========================================================
pause
