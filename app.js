const { Telegraf, Markup } = require("telegraf");
const dotenv = require("dotenv");
dotenv.config();

const redis = require("redis");
const client = redis.createClient();
client
    .connect()
    .then(() => console.log("connected to redis"))
    .catch((err) => new Error(err));

const editMessages = require("./utils/editMessages");

const token = process.env.BOT_TOKEN;

const bot = new Telegraf(token);

bot.start(async (ctx) => {
    //! should remove user data

    ctx.reply(
        "هوش مصنوعی خودت رو انتخاب کن 🤖",
        Markup.inlineKeyboard([
            [
                Markup.button.callback("Copilot", "copilot"),
                Markup.button.callback("Chat GPT", "chatgpt"),
            ],
        ])
    );
});

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
    editMessages.howCanIHelp(ctx);
});
bot.action("precise", (ctx) => {
    const callbackData = ctx.update.callback_query.data;

    client.set(`user:${ctx.chat.id}:response`, callbackData);
    editMessages.howCanIHelp(ctx);
});
bot.action("balance", (ctx) => {
    const callbackData = ctx.update.callback_query.data;

    client.set(`user:${ctx.chat.id}:response`, callbackData);
    editMessages.howCanIHelp(ctx);
});

//* CHAT GPT
bot.action("chatgpt", (ctx) => {
    const callbackData = ctx.update.callback_query.data;

    client.set(`user:${ctx.chat.id}:ai`, callbackData);

    ctx.editMessageText(
        "ورژنی که میخواهید از آن استفاده کنید رو انتخاب کنید:",
        Markup.inlineKeyboard([
            [
                Markup.button.callback("GPT 3.5", "gpt3.5-turbo"),
                Markup.button.callback("GPT 4-o", "gpt4o"),
            ],
            [Markup.button.callback("GPT 4-turbo", "gpt4-turbo")],
        ])
    );
});

bot.action("gpt3.5-turbo", (ctx) => {
    const callbackData = ctx.update.callback_query.data;

    client.set(`user:${ctx.chat.id}:version`, callbackData);
    editMessages.howCanIHelp(ctx);
});
bot.action("gpt4o", (ctx) => {
    const callbackData = ctx.update.callback_query.data;

    client.set(`user:${ctx.chat.id}:version`, callbackData);
    editMessages.howCanIHelp(ctx);
});
bot.action("gpt4-turbo", (ctx) => {
    const callbackData = ctx.update.callback_query.data;

    client.set(`user:${ctx.chat.id}:version`, callbackData);
    editMessages.howCanIHelp(ctx);
});

bot.launch(() => {
    console.log("bot started successfully");
});
