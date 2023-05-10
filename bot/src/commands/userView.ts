// /profile - view a league profile

// Discord.js Imports
import { 
    CommandInteraction, 
    SlashCommandBuilder 
} from "discord.js";

import { Constants } from "twisted";
import {
    dragonIcon, 
    leagueAPI 
} from "../league";
import { EmbedBuilder } from "@discordjs/builders";
import { errorEmbed } from "../utils";

// Information for calling the command
const commmandData = new SlashCommandBuilder()
    .setName("profile")
    .setDescription("View a League of Legends profile")
    .addStringOption((option) => {
        return option.setName("summoner_name")
            .setDescription("The summoner name to search")
            .setRequired(true)
    })
    .addStringOption((option) => {
        return option.setName("region")
            .setDescription("The region of the player account")
            .addChoices(
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
            )
            .setRequired(true)
    });

// Command logic
const execute = async (interaction: CommandInteraction) => {
    const summonerName = interaction.options.get("summoner_name", true);
    const region = interaction.options.get("region", true);

    try {
        const user = await leagueAPI.Summoner.getByName(summonerName.value as string, Constants.Regions[region.value as string]);
        const opGGLink = `https://www.op.gg/summoners/${Constants.Regions[region.value as string]}/${user.response.name}`.replace(" ", "%20");
        const profileEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(user.response.name)
            .setURL(opGGLink)
            .setAuthor({
                name: "LoLBot", 
                iconURL: interaction.client.user.avatarURL(),
                url: "https://github.com/Camerxxn/LoLBot"
            })
            .setDescription(`User Details for ${user.response.name}`)
            .setThumbnail(`${dragonIcon(user.response.profileIconId)}`)
            .addFields(
                {
                    name: "\u200B", 
                    value: "\u200B"
                },
                {
                    name: "Summoner Name", 
                    value: user.response.name
                },
                {
                    name: "Summoner ID", 
                    value: user.response.id
                },
                {
                    name: "Summoner Level", 
                    value: user.response.summonerLevel.toString()
                },
                {
                    name: "Profile Icon ID", 
                    value: user.response.profileIconId.toString()
                },
                {
                    name: "\u200B", 
                    value: "\u200B"
                },
            )
            .setTimestamp()
            .setFooter({
                text: "Thanks for using LoLBot", 
                iconURL: interaction.client.user.avatarURL()
            }); 
        await interaction.reply({embeds: [profileEmbed]})
    } catch (ex) {
        console.log(ex);
        await interaction.reply({embeds: [errorEmbed(interaction)]});
    }
}

module.exports = {
    data: commmandData,
    execute: execute
}