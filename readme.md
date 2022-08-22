# Crossout Chat Translator

Crossout Chat Translator a.k.a CCT is a tool that translates messages posted by crossout players in the in-game chat, and display the translation in the CMD (the terminal of Windows OS).

![alt text](https://www.aht.li/3729172/cct.png)


### How it works?

This app uses [Node.js](https://nodejs.org) and its included [fs](https://nodejs.org/dist/latest-v16.x/docs/api/fs.html) library to find and read Crossout logs,

then the [@iamtraction/google-translate](https://github.com/iamtraction/google-translate) library to translate these messages, using the google's api. 

It reads the game logs present in /%Documents%/My games/Crossout/Logs, and translate them.

Then it just outpout the translations to the windows terminal ^^

The application does not modify any game files... Great, right?


### Easy to use!
We wondered how to make the use of the tool easy. Instead of giving you a list of commands to type, we've created a .bat file that do it for you. No dev or admin skills are required to use it. You can use this app in one clic :)


### Installation :

1- Download, unzip this repo then place it where you want

2- Run the Crossout_Chat_Translator.bat file

3- Enjoy!


### Authors

- Earlam#3915
- Quantum#4444
