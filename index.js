const fs = require("fs");
const translate = require('@iamtraction/google-translate');
if (process.platform !== 'win32') return console.log('Sorry... This tool can only be used on Windows OS.')
fs.writeFileSync("Crossout_Chat_Translator.bat",
    `@echo off
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
    "%WinDir%\\System32\\Reg" QUERY "%~1" /v "%~2" > "%TEMP%\\_envset.tmp" 2>NUL
    for /f "usebackq skip=2 tokens=2,*" %%A IN ("%TEMP%\\_envset.tmp") do (
        echo/set "%~3=%%B"
    )
    goto :EOF
\\
:: Get a list of environment variables from registry
:GetRegEnv
    "%WinDir%\\System32\\Reg" QUERY "%~1" > "%TEMP%\\_envget.tmp"
    for /f "usebackq skip=2" %%A IN ("%TEMP%\\_envget.tmp") do (
        if /I not "%%~A"=="Path" (
            call :SetFromReg "%~1" "%%~A" "%%~A"
        )
    )
    goto :EOF

:main
    echo/@echo off >"%TEMP%\\_env.cmd"

    :: Slowly generating final file
    call :GetRegEnv "HKLM\\System\\CurrentControlSet\\Control\\Session Manager\\Environment" >> "%TEMP%\\_env.cmd"
    call :GetRegEnv "HKCU\\Environment">>"%TEMP%\\_env.cmd" >> "%TEMP%\\_env.cmd"

    :: Special handling for PATH - mix both User and System
    call :SetFromReg "HKLM\\System\\CurrentControlSet\\Control\\Session Manager\\Environment" Path Path_HKLM >> "%TEMP%\\_env.cmd"
    call :SetFromReg "HKCU\\Environment" Path Path_HKCU >> "%TEMP%\\_env.cmd"

    :: Caution: do not insert space-chars before >> redirection sign
    echo/set "Path=%%Path_HKLM%%;%%Path_HKCU%%" >> "%TEMP%\\_env.cmd"

    :: Cleanup
    del /f /q "%TEMP%\\_envset.tmp" 2>nul
    del /f /q "%TEMP%\\_envget.tmp" 2>nul

    :: capture user / architecture
    SET "OriginalUserName=%USERNAME%"
    SET "OriginalArchitecture=%PROCESSOR_ARCHITECTURE%"

    :: Set these variables
    call "%TEMP%\\_env.cmd"

    :: Cleanup
    del /f /q "%TEMP%\\_env.cmd" 2>nul

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
Taskkill /F /PID ${process.pid} > nul
echo.
start /b Node .
timeout 2 /nobreak > nul
goto CrossoutOnline
`);
fs.readdir(`C:${process.env.HOMEPATH}/Documents/My games/Crossout/Logs`, (error, folders) => {
    if (error) { return console.error(error); }
    fs.readdir(`C:${process.env.HOMEPATH}/Documents/My games/Crossout/Logs/${folders[(folders.length - 1)]}`, (error, list) => {
        if (error) { return console.error(error); }
        if (!list.find(file => file === 'chat.log')) return console.log("chat.log not found")
        console.log('\x1b[31m%s\x1b[0m', 'https://github.com/JimmyGaubert/Crossout-Chat-Translator')
        console.log('\x1b[33m%s\x1b[0m', 'This app was made by Earlam#3915 and Quantum#4444. Enjoy !')
        console.log('\x1b[32m%s\x1b[0m', 'Waiting for messages in game chat... :)')
        let linesArray = []
        setInterval(() => {
            fs.readFile(`C:${process.env.HOMEPATH}/Documents/My games/Crossout/Logs/${folders[(folders.length - 1)]}/chat.log`, (error, filedata) => {
                if (error) { return console.error(error); }
            });
        }, 500);
        fs.watch(`C:${process.env.HOMEPATH}/Documents/My games/Crossout/Logs/${folders[(folders.length - 1)]}/chat.log`, (eventType, filename) => {
            if (eventType === 'change') {
                fs.readFile(`C:${process.env.HOMEPATH}/Documents/My games/Crossout/Logs/${folders[(folders.length - 1)]}/chat.log`, 'utf8', (err, data) => {
                    const lines = data.split(/\r?\n/);
                    const lastline = lines[lines.length - 2];
                    if (!(/\]/).test(lastline)) return;
                    if (!linesArray.find(e => e == lastline)) {
                        linesArray.push(lastline);
                        setTimeout(() => {
                            for (let i = 0; i < linesArray.length; i++) {
                                if (linesArray[i] === lastline) { linesArray.splice(i, 1) }
                            }
                        }, 500); 
                        const logstimer = lastline.slice(0, 5);
                        let playername;
                        ((lastline.split('[')[1].split(' #')[0].trim().length) % 2 == 0) ? playername = lastline.split('[')[1].split(' #')[0].padEnd(16, ' \u200b ') : playername = lastline.split('[')[1].split(' #')[0].padEnd(16, ' \u200b ')+" ";
                        translate(lastline.split('] ')[1], { to: 'en' }).then(res => {
                            if ((/PRIVATE From/).test(lastline)) {
                                console.log('\x1b[95m%s\x1b[0m', `${logstimer}|FROM \u200b |${playername}| ${res.text.replace('#^#^', '^^')}`)
                            } else if ((/PRIVATE To/).test(lastline)) {
                                console.log('\x1b[95m%s\x1b[0m', `${logstimer}|TO \u200b \u200b |${playername}| ${res.text.replace('#^#^', '^^')}`)
                            } else if ((/team_/).test(lastline)) {
                                console.log('\x1b[36m%s\x1b[0m', `${logstimer}|TEAM \u200b |${playername}| ${res.text.replace('#^#^', '^^')}`)
                            } else if ((/clan_/).test(lastline)) {
                                console.log('\x1b[32m%s\x1b[0m', `${logstimer}|CLAN \u200b |${playername}| ${res.text.replace('#^#^', '^^')}`)
                            } else if ((/party_/).test(lastline) || (/custom_game/).test(lastline)) {
                                console.log('\x1b[34m%s\x1b[0m', `${logstimer}|PARTY \u200b |${playername}| ${res.text.replace('#^#^', '^^')}`)
                            } else {
                                console.log(`${logstimer}|GENERAL|${playername}| ${res.text.replace('#^#^', '^^')}`)
                            }
                        }).catch(err => {
                            console.error(err);
                        });
                    }
                })
            };
        });
    });
});
