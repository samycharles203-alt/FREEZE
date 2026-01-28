const { getTime } = global.utils;

if (!global.temp.welcomeEvent)
	global.temp.welcomeEvent = {};

module.exports = {
	config: {
		name: "welcome",
		version: "2.1",
		author: "FREEZE",
		category: "events"
	},

	onStart: async ({ threadsData, message, event, api }) => {
		if (event.logMessageType !== "log:subscribe") return;

		const { threadID } = event;
		const prefix = global.utils.getPrefix(threadID);
		const timeNow = getTime("HH:mm:ss");
		const addedUsers = event.logMessageData.addedParticipants;

		// 🧊 BOT ADDED TO GROUP
		if (addedUsers.some(u => u.userFbId == api.getCurrentUserID())) {
			const threadData = await threadsData.get(threadID);

			return message.send({
				body:
`╭─────♡◉◉◉♡─────⌬
💖 ʜᴇʟʟᴏ everyone 💋!
🌸 ᴡᴇʟᴄᴏᴍᴇ me to the group
🤍 「 ${threadData.threadName} 」 🤍

📅 𝗗𝗮𝘁𝗲: ${getTime("DD/MM/YYYY")}
⌚ 𝘁𝗶𝗺𝗲: ${timeNow}

👑 Owner: Samy Charles

🍁 Thank you for adding me to this beautiful group!
✨ I am FREEZE — your premium assistant
❄️ Type ${prefix}help to explore my commands

🦅 © 𝙁𝙧𝙚𝙚𝙯𝙚 𝙗𝙤𝙩
╰─────♡◉◉◉♡─────⌬`,
				mentions: [
					{ tag: "Samy Charles", id: "61586092556175" }
				]
			});
		}

		// 🧊 NEW MEMBERS JOINED
		if (!global.temp.welcomeEvent[threadID]) {
			global.temp.welcomeEvent[threadID] = {
				timeout: null,
				users: []
			};
		}

		global.temp.welcomeEvent[threadID].users.push(...addedUsers);
		clearTimeout(global.temp.welcomeEvent[threadID].timeout);

		global.temp.welcomeEvent[threadID].timeout = setTimeout(async () => {
			const threadData = await threadsData.get(threadID);
			if (threadData.settings?.sendWelcomeMessage === false) return;

			const names = [];
			const mentions = [];

			for (const u of global.temp.welcomeEvent[threadID].users) {
				names.push(u.fullName);
				mentions.push({ tag: u.fullName, id: u.userFbId });
			}

			mentions.push({ tag: "Samy Charles", id: "61586092556175" });

			const welcomeMessage =
`╭─────♡◉◉◉♡─────⌬
💖 ʜᴇʟʟᴏ ${names.join(", ")} 💋!
🌸 ᴡᴇʟᴄᴏᴍᴇ to the group
🤍 「 ${threadData.threadName} 」 🤍

📅 𝗗𝗮𝘁𝗲: ${getTime("DD/MM/YYYY")}
⌚ 𝘁𝗶𝗺𝗲: ${getTime("HH:mm:ss")}

👑 Owner: Samy Charles

🍁 We are truly happy to have you here!
✨ Please respect everyone and keep a positive vibe
❄️ Enjoy your time in the FREEZE Circle

🦅 © 𝙁𝙧𝙚𝙚𝙯𝙚 𝙗𝙤𝙩
╰─────♡◉◉◉♡─────⌬`;

			message.send({
				body: welcomeMessage,
				mentions
			});

			delete global.temp.welcomeEvent[threadID];
		}, 1500);
	}
};
