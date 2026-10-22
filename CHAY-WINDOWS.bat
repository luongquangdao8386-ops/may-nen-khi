@echo off
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel% equ 0 (
    py -3 run.py
) else (
    python run.py
)
if %errorlevel% neq 0 (
    echo.
    echo Can Python 3. Xem tep HUONG-DAN.md de cai dat hoac dung VS Code Live Server.
    pause
)
