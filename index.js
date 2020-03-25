const Discord = require("discord.js");
const bot = new Discord.Client();
const client = new Discord.Client();
const config = require("./config.json");

bot.on("ready", () => {
  console.log(`users: ${bot.users.size}, channels: ${bot.channels.size} servers: ${bot.guilds.size}`);
});

bot.on("guildMemberAdd", member => {
  //kicks 5 day old accounts
  const createdDate = member.user.createdAt;
  const currDate = new Date();
  const userCreatedAgo = currDate - createdDate;
  const userDays = userCreatedAgo / 86400000;
  if (userDays >= 4.90) {
  } else {
    let reason = "User account is less than 5 days old"
    member.kick(reason)
      .catch(error => member.guild.channels.find('name', "log").send(`Failed to kick a new account. Exception: ${error}`)).catch(err => console.log(err));
    member.guild.channels.find('name', "log").send(`Kicked a new account.`)
      .catch(error => console.log(error));
  }
});

bot.on("message", async message => {
  if(message.author.bot) return;
  if(message.content.indexOf(config.prefix) !== 0) return;
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if(command === "ping") {
  const m = await message.channel.send("Recieved");
  m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(bot.ping)}ms`);
}

if(command === "kick") {
  if(!message.channel.permissionsFor(message.member).has("KICK_MEMBERS"))
    return;
  let member = message.mentions.members.first() || message.guild.members.get(args[0]);
  if(!member)
    return message.reply("Tag a valid member to kick");
  if(!member.kickable)
    return message.reply("I cannot kick this user! Check my perms!");
  let reason = args.slice(1).join(' ');
  if(!reason) reason = "No reason provided";
  await member.kick(reason)
    .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because ${error}`));
  message.reply(`${member.user.tag} has been kicked by ${message.author.tag} for ${reason}`);

}

if(command === "ban") {
  if(!message.channel.permissionsFor(message.member).has("BAN_MEMBERS"))
    return;
  let member = message.mentions.members.first();
  if(!member)
    return message.reply("User invalid");
  if(!member.bannable)
    return message.reply("This user can't be banned! Check my perms");
  let reason = args.slice(1).join(' ');
  if(!reason) reason = ":crab::crab::crab: ${member.user.tag} is gone! :crab::crab::crab:";
  await member.ban(reason)
    .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because ${error}`));
  message.reply(`:crab::crab::crab: ${member.user.tag} :crab::crab::crab: is gone!`);
}

if(command === "purge") {
  if(!message.channel.permissionsFor(message.member).has("MANAGE_MESSAGES"))
    return;
  const deleteCount = parseInt(args[0], 10);
  if(!deleteCount || deleteCount < 2 || deleteCount > 100)
    return message.reply("Between 2 and 100 please");
  const fetched = await message.channel.fetchMessages({limit: deleteCount});
  message.channel.bulkDelete(fetched)
    .catch(error => message.reply(`Failed to delete because ${error}`));
}
if(command === "family") {
  message.delete().catch(err=>{});
  message.channel.send("oh you don't know what a family is do you?\nIs it because they abandoned you?\n how sad...");
}
if (command === "invite") {
  // Replace with your own link
  message.channel.send("Use this link to add me to your server: https://discordapp.com/api/oauth2/authorize?client_id=528749139312508931&permissions=536210678&scope=bot");
}
if (command === "help") {
  message.delete().catch(err =>{});
  message.author.send({embed: {
    "title": "Help for khimnoBot v2.2.1",
    "description": "khimnoBot has a built-in new account kicker.",
    "color": 9423402,
    "icon_url": bot.user.avatarURL,
    "timestamp": "2019-06-09T15:38:38.952Z",
    "footer": {
      "text": "Help for khimnoBot, Updated"
    },
    "author": {
      "name": "khimnoBot Help"
    },
    "fields": [
      {
        "name": "Commands",
        "value": "The current prefix is ``~/``"
      },
      {
        "name": "invite",
        "value": "Sends an invite you can use to add this bot to your own server."
      },
      {
        "name": "kick",
        "value": "``kick <user> <reason>`` This will kick a person from the server."
      },
      {
        "name": "ping",
        "value": "This shows the latency between you and I."
      },
      {
        "name": "purge",
        "value": "``purge <number>`` This deletes the requested number of messages."
      },
      {
        "name": "help",
        "value": "Sends a help DM."
      }
    ]
  }
})
    .catch(error => message.reply(`I could not send the help PM.`));
}
});
bot.login(config.token);
