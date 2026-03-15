@echo off
echo ========================================
echo  VALCR Frontend Setup (Windows)
echo ========================================
echo.

REM Check Node is installed
node --version >nul 2>&1
IF ERRORLEVEL 1 (
    echo [ERROR] Node.js not found. Install from https://nodejs.org ^(v18+^)
    pause
    exit /b 1
)

echo [1/3] Node.js found: 
node --version

echo.
echo [2/3] Installing dependencies...
cd valcr-frontend
npm install

echo.
echo [3/3] Copying env file...
IF NOT EXIST .env.local (
    copy .env.example .env.local
    echo Created .env.local — update VITE_API_URL if needed
) ELSE (
    echo .env.local already exists, skipping
)

echo.
echo ========================================
echo  Setup complete!
echo  Run: cd valcr-frontend ^&^& npm run dev
echo  App: http://localhost:5173
echo ========================================
pause
