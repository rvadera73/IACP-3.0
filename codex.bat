@echo off
REM Codex CLI Wrapper for IACP 3.0
REM Bypasses Windows Apps folder restrictions

SET CODEX_PATH=C:\Program Files\WindowsApps\OpenAI.Codex_26.313.5234.0_x64__2p2nqsd0c76g0\app\resources\codex.exe

REM Copy codex.exe to local directory temporarily
copy "%CODEX_PATH%" "%~dp0codex_local.exe" >nul 2>&1

REM Run from local directory
"%~dp0codex_local.exe" %*

REM Cleanup
del "%~dp0codex_local.exe" >nul 2>&1
