const {readdirSync} = require("fs");
const keys = {
    consumer_key:process.env.CONSUMER_KEY,
    consumer_key_secret:process.env.CONSUMER_KEY_SECRET,
    access_token:process.env.ACCESS_TOKEN,
    access_token_secret:proccess.env.ACCESS_TOKEN_SECRET
}
const twit = require("twit");
const {dateNow} = require("../handlers.js");

const Twitter = new twit(keys);

const client = Twitter.stream("statuses/filter", {track: "#s0rabot"});
console.log(`[INFO: ${dateNow()}] S0ra@Twitter has logged in`);

const main = require("./functions.js");

client.on("tweet", tweet => {
	tweet.t = Twitter;
	const prefix = "#s0rabot ";
	const args = tweet.text.slice(prefix.length).trim().split(/ +/g);
	const cmd = args.shift().toLowerCase();

		try {
            let dir = readdirSync('./twitter/cmds/');
            dir.forEach(file => {
                let script = require(`./cmds/${file}`);
                try {
                    if (script.aliases) {
                        if (script.help(cmd)) {
                            script.run(tweet, args, main);
                            console.log(`[INFO: ${dateNow()}] ${cmd} was called by @${tweet.user.screen_name}`);
                            return;
                        }
                    }
                } catch(e) {
                    console.log(`[ERROR: ${dateNow()}] Twitter@Riku caught an exception:\n`+e);
                }
            })
            let commandFile = require(`./cmds/${cmd}.js`);
            commandFile.run(tweet, args, main);
        } catch (e) {
            var commands = {};
            const scripts = readdirSync('./twitter/cmds/');
            scripts.forEach(script => {
                commands[script.split('.')[0]] = script.split('.')[0];
            });
            if (!commands[cmd]) return;
            console.log(`[ERROR: ${dateNow()}] Twitter@Riku caught an exception:\n`+e);
            return;
        }
		console.log(`[INFO: ${dateNow()}] ${cmd} was called by @${tweet.user.screen_name}`);
});