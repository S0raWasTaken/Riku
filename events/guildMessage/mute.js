const ms = require("ms");

exports.run = async(_client, message, args, tools) => {
    const {sendError, member, sendReply, map} = tools;

    if (!member) return sendError(message, "Por favor mencione um membro ou utilize um ID de usuário");
    if (!message.member.hasPermission("KICK_MEMBERS"))
        return sendError(message, "Você precisa da permissão `KICK_MEMBERS`");
    if (member.hasPermission("KICK_MEMBERS"))
        return sendError(message, "O usuário não pode ser mutado");
    
        let muterole = message.guild.roles.cache.find(role => role.name === 'Mutado');
        if (!muterole) {
            await message.channel.send('Criando o cargo `Mutado`...').then(msg => msg.edit('o cargo `Mutado` foi criado com sucesso! Por favor, utilize este comando novamente para mutar o usuário',{timeout: 3000}));
            setTimeout(() => {
                message.guild.roles.create({
                    data: {
                        name: 'Mutado',
                        color: 'BLACK',
                    },
                });
            }, 1000);
            return;
        }
        message.guild.channels.cache.forEach(async(channel) => {
            if (!channel.permissionsFor(bot.user.id).has('MANAGE_CHANNEL')) return;
            if (!channel.permissionsFor(muterole).has('SEND_MESSAGES')) return;
            await channel.updateOverwrite(message.guild.roles.cache.find(role => role.name === 'Mutado').id, { SEND_MESSAGES: false, SPEAK: false });
        }); 
        const time = args[1];
        if (!time) {
            await member.roles.add(muterole.id);
            sendReply(message, `${member.displayName} foi mutado por \`TEMPO INDEFINIDO\``);
            return;
        }
        await member.roles.add(muterole.id)
            .then(() => {
                sendReply(message, `${member.displayName} foi mutado por \`${ms(ms(time))}\``);
            })
            .catch(() => {
                sendError(message, "Acesso negado, provavelmente eu não tenho a permissão `MANAGE_ROLES`");
            });
        map.muted.set(member.id, {
            isMuted: true,
            time: ms(time),
            muterole: muterole.id
        });
        setTimeout(() => {
            map.muted.set(member.id, {
                isMuted: false
            });
            member.roles.remove(muterole.id);
        }, ms(time));
}