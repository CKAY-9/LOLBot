import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Discord.js Imports
import {
    Client,
    Collection,
    Events,
    GatewayIntentBits
} from "discord.js";
import { deployCommands } from "./deployCommands";

// Configure dotenv
dotenv.config({
    path: path.join(__dirname + "/../.env")
});

// Initialize discord.js client
// GuildMessages for handling commands
// Guilds for just geeneral guild information
const client = new Client({
    "intents": [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ]
});

// Add commands attribute to client (as any is needed since Client doesn't have a built in commands collection)
(client as any).commands = new Collection();

// Load commands from directory
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter((file) => {
    return file.endsWith(".js");
});
// Load commands into collection
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    
    // Key value pair for collection
    if ("data" in command && "execute" in command) {
        (client as any).commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing the required data or execute property!`);
    }
}

// Handle interactions
client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const command = (interaction as any).client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

    // Try to execute command
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

// Login to discord and register commands
client.once(Events.ClientReady, async (client: Client) => {
    await deployCommands();
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.BOT_TOKEN);