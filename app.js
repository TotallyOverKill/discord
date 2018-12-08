

const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const config = require("./config.json");
const msg = require("./utils/msg.js")
const randomPuppy = require('random-puppy');
const prefix = 'c!';
const { get } = require("snekfetch");
const request = require('superagent');

const sql = require("sqlite");
sql.open("./score.sqlite");

var superagent = require('superagent');
var agent = superagent.agent();






client.colors = require("./servers.json");

let rainbow = 0;

client.on("ready", async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    client.on("message", message => {
      if (message.author.bot) return;
      if (message.channel.type !== "text") return;

      sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`).then(row => {
        if (!row) {
          sql.run("INSERT INTO scores (userId, points, level) VALUES (?, ?, ?)", [message.author.id, 1, 0]);
        } else {
          let curLevel = Math.floor(0.1 * Math.sqrt(row.points + 1));
          if (curLevel > row.level) {
            row.level = curLevel;
            sql.run(`UPDATE scores SET points = ${row.points + 1}, level = ${row.level} WHERE userId = ${message.author.id}`);
            message.reply(`You've leveled up to level **${curLevel}**! Ain't that dandy?`);
          }
          sql.run(`UPDATE scores SET points = ${row.points + 1} WHERE userId = ${message.author.id}`);
        }
      }).catch(() => {
        console.error;
        sql.run("CREATE TABLE IF NOT EXISTS scores (userId TEXT, points INTEGER, level INTEGER)").then(() => {
          sql.run("INSERT INTO scores (userId, points, level) VALUES (?, ?, ?)", [message.author.id, 1, 0]);
        });
      });

      if (!message.content.startsWith(prefix)) return;

      if (message.content.startsWith(prefix + "level")) {
        sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`).then(row => {
          if (!row) return message.reply("Your current level is 0");
          message.reply(`Your current level is ${row.level}`);
        });
      } else

      if (message.content.startsWith(prefix + "points")) {
        sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`).then(row => {
          if (!row) return message.reply("sadly you do not have any points yet!");
          message.reply(`you currently have ${row.points} points, good going!`);
        });
      }
    });


    setInterval(function() {
        client.user.setPresence({ game: { name: "c!help | " + client.guilds.size + " Servers! | " + client.users.size + " Users!", url: "https://www.twitch.tv/", type: 1 } });
    //Update every 30 seconds
  }, 30 * 1000);


    client.setInterval(() =>{

        //adding this so it doesnt start doing weird stuff
        if(rainbow > 1) {
            rainbow = 0
        }else{
            rainbow += 0.01;
        }

        //try to change role color for every server
        for(let i in client.colors) {
            let guildId = client.colors[i].guild;
            let guild = client.guilds.get(guildId);


            //if server gets deleted or bot gets kicked, remove from config
            if(guild === null) {
                delete client.colors[i];
                fs.writeFile("./servers.json", JSON.stringify(client.colors, null, 4), err => {
                    if(err) throw err;
                });
                return;
            }


            //try to change the role
            try{
                guild.roles.find("name", client.colors[i].role).setColor(hslToRgb(rainbow, 1, 0.5))
                .catch(err => {
                    delete client.colors[i]
                    fs.writeFile("./servers.json", JSON.stringify(client.colors, null, 4), err => {
                        if(err) throw err;
                    });
                    return;
                });
            }catch(err){
                delete client.colors[i]
                fs.writeFile("./servers.json", JSON.stringify(client.colors, null, 4), err => {
                    if(err) throw err;
                });
                return;
            }
        }
        //Change it every 3 seconds
    }, 3 * 1000)
});

client.on("message", async message =>{


    //Does stuff and removes first 2 chars and shit
    let command = message.content.split(" ")[0].slice(2);
    let args = message.content.split(" ").slice(1);
    //let mention = message.guild.member(message.mentions.users.first());


    if(!message.content.startsWith("c!")) return;
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

//help command
    if(command === "help")
        return msg.help(message);


    if(command === "ping")
        return msg.info(message, "Ping: `" + Math.round(client.ping) + "ms`");

    if(command === "meme")
    message.channel.send(`${message.author} gave @Memeos a hug! For Great Memes`, {
file: rando_imgs[Math.floor(Math.random() * rando_imgs.length)]
});

    if(command === "pups")
    randomPuppy()
    .then(url => {
        message.channel.send(url);
    })

if(command === "fennec")
  message.channel.send(`Heres some fennec foxes`, {
file: fennec_imgs[Math.floor(Math.random() * fennec_imgs.length)]
});



  if(command === "kitty") {
    const { body } = await superagent
    .get('http://aws.random.cat/meow');
    const embed = new Discord.RichEmbed()
    .setColor(0x954D23)
    .setTitle("Meow :cat:")
    .setImage(body.file)
    message.channel.send({embed})
  } else

  if (command === "announcement") {
  	   if (message.member.hasPermission("ADMINISTRATOR")) {
  		   const color = args[0]

  		   const text = args.slice(1).join(" ");
  		   if (text.length < 1) return message.channel.send("Can not announce nothing");
  		   //const colour = args.slice(2).join("");
  		   const embed = new Discord.RichEmbed()
  		   .setColor("0x" + color)
  		   .setTitle("Important Announcement:")
  		   .setDescription(text);
  		   message.channel.send("@everyone")
  		   message.channel.send({embed})
  	   }
     } else





    if(command === "todo")
    message.channel.send({embed: {
    color: 3447003,
    author: {
      name: client.user.username,
      icon_url: client.user.avatarURL
    },
    title: "Todo list",
    description: "This is a list of the top things that will be add to this bot!",
    fields: [{
        name: "Youtube/Spotify Music Player",
        value: "Will be able to play music into a talk channel from spotify or youtube!"
      },
      {
        name: "Fix c!kitty bugs",
        value: "bug fixes"
      },
      {
        name: "Level leaderboards",
        value: "Add a leaderboard for the levels, Top 10 levels."
      }
    ],
    timestamp: new Date(),
    footer: {
      icon_url: client.user.avatarURL,
      text: "© Super-Bot"
    }
  }
});


    if(command === "motd")
      message.channel.send({embed: {
        color: 3447003,
        description: "Enjoy and hold onto the little things in life, There the best!"

      }});

      if(command === "github")
        message.channel.send({embed: {
          color: 3447003,
          description: "Come look at the github for my bot here, https://github.com/TotallyOverKill/Super-Bot-Discord.js"

        }});

       // Purge
if(command === "purge") { // This time we have to use startsWith, since we will be adding a number to the end of the command.
    // We have to wrap this in an async since awaits only work in them.
    async function purge() {
        message.delete(); // Let's delete the command message, so it doesn't interfere with the messages we are going to delete.

        // Now, we want to check if the user has the `bot-commander` role, you can change this to whatever you want.
        if (!message.member.roles.find("name", "Purge")) { // This checks to see if they DONT have it, the "!" inverts the true/false
            message.channel.send('You need the \`Purge\` role to use this command.'); // This tells the user in chat that they need the role.
            return; // this returns the code, so the rest doesn't run.
        }

        // We want to check if the argument is a number
        if (isNaN(args[0])) {
            // Sends a message to the channel.
            message.channel.send('Please use a number as your arguments. \n Usage: ' + prefix + 'purge <amount>'); //\n means new line.
            // Cancels out of the script, so the rest doesn't run.
            return;
        }

        const fetched = await message.channel.fetchMessages({limit: args[0]}); // This grabs the last number(args) of messages in the channel.
        console.log(fetched.size + ' messages found, deleting...'); // Lets post into console how many messages we are deleting

        // Deleting the messages
        message.channel.bulkDelete(fetched)
            .catch(error => message.channel.send(`Error: ${error}`)); // If it finds an error, it posts it into the channel.

    }

    // We want to make sure we call the function whenever the purge command is run.
    purge(); // Make sure this is inside the if(msg.startsWith)

}


	if(command === "eval") {
        if(message.author.id !== config.ownerid) return;
			try{
				eval(args.join(" "));
			}catch(err){
				message.channel.send("srry left syntax in other pant")
        }
    }

    /*Sends the quit shit in every server and serches channels that it can send to, copy pasted
    if(command === "quit") {
        if(message.author.id !== config.ownerid) return;
			var guildList = client.guilds.array();
				guildList.forEach(guild => {
					guild.channels
					.filter(c => c.type === "text" &&
					c.permissionsFor(guild.client.user).has("SEND_MESSAGES"))
					.sort((a, b) => a.position - b.position ||
					Long.fromString(a.id).sub(Long.fromString(b.id)).toNumber())
					.first().send("Rainbow bot's code since im quitting: https://github.com/ItzNop/Rainbow-Colors-BOT")
                });
    }
    */

    if(command === "createInvite") {
        //owner check
        if(message.author.id !== config.ownerid) return;

        //gets last word and removes last word, ik shit way but works since channels cant have spaces
        let channel = args.pop();

        //tries to get the invite
        try{
            client.guilds.find("name", args.join(" ")).channels.find("name", channel).createInvite().then(invite => message.channel.send("Invite: https://discord.gg/" + invite.code))
        }catch(err){
            message.channel.send("Something went wrong, Usage: server, channel")
        }
    }


    if(command === "rainbow") {
        if(!message.member.hasPermission("ADMINISTRATOR"))
            return msg.error(message, "You must have the **`ADMINISTRATOR`** permission!")


        if(!message.guild.me.hasPermission("ADMINISTRATOR"))
            return msg.error(message, "I must have the **`ADMINISTRATOR`** permissions!")


        if(!message.member.guild.roles.find("name", args.join(" ")))
            return msg.error(message, "Usage: **`c!rainbow (role name)`**");


        if(!message.member.guild.roles.find("name", args.join(" ")))
            return msg.error(message, "Something went wrong");


        if(message.member.guild.roles.find("name", args.join(" ")).position >= message.guild.me.highestRole.position)
            return msg.error(message, "My highgest role must be higher than the mentioned role!")


        msg.success(message, "Successfully applied rainbow colors to **`" + args.join(" ") + "`**")

        client.colors[message.guild.name] = {
            guild: message.guild.id,
            role: args.join(" ")
        }



        fs.writeFile("./servers.json", JSON.stringify(client.colors, null, 4), err => {
            if(err) throw err;
        });
    }
});


//rgb junk copy pasted from stackoverflow since i was too lazy to code it myself
function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

const fennec_imgs = [
'./fennec/1.jpg',
'./fennec/2.jpg',
'./fennec/3.jpg',
'./fennec/4.jpg',
'./fennec/5.jpg',
'./fennec/6.jpg',
'./fennec/7.jpg',
'./fennec/8.jpg',
'./fennec/9.jpg',
'./fennec/10.jpg',
'./fennec/11.jpg',
'./fennec/12.jpg',
'./fennec/13.jpg',
'./fennec/14.jpg',
'./fennec/15.jpg',
'./fennec/16.jpg',
'./fennec/17.jpg',
'./fennec/18.jpg',
'./fennec/19.jpg',
'./fennec/20.jpg',
'./fennec/21.jpg',
'./fennec/22.jpg',
'./fennec/23.jpg',
'./fennec/24.jpg',
'./fennec/25.jpg',
'./fennec/26.jpg',
'./fennec/27.jpg',
'./fennec/28.jpg',
'./fennec/29.jpg',
'./fennec/30.jpg',
]

const rando_imgs = [
'./memes/meme1.jpg',
'./memes/meme2.jpg',
'./memes/meme3.jpg',
'./memes/meme4.jpg',
'./memes/meme5.jpg',
'./memes/meme6.jpg',
'./memes/meme7.jpg',
'./memes/meme8.jpg',
'./memes/meme9.jpg',
'./memes/meme10.jpg',
'./memes/meme11.jpg',
'./memes/meme12.jpg',
'./memes/meme13.jpg',
'./memes/meme14.jpg',
'./memes/meme15.jpg',
'./memes/meme16.jpg',
'./memes/meme17.jpg',
'./memes/meme18.jpg',
'./memes/meme19.jpg',
'./memes/meme20.jpg',
'./memes/meme21.jpg',
'./memes/meme22.jpg',
'./memes/meme23.jpg',
'./memes/meme24.jpg',
'./memes/meme25.jpg',
'./memes/meme26.jpg',
'./memes/meme27.jpg',
'./memes/meme28.jpg',
'./memes/meme30.jpg',
'./memes/meme31.jpg',
'./memes/meme32.jpg',
'./memes/meme33.jpg',
'./memes/meme34.jpg',
'./memes/meme35.jpg',
'./memes/meme36.jpg',
'./memes/meme37.jpg',
'./memes/meme38.jpg',
'./memes/meme39.jpg',
'./memes/meme40.jpg',
'./memes/meme41.jpg',
'./memes/meme42.jpg',
'./memes/meme43.jpg',
'./memes/meme44.jpg',
'./memes/meme45.jpg',
'./memes/meme46.jpg',
'./memes/meme47.jpg',
'./memes/meme48.jpg',
'./memes/meme49.jpg',
'./memes/meme50.jpg',
]

//server stats start





//Music commands start here






































//music cammands end here
//login with this shitty code
client.login('NDQ3MTc4NjY5NTU5OTA2MzI1.DeD4vA.QszGnK4IAf4Fj5uQvcBdIumK6vE');
