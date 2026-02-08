const axios = require("axios");

const quizActive = {};

module.exports = {
  config: {
    name: "quiz",
    aliases: ["q"],
    version: "3.0",
    author: "Freeze IO",
    role: 0,
    category: "fun",
    guide: {
      fr: "quiz → lance le quiz\nquiz off → stop le quiz"
    }
  },

  onStart: async ({ api, event, args }) => {
    const threadID = event.threadID;

    if (args[0] === "off") {
      quizActive[threadID] = false;
      return api.sendMessage(
        "🛑 Le quiz est arrêté dans ce groupe.",
        threadID,
        event.messageID
      );
    }

    if (quizActive[threadID]) {
      return api.sendMessage(
        "⚠️ Un quiz est déjà en cours.\nTape `quiz off` pour l'arrêter.",
        threadID,
        event.messageID
      );
    }

    quizActive[threadID] = true;
    sendQuiz(api, threadID);
  }
};

// ================== TRADUCTION ==================
async function translate(text) {
  try {
    const res = await axios.post(
      "https://libretranslate.de/translate",
      {
        q: text,
        source: "en",
        target: "fr",
        format: "text"
      },
      { timeout: 8000 }
    );
    return res.data.translatedText;
  } catch {
    return text; // fallback si API down
  }
}

// ================== ENVOI QUIZ ==================
async function sendQuiz(api, threadID) {
  if (!quizActive[threadID]) return;

  try {
    const res = await axios.get(
      "https://opentdb.com/api.php?amount=1&type=multiple"
    );

    const q = res.data.results[0];
    if (!q) return;

    const decode = t =>
      t.replace(/&quot;/g, '"')
       .replace(/&#039;/g, "'")
       .replace(/&amp;/g, "&");

    const questionEN = decode(q.question);
    const correctEN = decode(q.correct_answer);
    const wrongEN = q.incorrect_answers.map(decode);

    const question = await translate(questionEN);
    const correct = await translate(correctEN);
    const wrong = await Promise.all(wrongEN.map(a => translate(a)));

    let answers = [...wrong, correct].sort(() => Math.random() - 0.5);
    const letters = ["A", "B", "C", "D"];
    const correctLetter = letters[answers.indexOf(correct)];

    let msg =
`🧠 𝗤𝗨𝗜𝗭 ─ 𝗙𝗥𝗘𝗘𝗭𝗘 𝗜𝗢

❓ ${question}

`;

    answers.forEach((a, i) => {
      msg += `${letters[i]}) ${a}\n`;
    });

    msg += `\n✍️ Répondez avec A, B, C ou D`;

    api.sendMessage(msg, threadID, (err, info) => {
      global.GoatBot.onReply.set(info.messageID, {
        commandName: "quiz",
        correctLetter,
        threadID
      });
    });

  } catch (e) {
    console.error(e);
  }
}

// ================== RÉPONSES UTILISATEURS ==================
module.exports.onReply = async ({ api, event, Reply }) => {
  if (!quizActive[Reply.threadID]) return;

  const answer = event.body.trim().toUpperCase();
  if (!["A", "B", "C", "D"].includes(answer)) return;

  let replyMsg;

  if (answer === Reply.correctLetter) {
    replyMsg =
`✅ Bravo ${event.senderID} 🎉
Bonne réponse : ${Reply.correctLetter}`;
  } else {
    replyMsg =
`❌ Mauvaise réponse 😕
Bonne réponse : ${Reply.correctLetter}`;
  }

  api.sendMessage(
    replyMsg,
    Reply.threadID,
    event.messageID
  );

  // relance après 10 secondes
  setTimeout(() => {
    if (quizActive[Reply.threadID]) {
      sendQuiz(api, Reply.threadID);
    }
  }, 10000);
};
