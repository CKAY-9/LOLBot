import { EmbedBuilder } from "@discordjs/builders";
import { 
    CommandInteraction,  
} from "discord.js";

export const errorEmbed = (interaction: CommandInteraction) => {
    const errorEmbed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle("Error Executing Command!")
        .setAuthor({
            name: "LoLBot",
            iconURL: interaction.client.user.avatarURL(),
            url: "https://github.com/Camerxxn/LoLBot"
        })
        .setTimestamp()
        .setFooter({
            text: "Thanks for using LoLBot",
            iconURL: interaction.client.user.avatarURL()
        });
    return errorEmbed;
}