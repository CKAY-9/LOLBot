// /profile - view a league profile

import { 
    CommandInteraction, 
    SlashCommandBuilder 
} from "discord.js";
import { Constants } from "twisted";
import { leagueAPI } from "../league";
import { EmbedBuilder } from "@discordjs/builders";
import { 
    dragonIcon,
    errorEmbed, 
    opGGLink, 
    regionsToOption 
} from "../utils";

// Information for calling the command
const commmandData = new SlashCommandBuilder()
    .setName("profile")
    .setDescription("View a League of Legends profile")
    .addStringOption((option) => {
        return option.setName("summoner_name")
            .setDescription("The summoner name to search")
            .setRequired(true)
    })
    .addStringOption((option) => {return regionsToOption(option)});

// Command logic
const execute = async (interaction: CommandInteraction) => {
    const summonerName = interaction.options.get("summoner_name", true);
    const region = interaction.options.get("region", true);

    try {
        const user = await leagueAPI.Summoner.getByName(summonerName.value as string, Constants.Regions[region.value as string]);
        const profileEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(user.response.name)
            .setURL(opGGLink(user.response.name, Constants.Regions[region.value as string]))
            .setAuthor({
                name: "LoLBot", 
                iconURL: interaction.client.user.avatarURL(),
                url: "https://github.com/Camerxxn/LoLBot"
            })
            .setDescription(`User Details for ${user.response.name}`)
            .setThumbnail(`${dragonIcon(user.response.profileIconId)}`)
            .addFields(
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