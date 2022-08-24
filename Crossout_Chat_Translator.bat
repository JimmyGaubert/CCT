@echo off
echo Checking for dependencies updates...
node -v > nul 2> nul
if errorlevel 1 (
	echo.
	echo NodeJS is not installed attempting to install automatically
	echo.
	winget install OpenJS.NodeJS.LTS
@echo off
echo.

echo | set /p dummy="Refreshing environment variables from registry for cmd.exe. Please wait..."

:: This allows to use node.js and npm cli commands without asking the user to restart the bat after installing node.js https://github.com/chocolatey/choco/blob/master/src/chocolatey.resources/redirects/RefreshEnv.cmd
goto main

:: Set one environment variable from registry key
:SetFromReg
    "%WinDir%\System32\Reg" QUERY "%~1" /v "%~2" > "%TEMP%\_envset.tmp" 2>NUL
    for /f "usebackq skip=2 tokens=2,*" %%A IN ("%TEMP%\_envset.tmp") do (
        echo/set "%~3=%%B"
    )
    goto :EOF
\
:: Get a list of environment variables from registry
:GetRegEnv
    "%WinDir%\System32\Reg" QUERY "%~1" > "%TEMP%\_envget.tmp"
    for /f "usebackq skip=2" %%A IN ("%TEMP%\_envget.tmp") do (
        if /I not "%%~A"=="Path" (
            call :SetFromReg "%~1" "%%~A" "%%~A"
        )
    )
    goto :EOF

:main
    echo/@echo off >"%TEMP%\_env.cmd"

    :: Slowly generating final file
    call :GetRegEnv "HKLM\System\CurrentControlSet\Control\Session Manager\Environment" >> "%TEMP%\_env.cmd"
    call :GetRegEnv "HKCU\Environment">>"%TEMP%\_env.cmd" >> "%TEMP%\_env.cmd"

    :: Special handling for PATH - mix both User and System
    call :SetFromReg "HKLM\System\CurrentControlSet\Control\Session Manager\Environment" Path Path_HKLM >> "%TEMP%\_env.cmd"
    call :SetFromReg "HKCU\Environment" Path Path_HKCU >> "%TEMP%\_env.cmd"

    :: Caution: do not insert space-chars before >> redirection sign
    echo/set "Path=%%Path_HKLM%%;%%Path_HKCU%%" >> "%TEMP%\_env.cmd"

    :: Cleanup
    del /f /q "%TEMP%\_envset.tmp" 2>nul
    del /f /q "%TEMP%\_envget.tmp" 2>nul

    :: capture user / architecture
    SET "OriginalUserName=%USERNAME%"
    SET "OriginalArchitecture=%PROCESSOR_ARCHITECTURE%"

    :: Set these variables
    call "%TEMP%\_env.cmd"

    :: Cleanup
    del /f /q "%TEMP%\_env.cmd" 2>nul

    :: reset user / architecture
    SET "USERNAME=%OriginalUserName%"
    SET "PROCESSOR_ARCHITECTURE=%OriginalArchitecture%"

    echo | set /p dummy="Finished."
    echo .
)

call npm install > nul 2> nul
echo.
start /b Node .
timeout 2 /nobreak > nul
title Crossout Chat Translator

:CrossoutOnline
	Timeout 10 /nobreak > nul
	TASKLIST | FINDSTR /I "Crossout.exe" > nul
	if errorlevel 1 (goto CrossoutOffline)
goto CrossoutOnline
echo.
:CrossoutOffline
	Timeout 10 /nobreak > nul
	TASKLIST | FINDSTR /I "Crossout.exe" > nul
	echo Crossout is not running
if errorlevel 1 (goto CrossoutOffline)

echo Crossout is running reloading chat logs
timeout 8 /nobreak > nul
Taskkill /F /PID 4076 > nul
echo.
start /b Node .
timeout 2 /nobreak > nul
goto CrossoutOnline
