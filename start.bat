@echo off
cls
SET path=%~dp0
IF EXIST "%path%\.env" {
    node .
} else {
    echo "No file .env found">%path%\errorLogs.txt
    pause
}