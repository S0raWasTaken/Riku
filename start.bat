@echo off
cls
SET path=%~dp0
IF EXIST "%path%\.env" node . ELSE echo "No file .env found">%path%\errorLogs.txt && pause