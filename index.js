require('dotenv').config();

const {
    Client,
    GatewayIntentBits,
    Collection
} = require('discord.js');

const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
});

client.commands = new Collection();

/* Load Commands */

const commandHandler = require('./handlers/commandHandler');
commandHandler(client);

/* Load Events */

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {

    const filePath = path.join(eventsPath, file);

    const event = require(filePath);

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }

}

/* Render Web Service */

const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('HelpfulBot is online!');
}).listen(PORT, () => {
    console.log(`🌐 Web server listening on port ${PORT}`);
});

/* Login */

client.login(process.env.TOKEN);