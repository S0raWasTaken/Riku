const ms = require("ms");

exports.run = (member, maps) => {
    const mutedMap = maps.muted.get(member.id);
    if (mutedMap) {
        if (mutedMap.isMuted) {
            if (mutedMap.time){
                const time = mutedMap.time;
                const muterole = mutedmap.muterole;
                member.roles.add(muterole);
                member.send(
                    "Ops, parece que você tentou burlar o sistema de mute, \
                    pena que eu sou mais esperto do que parece.\n\
                    Infelizmente, tive que resetar seu tempo de mute, então espere "+ms(time)+
                    " até que você possa falar novamente no chat"
                );
                setTimeout(() => {
                    member.roles.remove(muterole);
                    member.send("Passando aqui pra avisar que seu mute foi removido, na próxima espere\
                     até o tempo do mute acabar!");
                }, time);
            } else {
                const muterole = mutedmap.muterole;
                member.roles.add(muterole);
                member.send(
                        "Ops, parece que você tentou burlar o sistema de mute \
                    pena que eu sou mais esperto do que parece.\n\
                    Seu tempo de mute é `indefinido`, portanto espere até que o moderador que te puniu remova-o"
                );
            }
        }
    }  
};