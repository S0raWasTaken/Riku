exports.run = (_client, message, args, tools) => {
    const {member, socket, sendError} = tools;
    if (!message.member.hasPermission("KICK_MEMBERS", {checkAdmin: true, checkOwner: true})) 
        return sendError(message, "Você precisa da permissão `KICK_MEMBERS`");
    if (!member) 
        return sendError(message, "Mencione ou utilize o ID de usuário do infrator");
    if (!message.guild.me.hasPermission("KICK_MEMBERS", {checkAdmin: true, checkOwner: true})) 
        return sendError(message, "Não tenho a permissão `KICK_MEMBERS no servidor!`");
    const reason = (args[1]) ? args.slice(1).join(" ") : "";
    
    socket(`call kick ${message.channel.id},${message.guild.id} ${member.id} ${reason}`);

};

exports.aliases = ["kickar", "expulsar"];