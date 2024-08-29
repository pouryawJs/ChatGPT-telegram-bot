const { Telegraf, Markup } = require("telegraf");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const redis = require("redis");
const client = redis.createClient();
client
    .connect()
    .then(() => console.log("connected to redis"))
    .catch((err) => new Error(err));

const editMessages = require("./utils/editMessages");
const { start } = require("./utils/startCommand");

const borToken = process.env.BOT_TOKEN;
const apiToken = process.env.API_TOKEN;

const bot = new Telegraf(borToken);

bot.start(async (ctx) => await start(ctx, client));

//* COPILOT
bot.action("copilot", (ctx) => {
    const callbackData = ctx.update.callback_query.data;

    client.set(`user:${ctx.chat.id}:ai`, callbackData);
    ctx.editMessageText(
        "چطور جوابی از ربات میخوای؟ 🤔",
        Markup.inlineKeyboard([
            [
                Markup.button.callback("خلاقانه 🎨", "creative"),
                Markup.button.callback("دقیق 🎯", "precise"),
            ],
            [Markup.button.callback("متعادل ⚖️", "balance")],
        ])
    );
});

bot.action("creative", (ctx) => {
    const callbackData = ctx.update.callback_query.data;

    client.set(`user:${ctx.chat.id}:response`, callbackData);
    editMessages.askYourQuestion(ctx);
});
bot.action("precise", (ctx) => {
    const callbackData = ctx.update.callback_query.data;

    client.set(`user:${ctx.chat.id}:response`, callbackData);
    editMessages.askYourQuestion(ctx);
});
bot.action("balance", (ctx) => {
    const callbackData = ctx.update.callback_query.data;

    client.set(`user:${ctx.chat.id}:response`, callbackData);
    editMessages.askYourQuestion(ctx);
});

bot.action("gpt4o", (ctx) => {
    const callbackData = ctx.update.callback_query.data;

    client.set(`user:${ctx.chat.id}:ai`, callbackData);
    editMessages.askYourQuestion(ctx);
});

bot.on("text", async (ctx) => {
    const ai = await client.get(`user:${ctx.chat.id}:ai`);

    // check if user data is not enough
    if (!ai) {
        return ctx.reply(
            "قبل از پرسیدن سوال، ربات باید اطلاعات را دریافت کند \n\n برای اینکار بر روی /start کلیک کنید و مراحل را طی کنید"
        );
    }
    // send looading message
    ctx.reply("لطفا کمی صبور باشید...⏳");
    const messageId = ctx.message.message_id + 1;

    const text = ctx.text;
    const mainApi = `https://one-api.ir/chatgpt/?token=${apiToken}&action=${ai}`;

    if (ai === "copilot") {
        const botResponse = await client.get(`user:${ctx.chat.id}:response`);

        const api = mainApi.concat(`&q=${text}&tones=${botResponse}`);
        const response = await axios.get(api);
        ctx.deleteMessage(messageId);
        return ctx.reply(
            response.data.result[0].message,
            Markup.inlineKeyboard([
                [
                    Markup.button.callback(
                        "پایان مکالمه / تغییر هوش مصنوعی",
                        "end-chat"
                    ),
                ],
            ])
        );
    } else if (ai === "gpt4o") {
        const api = mainApi.concat(`&q=${text}`);
        const response = await axios.get(api);

        ctx.deleteMessage(messageId);
        return ctx.reply(
            response.data.result[0],
            Markup.inlineKeyboard([
                [
                    Markup.button.callback(
                        "پایان مکالمه / تغییر هوش مصنوعی",
                        "end-chat"
                    ),
                ],
            ])
        );
    }
});

bot.action("end-chat", async (ctx) => {
    ctx.reply("مکالمه شما با موفقیت پایان یافت ✅️");
    await start(ctx, client);
});

bot.launch(() => {
    console.log("bot started successfully");
});
