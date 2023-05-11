import { APIEmbedField, EmbedBuilder, SlashCommandBuilder, channelLink } from "discord.js";
import { 
    dragonIcon,
    errorEmbed, 
    opGGLink, 
    regionsToOption 
} from "../utils";
import { leagueAPI } from "../league";
import { Constants } from "twisted";
import { 
    ApiResponseDTO, 
    CurrentGameInfoDTO, 
    SpectatorNotAvailableDTO 
} from "twisted/dist/models-dto";

const commandData = new SlashCommandBuilder()
    .setName("current_match")
    .setDescription("If the given player is in a match, get the details")
    .addStringOption((option) => {
        return option.setName("summoner_name")
            .setDescription("The summoner name to search")
            .setRequired(true)
    })
    .addStringOption((option) => {return regionsToOption(option)});

const execute = async (interaction) =>  {
    const summonerName = interaction.options.get("summoner_name", true);
    const region = interaction.options.get("region", true);

    try {
        const user = await leagueAPI.Summoner.getByName(summonerName.value as string, Constants.Regions[region.value as string]);
        const temp = await leagueAPI.Spectator.activeGame(user.response.id, Constants.Regions[region.value as string]);
        
        if ((temp as SpectatorNotAvailableDTO).message !== undefined) {
            return await interaction.reply({embed: [errorEmbed(interaction, "This player either isn't in a game or their game is private")]});
        }

        const match = (temp as ApiResponseDTO<CurrentGameInfoDTO>);
        
        let bChamps = "";
        if (match.response.bannedChampions.length <= 0) {
            bChamps = "There are no bans for this match!";
        } else {
            for (const champ of match.response.bannedChampions) {
                const c = await leagueAPI.DataDragon.getChampion(champ.championId);
                bChamps += `${c.name}\n`
            }
        }

        const matchEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(user.response.name + "'s Current Match")
            .setURL(opGGLink(user.response.name, Constants.Regions[region.value as string]))
            .setAuthor({
                name: "LoLBot", 
                iconURL: interaction.client.user.avatarURL(),
                url: "https://github.com/Camerxxn/LoLBot"
            })
            .setDescription(`The details of ${user.response.name}'s current LoL match`)
            .setThumbnail(`${dragonIcon(user.response.profileIconId)}`)
            .addFields(
                {
                    name: "\u200B", 
                    value: "\u200B"
                },
                {
                    name: "Duration",
                    value: `${Math.round(match.response.gameLength / 60)}mins ${match.response.gameLength % 60}secs`
                },
                {
                    name: "Gamemode",
                    value: match.response.gameMode 
                },
                {
                    name: "Banned Champions",
                    value: bChamps
                },
                {
                    name: "\u200B", 
                    value: "\u200B"
                }
            )
            .setTimestamp()
            .setFooter({
                text: "Thanks for using LoLBot", 
                iconURL: interaction.client.user.avatarURL()
            }); 
        await interaction.reply({embeds: [matchEmbed]})
    } catch (ex) {
        console.log(ex);
        await interaction.reply({embeds: [errorEmbed(interaction, ex.body.status.message)]});
    }
}

module.exports = {
    data: commandData,
    execute: execute
}