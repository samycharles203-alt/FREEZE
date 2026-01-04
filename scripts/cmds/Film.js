const axios = require("axios");

module.exports = {
  config: {
    name: "film",
    aliases: ["movie", "serie"],
    version: "1.0",
    author: "FREEZE IO2.0",
    role: 0,
    countDown: 2,
    description: "Infos d’un film ou série via OMDb API",
    category: "info"
  },

  onStart: async function ({ message, args }) {

    const API_KEY = "46873ae"; // 🔑 TA CLÉ OMDb

    if (!args[0]) return message.reply(
      "🎬 Utilisation : film <nom du film>\n\nExemple : film Avatar"
    );

    const title = args.join(" ");

    try {

      const res = await axios.get(
        `http://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${API_KEY}`
      );

      const d = res.data;

      if (d.Response === "False")
        return message.reply(`❌ Aucun résultat trouvé pour : ${title}`);

      const msg =
`🎬 *${d.Title}* (${d.Year})
📺 Type : ${d.Type === "series" ? "Série" : "Film"}
📊 Note IMDb : ${d.imdbRating}/10
🎭 Genre : ${d.Genre}
⏳ Durée : ${d.Runtime}
🎥 Réalisateur : ${d.Director}
⭐ Acteurs : ${d.Actors}

📝 Résumé :
${d.Plot}

🖼 Affiche : ${d.Poster}`;

      return message.reply(msg);

    } catch (e) {
      console.log(e);
      return message.reply("❌ Erreur — impossible de récupérer les infos.");
    }
  }
};
