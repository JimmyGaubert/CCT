const fs = require("fs");
const translate = require('@iamtraction/google-translate');
if (process.platform !== 'win32') return console.log('Sorry... This tool can only be used on Windows OS.')
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
                        translate(lastline.split('] ')[1], { to: 'en' }).then(res => {
                            if ((/PRIVATE/).test(lastline)) {
                                console.log('\x1b[95m%s\x1b[0m', `${(lastline).split('] ')[0].replace('    ', ' ')}] ${res.text}`)
                            } else if ((/team_/).test(lastline)) {
                                console.log('\x1b[36m%s\x1b[0m', `${(lastline).split('] ')[0].replace('    ', ' ')}] ${res.text}`)
                            } else if ((/clan_/).test(lastline)) {
                                console.log('\x1b[32m%s\x1b[0m', `${(lastline).split('] ')[0].replace('    ', ' ')}] ${res.text}`)
                            } else if ((/party_/).test(lastline) || (/custom_game/).test(lastline)) {
                                console.log('\x1b[34m%s\x1b[0m', `${(lastline).split('] ')[0].replace('    ', ' ')}] ${res.text}`)
                            } else {
                                console.log(`${(lastline).split('] ')[0].replace('    ', ' ')}] ${res.text}`)
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
