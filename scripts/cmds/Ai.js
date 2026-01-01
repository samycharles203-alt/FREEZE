const axios = require("axios");

// Fonction pour convertir le texte en gothique
function toGothicStyle(text) {
    const map = {
        A: '𝖠', B: '𝖡', C: '𝖢', D: '𝖣', E: '𝖤', F: '𝖥', G: '𝖦', H: '𝖧',
        I: '𝖨', J: '𝖩', K: '𝖪', L: '𝖫', M: '𝖬', N: '𝖭', O: '𝖮', P: '𝖯',
        Q: '𝖰', R: '𝖱', S: '𝖲', T: '𝖳', U: '𝖴', V: '𝖵', W: '𝖶', X: '𝖷',
        Y: '𝖸', Z: '𝖹',
        a: '𝖺', b: '𝖻', c: '𝖼', d: '𝖽', e: '𝖾', f: '𝖿', g: '𝗀', h: '𝗁',
        i: '𝗂', j: '𝗃', k: '𝗄', l: '𝗅', m: '𝗆', n: '𝗇', o: '𝗈', p: '𝗉',
        q: '𝗊', r: '𝗋', s: '𝗌', t: '𝗍', u: '𝗎', v: '𝗏', w: '𝗐', x: '𝗑',
        y: '𝗒', z: '𝗓', ' ':' ', '.':'.', ',':','
    };
    return text.split('').map(c => map[c] || c).join('');
}

// Formate la réponse
function formatResponse(userMessage, botReply) {
    const rStyled = toGothicStyle(botReply);
    return `🇨🇮🇧🇪 ﹝𝗙𝗥𝗘𝗘𝗭𝗘 𝗜𝗢𝟮.𝟬﹞ 🇨🇮🇧🇪 
${rStyled}`;
}

module.exports = {
  config: {
    name: "ai",
    aliases: ["io2.0", "io", "ai"],
    version: "2.4.0",
    author: "Samycharles",
    countDown: 2,
    role: 0,
    shortDescription: { en: "Chat with Aesther AI" },
    longDescription: { en: "Talk with Aesther AI using Christus/Gemini API" },
    category: "ai",
    guide: { en: "{p}ai <question>" }
  },

  onStart: async ({ api, event, args }) => {
    const q = args.join(" ").trim();
    if (!q)
      return api.sendMessage("❌ | Please enter a message for Aesther.", event.threadID, event.messageID);
    chat(api, event, q);
  },

  onReply: async ({ api, event, Reply }) => {
    if (event.senderID !== Reply.author) return;
    const q = (event.body || "").trim();
    if (!q) return api.sendMessage("⚠️ | Please reply with a text message.", event.threadID, event.messageID);
    chat(api, event, q);
  },

  onChat: async ({ api, event }) => {
    const msg = (event.body || "").trim();
    if (!/^ai\s+/i.test(msg) && !/^aesther\s+/i.test(msg) && !/^ae\s+/i.test(msg)) return;
    const q = msg.replace(/^(ai|aesther|ae)\s+/i, "").trim();
    if (!q) return;
    chat(api, event, q);
  }
};

async function chat(api, e, q) {
  api.setMessageReaction("⏳", e.messageID, () => {}, true);

  try {
    // ← API Christus/Gemini utilisée ici
    const res = await axios.get("https://arychauhann.onrender.com/api/gemini-proxy2", {
      params: { prompt: q },
      timeout: 45000,
      headers: { "Content-Type": "application/json" }
    });

    const reply = res.data?.result?.trim() || "Désolé, réponse non reconnue de l'API";

    api.sendMessage(formatResponse(q, reply), e.threadID, (err, info) => {
      if (err) return api.setMessageReaction("❌", e.messageID, () => {}, true);
      api.setMessageReaction("✅", e.messageID, () => {}, true);
      try {
        global.GoatBot.onReply.set(info.messageID, { commandName: "ai", author: e.senderID });
      } catch {}
    }, e.messageID);

  } catch (err) {
    console.error("Aesther AI error:", err?.message || err);
    api.sendMessage("❌ | Error connecting to AI API.", e.threadID, () => {
      api.setMessageReaction("❌", e.messageID, () => {}, true);
    }, e.messageID);
  }
      }
