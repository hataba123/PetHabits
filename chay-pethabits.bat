@echo off
cd /d "%~dp0"

echo Dang khoi dong PetHabits...
if not exist "node_modules\" (
  echo Chua co dependency, dang cai dat...
  call npm install
  if errorlevel 1 (
    echo Khong the cai dat dependency. Hay kiem tra Node.js va npm.
    pause
    exit /b 1
  )
)

call npm run dev

pause
