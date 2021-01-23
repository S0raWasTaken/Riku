require("dotenv").config();
const {Client} = require("discord.js");
const client = new Client({disableMentions: "everyone"});
const {readFileSync, readdirSync} = require("fs");
const functions = require("./functions.js").functions();
const {createInterface} = require("readline");
const {messageHandler, memberAddHandler, consoleHandler, socketHandler, dateNow} = require("./handlers.js");
const {exec} = require("child_process");
const maps = require("./maps.js");

console.log(`[INFO: ${dateNow()}] NodeJS server started in port ${process.env.PORT}`);

const child = exec('"java" -jar java/R0xas.jar 32567', (error, stdout, stderr) => {
    if (stdout) console.log(stdout);
    if (error) console.log(error);
    if (stderr) console.log(stderr);
});
child.stdout.on("data", (chunk) => console.log(chunk));
require("./erela/index.js");
require("./twitter/twitter.js");
createInterface({
    input: process.stdin,
    output: process.stdout
}).on("line", input => {
    var args = input.trim().split(" "), cmd = args.shift().toLowerCase();
    consoleHandler(cmd, args, child);
});

client.login(process.env.R0XAS_TOKEN);  // Change to RIKU_TOKEN

client.once("ready", () => {

    console.log(`[INFO: ${dateNow()}] Logged in with ${client.user.tag}`);
    console.log(`[INFO: ${dateNow()}] Counting ${client.users.cache.size} users`);
    console.log(`[INFO: ${dateNow()}] Listening to ${client.channels.cache.size} channels`);
    console.log(`[INFO: ${dateNow()}] Watching ${client.guilds.cache.size} guilds`);

    let activities = [
        `Me marque para obter ajuda`,
        `Estou em ${client.guilds.cache.size} servidores!`,
        `${client.users.cache.size} usuários no cache`,
        `NUNCA deixe árvores flutuando no minecraft`,
        `Você pode usar o comando /invite no meu privado`,
        `Sou um bot feito em Java e JavaScript`
    ],
    i = 0;
    setInterval( () => client.user.setActivity(`${activities[i++ % activities.length]}`, {
        type: "CUSTOM_STATUS"
    }), 1000 * 5);

    genMap("./saves/");
});

client.on("error", error => console.log(`[ERROR: ${dateNow()}] Discord client caught an exception:\n`+error));
client.on("warn", warn => console.log(`[WARN: ${dateNow()}] Discord client caught a warn:\n`+warn));

client.on("guildMemberAdd", member => {
    memberAddHandler(member, maps);
});

client.on("message", message => {
    const prefix = "/";
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    var args = message.content.slice(prefix.length).trim().split(/ +/g),
    cmd = args.shift().toLowerCase(),
    member = (message.mentions) ? message.mentions.members.first():
        message.guild.members.cache.get(args[0]);

    tools = Object.assign({
        Discord: require("discord.js"),
        cmd: cmd,
        member: member,
        map: maps,
        child: child,
        socket: socketHandler
    }, functions);

    if (!message.guild) {
        messageHandler("./events/directMessage", client, message, args, tools);
        return;
    }

    messageHandler("./events/guildMessage", client, message, args, tools);
});

function genMap(path) {
    const dir = readdirSync(path);
    dir.forEach(file => {
        const content = safeLoad(readFileSync(path+file));
        const name = file.split(".")[0];
        const mapRelated = maps[name];
        for (var value in content) {
            mapRelated.set(value, content[value]);
        }
    });
}