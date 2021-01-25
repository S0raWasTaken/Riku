exports.run = (tweet, args, client) => {
	if (!args[0]) {
		client.tweet(tweet, {
			in_reply_to_status_id: tweet.id_str,
			status: `@${tweet.user.screen_name} Não posso escrever um tweet em branco`
		});
		return;
	}
	if (isValidUrl(args) || args.join(" ").includes("http") || args.join(" ").includes("www") || args.join(" ").includes(".com")) {
		client.tweet(tweet, {
			in_reply_to_status_id: tweet.id_str,
			status: `@${tweet.user.screen_name} Não permito links nas mensagens`
		});
		return;
	}
	
	const message = args.join(" ");
	client.tweet(tweet, {
		in_reply_to_status_id: tweet.id_str,
		status: `@${tweet.user.screen_name} ${message}`
	});
	
	client.like(tweet);
};

exports.aliases = ["fale", "falar", "escreva", "diga", "mande", "talk"];

exports.help = (cmd) => {
	if (this.aliases.find(a => a == cmd)) return true;
};

function isValidUrl(arr) {
	var i = 0;
	arr.forEach(str => {
		try {
			new URL(str);
			i = 1;
		} catch (_) {
			return false;
		}
	});
	if (i == 1) {
		return true;
	} else {
		return false;
	}
}