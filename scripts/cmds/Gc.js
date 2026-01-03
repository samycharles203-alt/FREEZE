module.exports = {
  config: {
    name: "gc",
    aliases: [],
    version: "1.0",
    author: "Freeze IO",
    countDown: 3,
    role: 0,
    shortDescription: "Ajouter l'utilisateur dans le groupe officiel",
    longDescription: "Ajoute automatiquement l'utilisateur dans le groupe FREEZE GC",
    category: "group"
  },

  // ========= AVEC PREFIX =========
  onStart: async function ({ api, event }) {
    return addToGC(api, event);
  },

  // ========= SANS PREFIX =========
  onChat: async function ({ api, event }) {
    const msg = (event.body || "").toLowerCase().trim();
    if (msg === "gc") return addToGC(api, event);
  }
};


// ========= FONCTION PRINCIPALE =========
async function addToGC(api, event) {

  const GROUP_ID = "2272908889888960";
  const user = event.senderID;

  try {

    // ⭐ On essaye d'ajouter l'utilisateur
    await api.addUserToGroup(user, GROUP_ID);

    return api.sendMessage(
`
━━🇨🇮🇧🇪 〔 𝐅𝐑𝐄𝐄𝐙𝐄 𝐆𝐂℡ 〕🇨🇮🇧🇪━━

🎉 Tu as bien été ajouté au groupe officiel !

📜 Nom : ♡💎┊𝐅𝐑𝐄𝐄𝐙𝐄 𝐆𝐂℡ ≠📑🇧🇪
🆔 ID : ${GROUP_ID}

Bienvenue dans la famille 💎

━━🇨🇮🇧🇪 〔 𝐅𝐑𝐄𝐄𝐙𝐄 𝐆𝐂℡ 〕🇨🇮🇧🇪━━
`,
      event.threadID,
      event.messageID
    );

  } catch (e) {

    // ⚠️ Si la personne est déjà dedans OU groupe verrouillé
    console.log(e);

    return api.sendMessage(
`
⚠️ | Impossible de t'ajouter automatiquement.

🟡 Raison possible :
• Tu es déjà dans le groupe
• Le groupe a bloqué les ajouts
• Le bot n'est pas admin

📩 Envoie-moi un message si besoin.
`,
      event.threadID,
      event.messageID
    );
  }
                 }
