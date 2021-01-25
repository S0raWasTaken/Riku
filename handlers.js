const {readdirSync, readFileSync} = require("fs");
const datagramServer = require("dgram");
exports.messageHandler = (path, client, message, args, tools) => {
    const dir = readdirSync(path), {cmd} = tools;

    try {
        dir.forEach(c => {
            if (c.aliases) {
                if (help(c, cmd)) {
                    c.run(client, message, args, tools);
                }
            }
        });

        const cmdFile = require(`${path}/${cmd}.js`);
        cmdFile.run(client, message, args, tools);
    } catch(e) {
        if (!dir.find(c => c == `${cmd}.js`)) return;
        else console.log(e);
    }
};
exports.memberAddHandler = (member) => {
    const dir = readdirSync("./events/memberAdd");

    try {
        dir.forEach(c => {
            c.run(member);
        });
    } catch(e) {
        console.log(e);
    }
};

exports.consoleHandler = (cmd, args, child) => {
    const cmdFile = require(`./events/consoleCommand/${cmd}.js`);
    
    try {
        cmdFile.run(cmd, args, child);
    } catch(e) {
        const dir = readdirSync("./events/consoleCommand");
        if (!dir.find(a => a == cmd)) return console.log("Comando desconhecido, utilize help para ver a lista de comandos");
        else console.log(e);
    }
};

exports.socketHandler = (msg) => {
    const client = datagramServer.createSocket("udp4");
    client.send(msg, 0, msg.length, 32567, "localhost", (err) =>{ 
        if(err) throw err; 
    });
}

exports.dateNow = () => {
    return new Date().toISOString().split(".")[0].split(/T+/g)[1];
}

function help(c, cmd) {
    if (c.aliases.find(a => a==cmd)) return true;
    else return false;
}

