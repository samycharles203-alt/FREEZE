const { getTime, drive } = global.utils;
if (!global.temp.welcomeEvent)
	global.temp.welcomeEvent = {};

module.exports = {
	config: {
		name: "welcome",
		version: "2.0",
		author: "FREEZE",
		category: "events"
	},

	onStart: async ({ threadsData, message, event, api }) => {
		if (event.logMessageType !== "log:subscribe") return;

		const { threadID } = event;
		const prefix = global.utils.getPrefix(threadID);
		const timeNow = getTime("HH:mm");
		const addedUsers = event.logMessageData.addedParticipants;

		// 🧊 IF BOT IS ADDED
		if (addedUsers.some(u => u.userFbId == api.getCurrentUserID())) {
			const threadData = await threadsData.get(threadID);

			return message.send(
`× •-•-•-•⟮ 𝗙𝗥𝗘𝗘𝗭𝗘 ⟯•-•-•-• ×

❄️✨ Greetings, everyone ✨❄️

Thank you for adding me to this elegant group 🤍
I am FREEZE — your premium assistant 🤖💎

🏛️ Group: ${threadData.threadName}
🕒 Activated at: ${timeNow}

🔑 Prefix: ${prefix}
📖 Type ${prefix}help to see my commands

❄️💎 Welcome to excellence 💎❄️

× •-•-•-•⟮ 𝗙𝗥𝗘𝗘𝗭𝗘 ⟯•-•-•-• ×`
			);
		}

		// 🧊 NEW MEMBERS
		if (!global.temp.welcomeEvent[threadID])
			global.temp.welcomeEvent[threadID] = {
				timeout: null,
				users: []
			};

		global.temp.welcomeEvent[threadID].users.push(...addedUsers);
		clearTimeout(global.temp.welcomeEvent[threadID].timeout);

		global.temp.welcomeEvent[threadID].timeout = setTimeout(async () => {
			const threadData = await threadsData.get(threadID);
			if (threadData.settings?.sendWelcomeMessage === false) return;

			const memberCount = threadData.participantIDs.length;
			const adderID = event.author;
			const adderName = (await api.getUserInfo(adderID))[adderID].name;

			const names = [];
			const mentions = [];

			for (const u of global.temp.welcomeEvent[threadID].users) {
				names.push(u.fullName);
				mentions.push({ tag: u.fullName, id: u.userFbId });
			}

			const welcomeMessage =
`× •-•-•-•⟮ 𝗙𝗥𝗘𝗘𝗭𝗘 ⟯•-•-•-• ×

💎✨ Welcome, ${names.join(", ")} ✨💎

You have joined an elegant and exclusive space.
🤍🏛️ 「 ${threadData.threadName} 」 🏛️🤍

➕ Gracefully invited by:
👤✨ ${adderName}

📊✨ Group Overview:
👥🤍 Total Members: ${memberCount}
🕒⏳ Time of Entry: ${timeNow}

🌟✨ Please enjoy a refined experience:
🤍 Respect & kindness
💬 Quality conversations
🌿 Positive energy only

❄️👑 Welcome to the FREEZE Circle 👑❄️

× •-•-•-•⟮ 𝗙𝗥𝗘𝗘𝗭𝗘 ⟯•-•-•-• ×`;

			message.send({
				body: welcomeMessage,
				mentions
			});

			delete global.temp.welcomeEvent[threadID];
		}, 1500);
	}
};
