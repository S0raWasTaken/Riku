const { dateNow, socketHandler } = require("../../handlers");

exports.run = async (_cmd, _args, child) => {
    console.log(`[INFO: ${dateNow()}] Killing child process Riku@Java`);
    socketHandler("stop");
    console.log(`[INFO: ${dateNow()}] Exiting...`);
    setTimeout(() => {
        console.log(`[INFO: ${dateNow()}] Goodbye`);
        process.exit(0);
    },2000);
}