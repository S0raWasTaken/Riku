const fs = require('fs');
const { dateNow } = require('../../handlers');
const dir = './erela/cmds/';
exports.run = (message) => {
    if (message.author.id != '319637457907875841') {
        return message.channel.send('Este comando é apenas para o S0ra');
    }
    const scripts = fs.readdirSync(dir);
    scripts.forEach(script => {
        delete require.cache[require.resolve(`./${script}`)];
    });
    console.log(`[INFO: ${dateNow}] Reloaded ErelaClient!`);
};