const { Telegraf, Markup } = require("telegraf");
const dotenv = require("dotenv");
dotenv.config();

const { client } = require("./config/redis");
const editMessages = require("./utils/editMessages");

const token = process.env.BOT_TOKEN;

const bot = new Telegraf(token);

bot.start((ctx) => {
    ctx.reply(
        "Choose your GPT version 🤖",
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
    client.set(`user:${ctx.chat.id}:version`, "gpt3.5-turbo");
    editMessages.howCanIHelp(ctx);
});
bot.action("gpt4o", (ctx) => {
    client.set(`user:${ctx.chat.id}:version`, "gpt4o");
    editMessages.howCanIHelp(ctx);
});
bot.action("gpt4-turbo", (ctx) => {
    client.set(`user:${ctx.chat.id}:version`, "gpt4-turbo");
    editMessages.howCanIHelp(ctx);
});

bot.launch(() => {
    console.log("bot started successfully");
});
