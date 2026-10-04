@echo off
REM Golden Voice - Start Backend & Frontend Together (Windows)
REM This script starts both services in parallel

setlocal enabledelayedexpansion

echo ================================
echo Starting Golden Voice Platform
echo ================================
echo.

REM Get directories
set "SCRIPT_DIR=%~dp0"
set "BACKEND_DIR=%SCRIPT_DIR%..\goldenvoice-backend\gv"
set "FRONTEND_DIR=%SCRIPT_DIR%"

echo Backend:  %BACKEND_DIR%
echo Frontend: %FRONTEND_DIR%
echo.

REM Check if backend node_modules exists
if not exist "%BACKEND_DIR%\node_modules" (
  echo [1/3] Installing backend dependencies...
  cd /d "%BACKEND_DIR%"
  call npm install
  cd /d "%FRONTEND_DIR%"
)

REM Check if frontend node_modules exists
if not exist "%FRONTEND_DIR%\node_modules" (
  echo [2/3] Installing frontend dependencies...
  call npm install
)

echo [3/3] Starting services...
echo.

echo Starting Backend on http://localhost:4000...
cd /d "%BACKEND_DIR%"
start "Golden Voice Backend" cmd /k npm run dev

REM Wait 3 seconds for backend to start
timeout /t 3 /nobreak

echo Starting Frontend on http://localhost:5173...
cd /d "%FRONTEND_DIR%"
start "Golden Voice Frontend" cmd /k npm run dev

echo.
echo ================================
echo Backend:  http://localhost:4000
echo Frontend: http://localhost:5173
echo ================================
echo.
echo Both services are starting in separate windows.
echo Close the windows to stop the services.
echo.
pause
