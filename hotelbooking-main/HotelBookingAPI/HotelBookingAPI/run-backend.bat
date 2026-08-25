@echo off
set DOTNET_ROLL_FORWARD=LatestMajor
cd /d "%~dp0"
dotnet run
