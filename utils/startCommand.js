const { Markup } = require("telegraf");
const { removeUserData } = require("./removeUserData");

exports.start = async (ctx, client) => {
    const chatId = ctx.chat.id;

    await removeUserData(client, chatId);

    ctx.reply(
        "هوش مصنوعی خودت رو انتخاب کن 🤖",
        Markup.inlineKeyboard([
            [
                Markup.button.callback("Copilot", "copilot"),
                Markup.button.callback("Chat GPT 4", "gpt4o"),
            ],
        ])
    );
};
