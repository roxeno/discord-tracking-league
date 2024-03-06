require('dotenv').config();
const {Client, IntentsBitField, EmbedBuilder} = require('discord.js');
const leagueChatRoom = process.env.LEAGUE_DISCORD;
const target = proncess.env.TARGET_NAME;

//api
async function getMatchList(){
    const link = `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${process.env.PUUID}/ids?start=0&count=20&api_key=${process.env.RiotTOKEN}`
    const response = await fetch(link);

    let data = await response.json();
    return data[0];
}

async function lastMatchHistory(mode){
    const matchId = getMatchList();
    const link = `https://americas.api.riotgames.com//lol/match/v5/matches/${matchId}/timeline?api_key=${process.env.RiotTOKEN}`

    const response = await fetch(link);
 
    let data = await response.json();
    if(mode="win"){
    return data.win;
    }
    else if(mode="stat"){
        return data.win;
    }
}


//intentions
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds, 
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildPresences
    ],
});


client.on('ready', (c) => {
    console.log(`${c.user.username} is online`);
    c.user.setActivity(`Playing with ${target}`);
});

client.on("presenceUpdate", updt =>{

    if(updt === null){
        return;
    }
    if(updt.user ===null){
        return;
    }

    if(updt.user.username===`${target}`){
        if(updt.activities[0] === undefined){
            client.channels.cache.get(`${leagueChatRoom}`).send(`${target} turned on discord`);
        }
        else{
            const getActivity = updt.activities[0];
            const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`${target} Gamer Alert`)
            .setURL(`${process.env.TARGET_OP_GG}`)
            .setAuthor({name : `${target}`, iconURL : 'https://yt3.googleusercontent.com/ytc/AIdro_nBT1BIfeALpYXiAk3jxfczt5Dua_91IyXpjEwT=s176-c-k-c0x00ffffff-no-rj'})
            .setDescription(`${getActivity.name} is playing ${getActivity.details}.`)
            .setTimestamp()
    
        if (getActivity.name === "League of Legends" && getActivity.state === "In Game"){
            client.channels.cache.get(`${leagueChatRoom}`).send({ embeds: [embed] });
        }
        }
    }
   
    
});


client.on('interactionCreate',(interaction) =>{
    if(!interaction.isChatInputCommand()) return;

    //win
    if(interaction.commandName === 'win'){
        if(lastMatchHistory("win")){
            interaction.reply("Yes he did.");
        }
        else{
            interaction.reply("No he did not.");
        }
    }

    //stats
    if(interaction.commandName === 'stats'){
        console.log(lastMatchHistory("stat"));
    }
});



client.login(process.env.TOKEN);


