const fs = require("fs-extra");
const { getPrefix } = global.utils;
module.exports = {
  config: {
    name: "help",
    version: "1.0",
    author: "Samy Charles",
    role: 0,
    shortDescription: { en: "Show kawaii AESTHER menu" },
    longDescription: { en: "Display all available commands in a super kawaii aesthetic style 🌸✨" },
    category: "info",
    guide: { en: ".help" }
  },

  onStart: async function({ api, event, message, role }) {
    const prefix = await getPrefix(event.threadID);
    const userName = event.senderName || "User";
    const myName = "Samy Charles";
    const myUID = "61582382664051";

    // Build command categories
    const categories = {};
    for (const [name, cmd] of global.GoatBot.commands) {
      if (cmd.config.role > role) continue;
      const cat = cmd.config.category || "Misc";
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(name);
    }

    // Build kawaii aesthetic menu
    let msg = `
╭━━〔 🌸✨ ﹝🇧🇪🇨🇮𝗙𝗥𝗘𝗘𝗭𝗘 𝗜𝗢𝟮.𝟬🇨🇮🇧🇪﹞ 〕━━┈⊷
┃🪐╭───────────────────────────
┃🪐│ 🤖 BOT : 𝗔𝗘𝗦𝗧𝗛𝗘𝗥 🌸
┃🪐│ 👤 USER : ⵌ︳「${userName}」
┃🪐│ 👑 OWNER : ${myName} | ${myUID} 🌸✨
┃🪐│ 💻 DEV : ${myName} 🪐
┃🪐│ 🧬 VERSION : 2.0 Kawaii
┃🪐│ 🌍 MODE : Public 🍀
┃🪐│ ⚙️ PREFIX : [ ${prefix} ] 🌸
┃🪐╰───────────────────────────
╰━━━━━━━━━━━━━━━━━━━━━━━━━━┈⊷

╭━━〔 🪐 COMMAND CATEGORIES 🌸✨ 〕━━┈⊷
`;

    Object.keys(categories).sort().forEach(cat => {
      msg += `┃🪐│ ✧ ${cat.toUpperCase()} 🍀\n`;
      categories[cat].sort().forEach(cmdName => {
        msg += `┃🪐│    ➳ ${cmdName} \n`;
      });
      msg += "┃🪐│ ────────────────────────\n";
    });

    msg += `
╰━━━━━━━━━━━━━━━━━━━━━━━━━━┈⊷
💌 Powered by ${myName} 🌸✨🪐
`;

    return message.reply(msg);
  }
};
