@echo off
:startover
echo Checking for dependencies updates...
call npm install
node .
goto startover
pause