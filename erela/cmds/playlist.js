const {writeFileSync} = require("fs");
const _ = require("underscore");
const {dateNow} = require("../../handlers.js");
exports.run = (message, args, tools) => {
	const {player, cmd} = tools;
	const playlist = tools.maps.playlist;
	
	if (cmd == "playlists") {
		if (playlist.get(message.member.id)) {
			const arr = [];
			playlist.get(message.member.id).forEach(value => {
				arr.push(value.name + "\n- ");
			});
			arr.join(" ");
			message.channel.send({embed:{
				color: 0xa900ff,
				title: "Suas Playlists",
				description: `\`\`\`diff\n-  ${arr.join(" ").substring(0, arr.join(" ").length - 2)}\`\`\``
			}});
			
		} else {
			error("Você ainda não criou nenhuma playlist");
		}
		return;
	}
	
	if (args[0] == "create") {
		if (!args[1]) return error("Você não específicou um nome para a playlist");
		const name = args[1];
		if (!args[2]) return error("Você precisa especificar uma série de links, nomes de músicas ou links de playlists **separados por vírgula**");
		
		const tracks = args.slice(2).join(" ").trim().split(/,+/g);
		
		if (playlist.get(message.member.id)) {
			var arrobj = playlist.get(message.member.id);
			if (arrobj.find(obj => obj.name == name)) {
				arrobj = _.without(arrobj, _.findWhere(arrobj, {
					name: name
				}));
			}
			arrobj.push({
				name: name,
				tracks: tracks
			});
			playlist.set(message.member.id, arrobj);
		} else {
			const arrobj = [];
			arrobj.push({
				name: name,
				tracks: tracks
			});
			playlist.set(message.member.id, arrobj);
		}
		
		var obj = {};
		playlist.forEach((value, key) => {
			obj[key] = value;
		});
		const {safeDump} = tools;
		const content = safeDump(obj);
		writeFileSync("./erela/Saves/playlists.yml", content, "utf8", function (err) {
			if (err) console.log(`[ERROR: ${dateNow}] ErelaClient caught an exception:\n`+err);
		});
		
		var arr = [];
		tracks.forEach(track => {
			arr.push(track + "\n+");
		})
		
		message.channel.send({embed:{
			color: 0xa900ff,
			title: "Playlist Criada!",
			description: `Nome: ${name}\nConteúdo:\n\`\`\`diff\n+  ${arr.join(" ").substring(0, arr.join(" ").length - 2).trim()}\`\`\``
		}});
		return;
	}
	
	if (args[0] == "delete") {
		if (!playlist.get(message.member.id)) return error("Você não tem playlists criadas");
		
		if (!args[1]) {
			error("Você precisa especificar o nome de uma das suas playlists");
			return;
		}
		
		const playlists = playlist.get(message.member.id);
		const name = args[1];
		if (!playlists.find(obj => obj.name == name)) {
			error(`Não existe uma playlist sua com o nome ${name}`);
			return;
		} else {
			var newarrobj = _.without(playlists, _.findWhere(playlists, {
				name: name
			}))
			
			const {safeDump} = tools;
			var obj = {};
			playlist.set(message.member.id, newarrobj);
			playlist.forEach((value, key) => {
				obj[key] = value;
			});
			const content = safeDump(obj);
			writeFileSync("./erela/Saves/playlists.yml", content, "utf8", function (err) {
				if (err) console.log(`[ERROR: ${dateNow}] ErelaClient caught an exception:\n`+err);
			});
			
			message.channel.send({embed:{
				color: 0xa900ff,
				title: "Playlist deletada!",
				description: `Playlist com nome \`${name}\` foi deletada com sucesso`,
				timestamp: new Date()
			}});
		}
		return;
	}
	message.channel.send({embed:{
			color: 0xa900ff,
			title: "Uso:",
			fields: [
				{	name: "/playlist create", value: "Incia o criador de playlist\nArgumentos: `playlist create <nome> [Lista de nomes/links de músicas ou playlists separados por vírgulas]`\nO nome da playlist não pode conter espaços!" },
				{	name: "/play --<playlist>", value: "Toca uma playlist já salva\nExemplo: `/play --rock`"},
				{	name: "/playlists", value: "Mostra suas playlists criadas"},
				{	name: "/playlist delete", value: "Deleta uma playlist criada\nArgumentos: `playlist delete <nome>`"}
			],
			footer: {
				text: "© S0ra - 2020"
			},
			timestamp: new Date()
		}});
	function error(msg) {
		message.channel.send({embed:{
			color: 0xff0000,
			title: "Erro",
			description: msg
		}});
	}
};

exports.help = (cmd) => {
	if (this.aliases.find(a => a == cmd)) return true;
};

exports.aliases = ["list", "playlists"];