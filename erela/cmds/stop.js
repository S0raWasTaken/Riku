exports.run = (message, args, tools) => {
    if (!message.member.voice.channel) return message.reply('você precisa estar num canal de voz!');
    const {player} = tools;
    
    if (player.playing && !player.paused) player.pause(true);
    message.channel.send({embed:{
        color: 0xa900ff,
        title: 'Pausado!'
    }}).then(m => m.delete({timeout: 3000}));
};

exports.aliases = ["pause", "parar", "st"];

exports.help = (cmd) => {
	if (this.aliases.find(a => a == cmd)) return true;
};