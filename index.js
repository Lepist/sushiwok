/*
https://wwebjs.dev/ - библиотека(API) для whatsApp бота; использует Puppeteer(эмулятор Chrome)
*/
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Загружаем данные сессии, если они были сохранены ранее
const client =  new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('authenticated', () => {
    console.log(`[LOG] Succesfully authenticated.`);
});

client.on('ready', () => {
    console.log('[LOG] Client is ready!');
    let text = "Hello";
    let chatId = "79266481762" + "@c.us"; // chatid лички юзера с номером (т.е. пишем напрямую)
    client.sendMessage(chatId, text); // отправляем сообщение
});

client.initialize();

client.on('message', async msg => {
    const chat = await msg.getChat();
    const contact = await msg.getContact();
    console.log(msg.body); // выводим в консоль сообщение, которое пришло 
});


/* 
    Пока что не совсем понятно как создать событие-слушателя для конкретного юзера(почитаю документацию поподробнее), как вариант создать копию client.on('message') для конкретного пользователя на время переписки, а после удалять и оставлять только основной слушатель всех сообщений. Либо дописать новый ивент в библиотеку(в этом случае придется каждый раз дописывать его при обновлении библиотеки, не совсем удобно)

*/