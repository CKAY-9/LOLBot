import { 
    APIEmbedField,
    CommandInteraction, 
    EmbedBuilder, 
    SlashCommandBuilder 
} from "discord.js";
import { 
    convertQueueToValue,
    dragonIcon, 
    errorEmbed, 
    opGGLink, 
    regionsToOption 
} from "../utils";
import { leagueAPI } from "../league";
import { Constants } from "twisted";

const commandData = new SlashCommandBuilder()
    .setName("rank")
    .setDescription("Get the current rank of a player")
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
        const ranks = await leagueAPI.League.bySummoner(user.response.id, Constants.Regions[region.value as string]);
        
        let fieldInfo: APIEmbedField[] = [];
        if (ranks.response.length <= 0) {
            fieldInfo.push(
                {
                    name: `${user.response.name} is not ranked!`,
                    value: "This player has not been ranked this season :("
                },
                {
                    name: "\u200B", 
                    value: "\u200B"
                }
            )
        } else {
            for (const queueType of ranks.response) {
                fieldInfo.push(
                    {
                        name: "Queue",
                        value: convertQueueToValue(queueType.queueType)
                    },
                    {
                        name: "Rank",
                        value: queueType.tier
                    },
                    {
                        name: "Division",
                        value: queueType.rank
                    },
                    {
                        name: "Wins/Losses",
                        value: `${queueType.wins}/${queueType.losses} (WR: ${Math.round(queueType.wins / (queueType.wins + queueType.losses) * 100)}%)`
                    },
                    {
                        name: "\u200B", 
                        value: "\u200B"
                    }
                );
            }
        }

        const seasonEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(user.response.name + "'s Current Season")
            .setURL(opGGLink(user.response.name, Constants.Regions[region.value as string]))
            .setAuthor({
                name: "LoLBot", 
                iconURL: interaction.client.user.avatarURL(),
                url: "https://github.com/Camerxxn/LoLBot"
            })
            .setDescription(`The current ranked season for ${user.response.name}`)
            .setThumbnail(`${dragonIcon(user.response.profileIconId)}`)
            .addFields(                    {
                name: "\u200B", 
                value: "\u200B"
            })
            .addFields(fieldInfo)
            .setTimestamp()
            .setFooter({
                text: "Thanks for using LoLBot", 
                iconURL: interaction.client.user.avatarURL()
            }); 
        await interaction.reply({embeds: [seasonEmbed]})
    } catch (ex) {
        console.log(ex);
        await interaction.reply({embeds: [errorEmbed(interaction, ex.body.status.message)]})
    }
}

module.exports = {
    data: commandData,
    execute: execute
}