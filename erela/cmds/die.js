exports.run = (message, args, tools) => {
    if (!message.member.voice.channel) return message.reply('você precisa estar conectado a um canal de voz!');
    const {player} = tools;
    if (player.state != "DISCONNECTED") {
        player.destroy();
        player.setQueueRepeat(false);
    }
    else return message.channel.send({embed:{
        color: 0xa900ff,
        title: "Não estou conectado"
    }});
    message.channel.send({embed: {
        color: 0xa900ff,
        title: 'Desconectado!'
    }}).then(m => m.delete({timeout: 3000}));
};

exports.aliases = ["disconnect", "sair", "leave", "morra", "desconectar"];

exports.help = (cmd) => {
	if (this.aliases.find(a => a == cmd)) return true;
};