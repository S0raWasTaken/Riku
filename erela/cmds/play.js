exports.run = async(message, args, tools) => {
    if (!message.member.voice.channel) return message.reply('você precisa estar num canal de voz!');
    const {player, client} = tools;
	const playlist = tools.maps.playlist;
    
    if (player.paused) {
        player.pause(false);
        message.channel.send({embed:{
            color: 0xa900ff,
            title: "Continuando..."
        }}).then(m => m.delete({timeout: 3000}));
		if (!args[0]) return;
    }
   
    if (!args[0] && !player.paused) return message.channel.send({embed:{
        color: 0xa900ff,
        title: "Por favor, insira uma música para eu pesquisar"
    }});
	
	var res;
	
	if (args[0].startsWith("--")) {
		
		const name = args[0].slice(2);
		const playlists = playlist.get(message.member.id);
		
		if (!name) return error("Uh..")
		if (!playlists) return error("Você não tem playlists criadas");
		if (!playlists.find(obj => obj.name == name)) return error("Não existe uma playlist sua com o nome "+name);
		
		if (!player.playing && !player.paused) player.connect();
		
		playlists.find(obj => obj.name == name).tracks.forEach(async (track) => {
			res = await client.manager.search(
				track,
				message.author
			);
			if (res.loadType == "PLAYLIST_LOADED") {
				res.tracks.forEach(track => {
					player.queue.add(track);
				});
			} else {
				player.queue.add(res.tracks[0]);
			}
		});
		
		message.channel.send({embed:{
			color: 0xa900ff,
			title: `Enfileirando: \`Playlist pessoal: ${name}\``
		}});
		setTimeout(() => {
			if (!player.playing && !player.paused)
				player.play();
		}, 4000);
		return;
	}
	
    res = await client.manager.search(
            args.join(' '),
            message.author
    );
    if (args[0].toLowerCase() == 'lofi') {
        res = await client.manager.search(
                "https://www.youtube.com/watch?v=5qap5aO4i9A",
                message.author
        );
    }
    
    if (!player.playing && !player.paused) player.connect();
    
    if (res.loadType == "PLAYLIST_LOADED") {
        
        res.tracks.forEach(track => {
            player.queue.add(track);
        })
        message.channel.send({embed:{
            color: 0xa900ff,
            title: `Enfileirando: \`${res.playlist.name}\`...`,
            timestamp: new Date(),
            footer: {
                text: `${res.tracks.length} músicas adicionadas a queue`,
            }
        }});
    } else {
        player.queue.add(res.tracks[0]);
        
        message.channel.send({embed:{
            color: 0xa900ff,
            title: `Enfileirando: \`${res.tracks[0].title}\`...`
        }});
    }
  
    if (!player.playing && !player.paused && !player.queue.size)
		player.play();
	if (
		!player.playing &&
		!player.paused &&
		player.queue.totalSize === res.tracks.length
	)
		player.play();
		
	function error(msg) {
		message.channel.send({embed:{
			color: 0xff0000,
			title: "Erro",
			description: msg
		}});
	}
};
exports.runError = (res, player, client) => {
    if (player.state == "DISCONNECTED") player.connect();
    player.queue.add(res.tracks[1]);
    client.channels.cache.get(player.textChannel).send({embed: {
        color: 0xa900ff,
        title: `Tentando enfileirar: ${res.tracks[1].title}`
    }}).then(m => m.delete({timeout: 5000}));
    
    if (!player.playing && !player.paused && !player.queue.size)
		player.play();
	if (
		!player.playing &&
		!player.paused &&
		player.queue.totalSize === res.tracks.length
	)
		player.play();
};

exports.aliases = ["p", "resume", "resumir", "continue"];

exports.help = (cmd) => {
	if (this.aliases.find(a => a == cmd)) return true;
};