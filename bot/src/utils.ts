import { EmbedBuilder } from "@discordjs/builders";
import {
    SlashCommandStringOption,
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

export const dragonIcon = (id: number): string => {
    return `https://ddragon.leagueoflegends.com/cdn/13.9.1/img/profileicon/${id}.png`;
}

export const opGGLink = (username: string, region: string): string => {
    return `https://www.op.gg/summoners/${region}/${username}`.replace(" ", "%20");
}

export const regionsToOption = (o: SlashCommandStringOption): SlashCommandStringOption => {
    o.setName("region");
    o.setDescription("Region of the player");
    o.addChoices(
        {
            name: "Korea",
            value: "KOREA",
        },
        {
            name: "Brazil",
            value: "BRAZIL",
        },
        {
            name: "NA",
            value: "AMERICA_NORTH"
        },
        {
            name: "EU West",
            value: "EU_WEST"
        },
        {
            name: "EU East",
            value: "EU_EAST"
        },
        {
            name: "Japan",
            value: "JAPAN"
        },
        {
            name: "Latin America North",
            value: "LAT_NORTH"
        },
        {
            name: "Latin America South",
            value: "LAT_SOUTH"
        },
        {
            name: "Oceania",
            value: "OCEANIA"
        },
        {
            name: "PBE",
            value: "PBE"
        },
        {
            name: "Russia",
            value: "RUSSIA"
        },
        {
            name: "Turkey",
            value: "TURKEY"
        }
    );
    o.setRequired(true);

    return o;
}