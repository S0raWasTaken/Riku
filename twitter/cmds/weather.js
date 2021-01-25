const weather = require("weather-js");

exports.run = (tweet, args, client) => {
	const location = args.join(" ") || tweet.user.location;

	weather.find( { search: location, degreeType: "C" }, function (error, result) {

		if (error) {
			client.tweet(tweet, {
				in_reply_to_status_id: tweet.id_str,
				status: `@${tweet.user.screen_name} \n` + error
			});
			return;
		}
		if (!result[0]) {
			client.tweet(tweet, {
				in_reply_to_status_id: tweet.id_str,
				status: "@" + tweet.user.screen_name +" Algo deu errado ao executar a pesquisa, será que você especificou uma cidade válida no seu tweet ou no seu perfil?"
			});
			return;
		}
		const current = result[0].current;
		const location = result[0].location;

		var weatherinfo = {
			line1: `${current.skytext}`,
			line2: `Aqui está a previsão do tempo para ${current.observationpoint}:`,
			line3: `Fuso horário: UTC${location.timezone}`,
			line4: `Notação: Celsius °C`,
			line5: `Temperatura: ${current.temperature}°C`,
			line6: `Sensação Térmica: ${current.feelslike}°C`,
			line7: `Vento: ${current.winddisplay}`,
			line8: `Umidade: ${current.humidity}%`,
		};
		if (current.temperature >= 30) weatherinfo.line10 = `Calor da desgraça!`
		if (current.temperature < 30 && current.temperature >= 20) weatherinfo.line10 = `Tá marromeno`
		if (current.temperature < 20 && current.temperature >=10) weatherinfo.line10 = `Friozinho`
		if (current.temperature < 10) weatherinfo.line10 = `Alô bloco de gelo, tá perdendo`

		const {line1, line2, line3, line4, line5, line6, line7, line8, line10} = weatherinfo;

		client.tweet(tweet, {
			in_reply_to_status_id: tweet.id_str,
			status: `@${tweet.user.screen_name}\n${line2}\n${line1}\n${line3}\n${line4}\n${line5}\n${line6}\n${line7}\n${line8}\n\n${line10}`
		});
		client.like(tweet);
	});
};
exports.aliases = ["tempo", "previsao", "previsão", "clima"];

exports.help = (cmd) => {
	if (this.aliases.find(a => a == cmd)) return true;
};