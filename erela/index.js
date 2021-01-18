const { Client } = require("discord.js");
const { Manager } = require("erela.js");
const client = new Client();
const fs = require('fs');
const { safeLoad, safeDump } = require('js-yaml');
const maps = require("./maps.js").maps;
const {dateNow} = require("../handlers");

client.login(process.env.R0XAS_TOKEN);

client.manager = new Manager({
    nodes: [
        {
            host: process.env.LAVA_HOST,
            port: process.env.LAVA_PORT,
            password: process.env.LAVA_PASS,
        },
    ],
    send(id, payload) {
        const guild = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
  },
})
  .on("nodeConnect", node => console.log(`[INFO: ${dateNow()}] Node ${node.options.identifier} connected`))
  .on("nodeError", (node, error) => console.log(`[ERROR: ${dateNow()}] Node ${node.options.identifier} had an error: ${error.message}`))
  .on("trackStart", (player, track) => {
    client.channels.cache
      .get(player.textChannel)
      .send({embed:{
          color: 0xa900ff,
          title: `Tocando agora: **\`${track.title}\`**`,
          footer: {
			  text: `Pedido por: ${track.requester.tag}`
		  }
      }});
  })
  .on("trackError", async (player, track, payload) => {
      console.log(`[WARN: ${dateNow()}] ${track.title} had an error: ${payload.error}`);
      client.channels.cache.get(player.textChannel).send({embed: {
          color: 0xff0000,
          title: `${track.title} teve um erro, tentando novamente...`
      }}).then(m => m.delete({timeout: 3000}));
      const res = await client.manager.search(
            track.title,
            track.requester
        );
      
      const cmdfile = require("./cmds/play.js");
      cmdfile.runError(res, player, client);
  });
const prefixmap = new Map();
client.once("ready", () => {
  console.log(`[INFO: ${dateNow()}] Lavalink client started`);
  client.manager.init(client.user.id);
  
  const pjson = safeLoad(fs.readFileSync("./saves/prefix.yml"));
  const playlists = safeLoad(fs.readFileSync("./erela/Saves/playlists.yml"));
  
  for (var value in pjson) {
      prefixmap.set(value, pjson[value]);
  }
  for (value in playlists) {
	  maps.playlist.set(value, playlists[value]);
  }
  
});

client.on("raw", (d) => client.manager.updateVoiceState(d));

client.on('message', async message => {
    if (!message.guild) return;
    if (message.author.bot) return;
    const prefix = prefixmap.get(message.guild.id) || '/';
    if (!message.content.startsWith(prefix)) return;
    
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    var cmd = args.shift().toLowerCase();
    
    var tools;
    
    if (message.member.voice.channel) tools = {
        player: client.manager.create({
          guild: message.guild.id,
          voiceChannel: message.member.voice.channel.id,
          textChannel: message.channel.id,
          selfDeafen: true
        }),
        client: client,
		maps: maps,
		safeDump: safeDump,
		safeLoad: safeLoad,
		cmd: cmd
    };
    
    try {
            let dir = fs.readdirSync('./erela/cmds/');
            dir.forEach(file => {
                let script = require(`./cmds/${file}`);
                try {
                    if (script.aliases) {
                        if (script.help(cmd)) {
                            script.run(message, args, tools);
                            console.log(`[INFO: ${dateNow()}] ${cmd} foi utilizado no servidor ${message.guild.name}`);
                            return;
                        }
                    }
                } catch(e) {
                    console.log(`[ERROR: ${dateNow()}] NodeJS caught an exception:\n`+e);
                }
            })
            let commandFile = require(`./cmds/${cmd}.js`);
            commandFile.run(message, args, tools);
        } catch (e) {
            var commands = {};
            const scripts = fs.readdirSync('./erela/cmds/');
            scripts.forEach(script => {
                commands[script.split('.')[0]] = script.split('.')[0];
            })
            if (!commands[cmd]) return;
            console.log(`[ERROR: ${dateNow()}] NodeJS caught an exception:\n`+e);
            return;
        }
});


// Finished console.log("[INFO: date]")