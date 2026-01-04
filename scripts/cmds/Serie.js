const axios = require("axios");

module.exports = {
  config: {
    name: "serie",
    aliases: ["tvshow", "tv", "série"],
    version: "1.0",
    author: "FREEZE IO2.0",
    role: 0,
    description: "Recherche une série TV via OMDb API",
    category: "info"
  },

  onStart: async function({ message, args }) {
    const API_KEY = "46873ae"; // 🔑 Ta clé OMDb

    if (!args[0]) return message.reply(
      "📺 Utilisation : serie <nom de la série>\nEx : serie lucifer"
    );

    const title = args.join(" ");

    try {
      const res = await axios.get(
        `http://www.omdbapi.com/?t=${encodeURIComponent(title)}&type=series&apikey=${API_KEY}`
      );

      const d = res.data;

      if (d.Response === "False")
        return message.reply(`❌ Série introuvable : ${title}`);

      const msg =
`📺 *${d.Title}* (${d.Year})
🎭 Genre : ${d.Genre}
📊 Note IMDb : ${d.imdbRating}/10
⏳ Durée : ${d.Runtime || "N/A"}
⭐ Acteurs : ${d.Actors}
📝 Résumé : ${d.Plot}
🖼 Poster : ${d.Poster}
🌐 Plus d’infos : https://www.imdb.com/title/${d.imdbID}/`;

      return message.reply(msg);

    } catch (e) {
      console.log(e);
      return message.reply("❌ Erreur lors de la récupération des infos.");
    }
  }
};
