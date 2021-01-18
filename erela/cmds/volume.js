exports.run = (message, args, tools) => {
    const {player} = tools;
    
    if (!args[0]) {
            message.channel.send({embed: {
            color: 0xa900ff,
            title: "Volume",
            description: player.volume + "%"
        }});
        return;
    }
    const num = args[0];
    if (isNaN(num)) return sendError("O valor indicado não é um número");
    if (num > 100 || num < 0) return sendError("Insira um valor entre 0 e 100");
    
    player.setVolume(num);
    message.channel.send({embed:{
        color: 0xa900ff,
        title: `Volume alterado para ${num}%`
    }});
}

exports.aliases = ["v", "vol"];

exports.help = (cmd) => {
  if (this.aliases.find(a => a == cmd)) return true;
}

function sendError(desc) {
    return message.channel.send({embed:{
        title: "Erro",
        color: 0xa900ff,
        description: desc
    }});
}

