exports.run = (message, args, tools) => {
    if (!message.member.voice.channel) return message.channel.send({embed:{
        color: 0xa900ff,
        title: "Você precisa estar em um canal de voz!"
    }});
    
    const {player} = tools;
    
    if (!args[0]) return message.channel.send({embed:{
        color: 0xa900ff,
        title: "Insira a posição da música na queue"
    }});
    
    const num = parseInt(args[0]);
    if (isNaN(num)) return message.channel.send("Uh... números por favor?");
    if (player.queue.totalSize < num) return message.channel.send({embed:{
        color: 0xa900ff,
        title: `A queue tem somente \`${player.queue.totalSize}\` músicas`
    }});
    
    message.channel.send({embed:{
        color: 0xa900ff,
        title: `Música na posição \`${num}\` removida!`
    }});
    player.queue.remove(num);
};

exports.aliases = ["remover", "r"];

exports.help = (cmd) => {
	if (this.aliases.find(a => a == cmd)) return true;
};