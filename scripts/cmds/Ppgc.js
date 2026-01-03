module.exports = {
  config: {
    name: "ppgc",
    version: "1.0",
    author: "Freeze IO",
    role: 0,
    shortDescription: "Changer la photo de profil du groupe",
    longDescription: "Permet de changer la photo de profil du groupe en répondant à une image",
    category: "group"
  },

  onStart: async function ({ api, event }) {

    // 🔐 TON ID SEUL
    const owner = "61586092556175";
    if (event.senderID !== owner)
      return api.sendMessage(
        "❌ | Tu n'es pas autorisé à utiliser cette commande.",
        event.threadID,
        event.messageID
      );

    // 📎 Vérifier qu'on reply à une image
    if (
      !event.messageReply ||
      !event.messageReply.attachments ||
      event.messageReply.attachments[0].type !== "photo"
    ) {
      return api.sendMessage(
        "📌 | Répond à une IMAGE puis écris : ppgc",
        event.threadID,
        event.messageID
      );
    }

    const axios = require("axios");
    const fs = require("fs");
    const path = __dirname + "/cache/ppgc.jpg";
    const imgURL = event.messageReply.attachments[0].url;

    try {

      // ⬇️ Télécharger l'image
      const res = await axios.get(imgURL, { responseType: "arraybuffer" });
      fs.writeFileSync(path, Buffer.from(res.data));

      // 🖼️ Changer la photo du groupe
      await api.changeGroupImage(fs.createReadStream(path), event.threadID);

      api.sendMessage(
        "🇨🇮🇧🇪 | Photo de profil du groupe changée avec succès 🎯",
        event.threadID,
        event.messageID
      );

      fs.unlinkSync(path);

    } catch (e) {
      console.log(e);
      api.sendMessage(
        "❌ | Impossible de changer la photo du groupe.\n🔁 Réessaie avec une image valide.",
        event.threadID,
        event.messageID
      );
    }
  }
};
