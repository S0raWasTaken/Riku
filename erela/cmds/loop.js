exports.run = (message, args, tools) => {
    if (!message.member.voice.channel) return message.channel.send({embed:{
        color: 0xa900ff,
        title: "Você precisa estar em um canal de voz!"
    }});
    
    const {player} = tools;
    if (player.state == "DISCONNECTED") return message.channel.send({embed:{
        color: 0xa900ff,
        title: "Você precisa selecionar pelo menos uma música"
    }});
    
    if (player.queueRepeat === true) {
        player.setQueueRepeat(false);
        message.channel.send({embed:{
            color: 0xa900ff,
            title: "Loop desativado!"
        }});
        return;
    } else {
        player.setQueueRepeat(true);
        message.channel.send({embed:{
            color: 0xa900ff,
            title: "Loop ativado!"
        }});
    }
};

exports.aliases = ["repetir", "loopsong", "loopqueue"];

exports.help = (cmd) => {
	if (this.aliases.find(a => a == cmd)) return true;
};