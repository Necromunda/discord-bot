//*--------------------------------------------------*//
//													  //
//    Discord bot that uses discord.js node module    //
//    to intercat with Discord API				      //
// 	  - Johannes Rantapää							  //
//												      //
//*--------------------------------------------------*//

const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Collection for commands
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const eventsPath = path.join(__dirname, 'events');

const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

// Retrieve commands from commands-folder and set the item in the Collection
// With the key as the command name and the value as the exported module
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

// Read event files and console.log() them
for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Console.log() when bot is online
client.once('ready', () => {
    console.log('Bot online!');
});

// Uses the client.commands collection and executes the commands
// when 'interactionCreate' event is emitted
client.on('interactionCreate', async interaction => {
	// Check if command is valid
	if (!interaction.isChatInputCommand()) return;

	// Get the command from the collection
    const command = interaction.client.commands.get(interaction.commandName);

	// Check if commands exists
	if (!command) return;

	// Execute the command or catch the error and log it
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(token);