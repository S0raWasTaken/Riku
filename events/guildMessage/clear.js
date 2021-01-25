exports.run = (_client, message, args, tools) => {
    const {sendError, socket} = tools;

    if (!message.member.hasPermission("MANAGE_MESSAGES", "ADMINISTRATOR")) 
        return sendError(message, "Você precisa da permissão `MANAGE_MESSAGES`");
    if (!args[0]) 
        return sendError(message, "Preciso do número de mensagens para apagar\nMáximo: `10.000`");

    const num = parseInt(args[0]);

    if (isNaN(num)) return sendError(message, "Números por favor?");

    socket(`call clear ${message.channel.id},${message.guild.id} ${num}`);
};

exports.aliases = ["limpar", "limpa", "apagar", "clean"];