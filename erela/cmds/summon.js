exports.run = (message, args, tools) => {
	if (!message.member.voice.channel) {
		message.reply("Você precisa estar em um canal de voz");
		return;
	}
	const {player} = tools;
	player.connect();

	message.channel.send({embed:{
		color: 0xa900ff,
		title: `Conectado!`,
		timestamp: new Date()
	}});
};

exports.aliases = ["join", "entrar", "connect", "j"];

exports.help = (cmd) => {
	if (this.aliases.find(a => a==cmd)) return true;
};
