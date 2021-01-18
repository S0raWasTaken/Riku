exports.like = (tweet) => {
	const t = tweet.t;
	t.post("favorites/create", {id: tweet.id_str}, (err) => {
		if (err) console.log(err);
	});
};

exports.retweet = (tweet) => {
	const t = tweet.t;
	t.post("statuses/retweet/:id", {id: tweet.id_str}, (err) => {
		if (err) console.log(err);
	});
};

exports.tweet = (tweet, object) => {
	const t = tweet.t;
	if (!object) return console.log("S0ra seu jumento, vc não colocou uma mensagem nesse tweet!!!!");
	t.post("statuses/update", object, (err) => {
		if (err) console.log(err);
	});
};