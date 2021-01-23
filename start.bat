@echo off
cls
SET path=%~dp0
IF EXIST "%path%\.env" ( npm i --save && node . ) ELSE ( echo "No file .env found">%path%\errorLogs.txt && pause )