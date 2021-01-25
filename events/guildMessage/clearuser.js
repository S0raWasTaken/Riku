exports.run = (_client, message, args, tools) => {
    const {member, sendError, socket} = tools;
    const num = (args[1]) ? parseInt(args[1]): sendError(message, "");
    
    if (!message.member.hasPermission("MANAGE_MESSAGES", "ADMINISTRATOR")) 
        return sendError(message, "Você precisa da permissão `MANAGE_MENTIONS`");
    if (!member) return sendError(message, "Mencione alguém ou utilize um ID de usuário neste comando");
    if (!num) num = 100;
    if (isNaN(num)) return sendError(message, "Números por favor?");

    socket(`call clearuser ${message.channel.id},${message.guild.id} ${num}`);
};

exports.aliases = ["limparuser", "limparusuario", "limparusuário", "userclean"];