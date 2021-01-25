exports.run = (tweet, args, client) => {
	client.tweet(tweet, {
		in_reply_to_status_id: tweet.id_str,
		status: `@${tweet.user.screen_name} Calma aí, ainda tô montando esse comando`
	});
};

exports.aliases = ["ajuda", "hlp", "ajd"];

exports.help = (cmd) => {
	if (this.aliases.find(a => a == cmd)) return true;
};