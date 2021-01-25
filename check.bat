@rem Checks if node environment is ready to run
@echo off
SET path=%~dp0

IF EXIST "%path%\.env" (
    IF EXIST "%path%\node_modules" (
        echo Ready to run node environment
    ) ELSE (
        echo Please run 'npm i --save' command
    )
) ELSE (
    echo Please setup '.env', there's a '.env.example' file to help you setting that up
)
pause