@echo off
chcp 65001 >nul
title 心动选修课
cd /d "%~dp0"
echo 正在打开《心动选修课》...
start "" "%~dp0game\index.html"
