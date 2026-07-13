const { REST, Routes } = require('discord.js');

module.exports = {
    name: 'clientReady',
    once: true,

    async execute(client) {
        console.log(`✅ Logged in as ${client.user.tag}`);
        console.log('🤖 HelpfulBot is online!');

        try {
            const commands = [];

            client.commands.forEach(command => {
                commands.push(command.data.toJSON());
            });

            const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

            await rest.put(
                Routes.applicationGuildCommands(
                    process.env.CLIENT_ID,
                    process.env.GUILD_ID
                ),
                { body: commands }
            );

            console.log(`✅ Registered ${commands.length} guild command(s).`);

        } catch (error) {
            console.error('❌ Failed to register commands:', error);
        }
    }
};