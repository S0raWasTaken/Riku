exports.run = (_client, message, args, tools) => {
    const {member, Discord, socket, sendError} = tools;

    if (!message.member.hasPermission("BAN_MEMBERS", "ADMINISTRATOR")) 
        return sendError(message, "Você precisa da permissão `BAN_MEMBERS`");
    if (!member) 
        return sendError(message, "Mencione ou utilize o ID de usuário do infrator");
    if (!message.guild.me.hasPermission("BAN_MEMBERS", "ADMINISTRATOR")) 
        return sendError(message, "Não tenho a permissão `BAN_MEMBERS` no servidor!")
    if (member.id == message.member.id) 
        return sendError(message, "Você não pode banir você mesmo");
    if (member.id == message.guild.owner.id) 
        return sendError(message, "Você não pode banir o dono do servidor");

    message.guild.roles.cache.array();
    var role2 = message.member.roles.highest;
    var role1 = member.roles.highest;
    var botrole = message.guild.me.roles.highest;

    if (role1.position > role2.position || role1.position == role2.position || message.member.id !== message.guild.owner.id) return
        sendError(message, "Você não pode banir alguém igual, acima do seu cargo");
    if (botrole.position < role1.position) 
        return sendError(message, "Não posso banir este usuário, meu cargo está abaixo dos cargos dele");

    const reason = (args[1]) ? args.slice(1).join(" "): "";


    const bamido = new Discord.MessageEmbed()
            .setColor('#ffffff')
            .setTitle('**BANIDO**')
            .setDescription(`**${member.displayName} Foi BANIDO**\n**Motivo: ${jegue}**`)
            .setImage('https://cdn.discordapp.com/attachments/704090595215540344/729282016985743440/ezgif.com-video-to-gif.gif')
            .setFooter('ID do usuário: '+member.id)
            .setTimestamp();

    const msg = await message.reply(`Certeza de que quer banir <@${member.id}>?`);
        const filter = (reaction, user) => {
            return ['✅', '❌', '🔰'].includes(reaction.emoji.name) && user.id === message.author.id;
            };
        msg.react('✅').then(() => {msg.react('❌').then(() => {msg.react('🔰')})});
        msg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
            .then(collected => {
                const reaction = collected.first();
                if (reaction.emoji.name == '✅') {
                    message.delete();
                    msg.delete();
                    member.ban({reason: reason}).then(() => {
                        message.channel.send(bamido);
                        socket(`call ban ${message.channel.id},${message.guild.id} ${member.id} ${reason}`);
                    }).catch(() => {
                        message.reply("Acesso Negado. Me falta a permissão `BAN_MEMBERS` ou o usuário não pode ser banido");
                    });
                }
                if (reaction.emoji.name == '❌') {
                    message.delete();
                    msg.delete();
                    message.channel.send('hm').then(m => m.delete({ timeout: 3000 }));
                }
                if (reaction.emoji.name == '🔰') {
                    message.delete();
                    msg.delete();
                    bamido.setTitle('**BAMIDO**').setDescription(`**${member.displayName} Foi BAMIDO**\n**Motivo: ${jegue}**`).setImage('https://cdn.discordapp.com/attachments/540668620565512244/729309959569014784/BAMIDO.gif');
                    message.channel.send(bamido);
                }
            })
};

exports.aliases = ["banir"];