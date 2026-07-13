const {
    SlashCommandBuilder,
    EmbedBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quota-punishment')
        .setDescription('Issue a quota punishment.')

        .addUserOption(option =>
            option
                .setName('staff')
                .setDescription('The staff member receiving the punishment.')
                .setRequired(true)
        )

        .addStringOption(option =>
            option
                .setName('infraction')
                .setDescription('Select the infraction.')
                .setRequired(true)
                .addChoices(
                    { name: 'Warning 1', value: 'Warning 1' },
                    { name: 'Warning 2', value: 'Warning 2' },
                    { name: 'Warning 3', value: 'Warning 3' },
                    { name: 'Strike 1', value: 'Strike 1' },
                    { name: 'Strike 2', value: 'Strike 2' },
                    { name: 'Strike 3', value: 'Strike 3' },
                    { name: 'Termination', value: 'Termination' }
                )
        )

        .addStringOption(option =>
            option
                .setName('offense')
                .setDescription('Select the offense.')
                .setRequired(true)
                .addChoices(
                    { name: 'First', value: 'First' },
                    { name: 'Second', value: 'Second' },
                    { name: 'Third', value: 'Third' }
                )
        )

        .addAttachmentOption(option =>
            option
                .setName('evidence')
                .setDescription('Evidence image or video.')
                .setRequired(true)
        )

        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('Reason for the punishment.')
                .setRequired(false)
        )

        .addBooleanOption(option =>
            option
                .setName('send_wave_information')
                .setDescription('Send the wave information embed first.')
                .setRequired(false)
        )

        .addIntegerOption(option =>
            option
                .setName('wave_number')
                .setDescription('Current quota wave number.')
                .setRequired(false)
        ),

    async execute(interaction) {
        const staff = interaction.options.getUser('staff');
        const infraction = interaction.options.getString('infraction');
        const offense = interaction.options.getString('offense');
        const evidence = interaction.options.getAttachment('evidence');

        const reason =
            interaction.options.getString('reason') ||
            'Failure to complete in game quota';

        const sendWave =
            interaction.options.getBoolean('send_wave_information') ?? false;

        const waveNumber =
            interaction.options.getInteger('wave_number');

        if (sendWave && !waveNumber) {
            return interaction.reply({
                content: '❌ You must provide a wave number when sending the wave information embed.',
                ephemeral: true
            });
        }

        if (sendWave) {
            const waveEmbed = new EmbedBuilder()
                .setColor(0x5865F2)
                .setTitle(`<:PRPC:1308501256058175558> Quota Infractions Wave ${waveNumber} <:PRPC:1308501256058175558>`)
                .setDescription(
`<:PRPCInfo:1331271346369335366> | Quota Information:

> <:arrow:1339937971889111050> Moderation Department
      ↳ 2 Hours

> <:arrow:1339937971889111050> Administration Department
      ↳ 2 Hours

━━━━━━━━━━━━━━━━━━━━

**<:PRPC:1308501256058175558> | Quota Punishments Information:**

• First Offense for Quota Punishment, if over 1 hour of shift → Inactivity Notice

• First Offense for Quota Punishment, if under 1 hour of shift → Warning

• Second Offense for Quota Punishment → Strike

• Third Offense for Quota Punishment after previously receiving a Strike → Strike → Termination

• Additional rule for moderators:
https://discord.com/channels/735880148125220924/1203734013617905754/1440317040274575512

━━━━━━━━━━━━━━━━━━━━`
                )
                .setTimestamp();

            await interaction.channel.send({
                embeds: [waveEmbed]
            });
        }        const punishmentMessage = `**Staff Username:** ${staff}
**Initiated by:** ${interaction.user}
**Infraction:** ${infraction}
**Reason:** ${reason}
**Offence:** ${offense}
**Evidence:**`;

        await interaction.channel.send({
            content: punishmentMessage,
            files: [
                {
                    attachment: evidence.url,
                    name: evidence.name
                }
            ]
        });

        await interaction.reply({
            content: '✅ Successfully sent the quota punishment.',
            ephemeral: true
        });
    }
};