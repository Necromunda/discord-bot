const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	// Type /ping to execute
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};