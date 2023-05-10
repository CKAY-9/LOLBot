// /topMastery = get the top five, or below if they have played less than five, mastery scores for a player

import { 
    APIEmbedField,
    CommandInteraction, 
    EmbedBuilder, 
    SlashCommandBuilder 
} from "discord.js";
import { 
    dragonIcon,
    errorEmbed, 
    opGGLink, 
    regionsToOption 
} from "../utils";
import {  
    leagueAPI 
} from "../league";
import { Constants } from "twisted";

const commandData = new SlashCommandBuilder()
    .setName("topMastery")
    .setDescription("Get the top five champions by mastery for a player.")
    .addStringOption((option) => {
        return option.setName("summoner_name")
            .setDescription("The summoner name to search")
            .setRequired(true)
    })
    .addStringOption((option) => {return regionsToOption(option)});

const execute = async (interaction: CommandInteraction) => {
    const summonerName = interaction.options.get("summoner_name", true);
    const region = interaction.options.get("region", true);

    try {
        const user = await leagueAPI.Summoner.getByName(summonerName.value as string, Constants.Regions[region.value as string]);
        const mastery = await leagueAPI.Champion.masteryBySummoner(user.response.id, Constants.Regions[region.value as string]);
        // Sort masteries by points then get the top five, or whatever the length is
        const masteries = mastery.response.sort((a, b) => {
            if (a.championPoints < b.championPoints) {
                return -1;
            }
            if (a.championPoints > b.championPoints) {
                return 1;
            }
            return 0;
        }).reverse().splice(0, mastery.response.length >= 4 ? 4 : mastery.response.length);

        // Create embed fields for each champion
        const fields: APIEmbedField[] = [];
        let pos = 1
        for (const ms of masteries) {
            if (pos >= 6) {
                break;
            }

            const champ = await leagueAPI.DataDragon.getChampion(ms.championId);
            fields.push({
                "name": `${pos}. ${champ.name}`,
                "value": `Level ${ms.championLevel} / ${ms.championPoints} Mastery Points`
            });
            
            pos++
        }

        const masteryEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(user.response.name + " Masteries")
            .setURL(opGGLink(user.response.name, Constants.Regions[region.value as string]))
            .setAuthor({
                name: "LoLBot", 
                iconURL: interaction.client.user.avatarURL(),
                url: "https://github.com/Camerxxn/LoLBot"
            })
            .setDescription(`Top ${masteries} for ${user.response.name}`)
            .setThumbnail(`${dragonIcon(user.response.profileIconId)}`)
            .addFields({
                name: "\u200B", 
                value: "\u200B"
            })
            .addFields(fields)
            .setTimestamp()
            .setFooter({
                text: "Thanks for using LoLBot", 
                iconURL: interaction.client.user.avatarURL()
            }); 
        await interaction.reply({embeds: [masteryEmbed]})
    } catch (ex) {
        console.log(ex);
        await interaction.reply({embeds: [errorEmbed(interaction)]});
    }
}

module.exports = {
    data: commandData,
    execute: execute
}