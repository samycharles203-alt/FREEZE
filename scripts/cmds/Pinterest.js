const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "pinterestv2",
    aliases: ["pinv2", "pins"],
    version: "1.1",
    author: "Aesther",
    countDown: 5,
    role: 0,
    shortDescription: { fr: "🔍 Recherche d'images Pinterest v2" },
    longDescription: {
      fr: "Recherche stylisée sur Pinterest. Réponds avec un chiffre (1-10) ou \"all\" pour tout recevoir."
    },
    category: "🌐 Internet",
    guide: { fr: "{pn} <mot-clé>" }
  },

  onStart: async function ({ message, args, event }) {
    const query = args.join(" ");
    if (!query) return message.reply("❗ Veuillez entrer un mot-clé.\nExemple : `pinv2 nayeon`");

    try {
      const res = await axios.get(`https://delirius-apiofc.vercel.app/search/pinterestv2?text=${encodeURIComponent(query)}`);
      const results = res.data.data;

      if (!results.length) return message.reply("❌ Aucun résultat trouvé.");

      const sliced = results.slice(0, 10);

      let text = `🔎 𝗥𝗘𝗦𝗨𝗟𝗧𝗔𝗧𝗦 𝗣𝗜𝗡𝗧𝗘𝗥𝗘𝗦𝗧\n───────────────\n`;
      sliced.forEach((item, i) => {
        text += `🔢 ${i + 1}. ${item.title || "Sans titre"}\n👤 ${item.name} | ❤️ ${item.likes} | 📅 ${item.created_at}\n───────────────\n`;
      });
      text += "➡️ Réponds avec un **chiffre (1-10)** ou **\"all\"** pour tout recevoir.";

      const msg = await message.reply(text);

      global.GoatBot.onReply.set(msg.messageID, {
        commandName: this.config.name,
        author: event.senderID,
        results: sliced
      });

    } catch (err) {
      console.error("❌ Pinterest Error:", err);
      message.reply("⚠️ Une erreur est survenue lors de la recherche.");
    }
  },

  onReply: async function ({ message, event, Reply }) {
    const { author, results } = Reply;

    if (event.senderID !== author) return;

    const input = event.body.toLowerCase();

    if (input === "all") {
      try {
        const attachments = [];
        for (let i = 0; i < results.length; i++) {
          const url = results[i].image;
          const tempPath = path.join(__dirname, "cache", `pin_all_${i + 1}.jpg`);
          await global.utils.downloadFile(url, tempPath);
          attachments.push(fs.createReadStream(tempPath));
        }

        await message.reply({
          body: `📥 Voici les ${results.length} images demandées :`,
          attachment: attachments
        });

        // Nettoyage
        for (const file of attachments) fs.unlinkSync(file.path);

      } catch (err) {
        console.error("❌ Error sending all images:", err);
        return message.reply("⚠️ Erreur lors de l’envoi des images.");
      }
      return;
    }

    // Sinon: sélection individuelle
    const choice = parseInt(input);
    if (isNaN(choice) || choice < 1 || choice > results.length) {
      return message.reply("❗ Envoie un chiffre entre 1 et 10 ou `all`.");
    }

    const item = results[choice - 1];
    const imageUrl = item.image;
    const filePath = path.join(__dirname, "cache", `pin_${Date.now()}.jpg`);

    try {
      await global.utils.downloadFile(imageUrl, filePath);
      await message.reply({
        body: `📌 𝗧𝗜𝗧𝗥𝗘 : ${item.title}\n👤 ${item.name} (${item.username})\n❤️ ${item.likes} | 📅 ${item.created_at}`,
        attachment: fs.createReadStream(filePath)
      });
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error("❌ Image Download Error:", err);
      message.reply("⚠️ Impossible de télécharger l'image.");
    }
  }
};
