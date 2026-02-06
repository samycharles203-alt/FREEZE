module.exports = {
  config: {
    name: "uptime",
    version: "1.2.0",
    author: "Samy Charles",
    role: 0,
    shortDescription: "Affiche l'uptime au format esthétique",
    category: "system"
  },

  onStart: async function ({ api, event }) {
    const t = process.uptime();
    const j = Math.floor(t / 86400);
    const h = Math.floor((t % 86400) / 3600);
    const m = Math.floor((t % 3600) / 60);
    const s = Math.floor(t % 60);

    const uptime = `${j > 0 ? j + 'd ' : ''}${h}h ${m}m ${s}s`;

    return api.sendMessage(`🩷「${uptime}」`, event.threadID, event.messageID);
  }
};
