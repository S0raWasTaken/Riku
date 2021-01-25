exports.run = (message, args, tools) => {
    
    const {player} = tools;
    
    if (!message.member.voice.channel) return message.channel.send({embed:{
        color: 0xff0000,
        title: "Você precisa estar conectado a um canal de voz"
    }});
    
    player.queue.shuffle();
    
    message.channel.send({embed:{
        color: 0xa900ff,
        title: "Embaralhado!"
    }});
};
exports.help = (cmd) => {
    if (this.aliases.find(a => a == cmd)) return true;
};
exports.aliases = ["random","aleatorio"];