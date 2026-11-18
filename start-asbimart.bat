@echo off
title AsbiMart Server Launcher
echo ====================================================
echo   AsbiMart (আসবিমার্ট) সার্ভার চালু হচ্ছে...
echo ====================================================
cd /d "%~dp0backend"
start "" http://localhost:5000
node server.js
pause
