const fs = require('node:fs');
const path = require('node:path');

module.exports = (client) => {
    client.commands = new Map();

    const commandsPath = path.join(__dirname, '..', 'commands');

    const folders = fs.readdirSync(commandsPath);

    for (const folder of folders) {
        const folderPath = path.join(commandsPath, folder);

        const files = fs
            .readdirSync(folderPath)
            .filter(file => file.endsWith('.js'));

        for (const file of files) {
            const filePath = path.join(folderPath, file);

            const command = require(filePath);

            if (!('data' in command) || !('execute' in command)) {
                console.warn(
                    `[WARNING] The command at ${filePath} is missing "data" or "execute".`
                );
                continue;
            }

            client.commands.set(command.data.name, command);

            console.log(`✅ Loaded command: ${command.data.name}`);
        }
    }

    console.log(`📦 Loaded ${client.commands.size} command(s).`);
};