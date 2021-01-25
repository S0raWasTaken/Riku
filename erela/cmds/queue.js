exports.run = async (message, args, tools) => {
    const {player} = tools;
    console.log(player.queue);
};