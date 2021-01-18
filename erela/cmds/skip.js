exports.run = (message, args, tools) => {
    if (!message.member.voice.channel) return message.reply('você precisa estar em um canal de voz!');
    const {player} = tools;
    
    if (player.state != "DISCONNECTED" && player.queue.totalSize > 0) player.stop();
    message.channel.send({embed: {
        color: 0xa900ff,
        title: 'Skippando...'
    }}).then(m => m.delete({timeout: 3000}));
};

exports.aliases = ["s", "pular"];

exports.help = (cmd) => {
	if (this.aliases.find(a => a == cmd)) return true;
};