import fs from "fs";
import path from "path";
import dotenv from "dotenv";
// Discord.js imports
import {
    REST,
    Routes
} from "discord.js";

// Setup dotenv
dotenv.config({
    path: path.join(__dirname, "/../.env")
});

export const deployCommands = async () => {
    // Load commands from directory
    const commands = [];
    const commandsPath = path.join(__dirname, "commands");
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => {
        return file.endsWith(".js")
    });
    // Load commands into collection
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        
        console.log(command);

        // Key value pair for collection
        if ("data" in command && "execute" in command) {
            commands.push(command.data.toJSON());
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing the required data or execute property!`);
        }
    }

    const rest = new REST().setToken(process.env.BOT_TOKEN || "");

    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
    
        // Unknown type doesn't working with length
        const data: any = await rest.put(
            Routes.applicationCommands(process.env.BOT_CLIENT_ID || ""),
            { body: commands },
        );
    
        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
}