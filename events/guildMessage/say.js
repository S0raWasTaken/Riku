exports.run = (_client, message, args, tools) => {
    const {socket} = tools;
    message.delete();
    if (!args[0]) return message.channel.send("Nada a ser dito...").then(m => m.delete({timeout: 3000}));
    
    socket(`call say ${message.channel.id},${message.guild.id} ${args.join()}`);
};

exports.aliases = ["fale", "fala", "diga"];