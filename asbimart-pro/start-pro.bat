@echo off
title AsbiMart Pro Enterprise Launcher
echo ====================================================
echo   🌿 AsbiMart Pro (আসবিমার্ট প্রো এন্টারপ্রাইজ) চালু হচ্ছে...
echo   🛡️ OWASP Top 10 Hardened & Strix CI Verified
echo   📦 Centralized Master Catalog, Stock Locking & Courier API
echo ====================================================
cd /d "%~dp0backend"
start "" http://localhost:5057
node server.js
pause
