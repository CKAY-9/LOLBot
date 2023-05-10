import { LolApi } from "twisted";
import dotenv from "dotenv";
import path from "path";

// Setup .env
dotenv.config({
    path: path.join(__dirname, "/../.env")
});

export const dragonIcon = (id: number): string => {
    return `https://ddragon.leagueoflegends.com/cdn/13.9.1/img/profileicon/${id}.png`;
}

export const leagueAPI = new LolApi({
    key: process.env.RIOT_API_KEY,
    debug: {
        logRatelimits: true,
        logTime: true,
        logUrls: true
    },
});