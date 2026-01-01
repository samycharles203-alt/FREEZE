module.exports = {
  config: {
    name: "prefix",
    aliases: ["p"],
    version: "1.0",
    author: "Samy",
    countDown: 2,
    role: 0,
    description: {
      fr: "Affiche le préfixe du bot avec le style esthétique"
    },
    category: "info"
  },

  onStart: async function ({ message, event }) {
    const prefix = global.GoatBot.config.prefix || "!";
    const now = new Date();
    const date = now.toLocaleDateString("fr-FR");
    const time = now.toLocaleTimeString("fr-FR");

    const msg = 
`🇨🇮🇧🇪 ── 🇨🇮 ﹝ 𝗙𝗥𝗘𝗘𝗭𝗘 𝗜𝗢𝟮.𝟬﹞ 🇨🇮 ── 🇧🇪🇨🇮
💬 Préfixe actuel : 『 ${prefix} 』
📅 Date : ${date}
⏰ Heure : ${time}
🎀 Utilise ce préfixe pour m'appeler !
💌 Merci de m’avoir invoqué 💖`;

    return message.reply(msg);
  },

  // Permet d'afficher le prefix même sans préfixe
  onChat: async function ({ event, message }) {
    const text = event.body?.toLowerCase()?.trim();
    if (text === "prefix" || text === "p") {
      return this.onStart({ message, event });
    }
  }
};
