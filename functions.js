exports.functions = () => {
    const sendMessage = (message, str) => {
        message.channel.send(str);
    };
    const sendError = (message, str) => {
        message.channel.send({embed:{
            color: 0xa900ff,
            title: "ERRO",
            description: str
        }, replyTo: message});
    };
    const sendReply = (message, str, options) => {
        if (options) {
            if (options.embed) {
                message.channel.send({embed:{
                    color: 0xa900ff,
                    title: str
                }, replyTo: message});
            }
        } else {
            message.channel.send(str, {replyTo: message});
        }
    };
    const sendEmbed = (message, obj, options) => {
        if (options) {
            if (options.reply) {
                message.channel.send({embed:obj, replyTo: message});
            }
        } else {
            message.channel.send({embed:obj});
        }
    };
    const functions = {
        sendEmbed: sendEmbed,
        sendMessage: sendMessage,
        sendReply: sendReply,
        sendError: sendError
    };
    return functions;
};
