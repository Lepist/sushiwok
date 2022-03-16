/*
https://wwebjs.dev/ - библиотека(API) для whatsApp бота, использует Puppeteer(эмулятор Chrome)
*/
const fs = require('fs');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const SESSION_FILE_PATH = './session.json';

// Загружаем данные сессии, если они были сохранены ранее
let client;
let sessionData;
if(fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH);
    // Создаем клиент с сохраненной сессией(если такая есть)
    client = new Client({
        authStrategy: new LocalAuth({
            session: sessionData
        })
    });
}else{
    client = new Client();
}

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

// Сохраняем значения сессии в файл после успешной авторизации
client.on('authenticated', (session) => {
    sessionData = session;
    // Записываем данные сессии в файл
    /* (node:17224) UnhandledPromiseRejectionWarning: TypeError [ERR_INVALID_ARG_TYPE]: The "data" argument must be of type string or an instance of Buffer, TypedArray, or DataView. Received undefined - разберусь */    
    // fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), {encoding: 'utf8'}, err => {
    //     if(err){
    //         console.error(`[ERROR] Ошибка записи файла ${SESSION_FILE_PATH}: ${err}`);
    //     }
    // });
    console.log(session);
    console.log(JSON.stringify(session));
    console.log(`[LOG] Succesfully authenticated.`);
});

client.on('ready', () => {
    console.log('[LOG] Client is ready!');
});

client.initialize();

client.on('message', async msg => {
    const chat = await msg.getChat();
    const contact = await msg.getContact();
    await chat.sendMessage(`Привет @${contact.id.user}`);
});