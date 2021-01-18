exports.run = async (_client, message, _args, tools) => {
    const {socket} = tools;
    const ping = await message.channel.send('Ping?');
    ping.edit(`Pong!\nRiku@JS retornou com ${ping.createdTimestamp - message.createdTimestamp}ms.`)

    socket(`call ping ${message.channel.id},${message.guild.id}`);
}