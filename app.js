const { Telegraf, Markup } = require("telegraf");
const dotenv = require("dotenv");
dotenv.config();

const token = process.env.BOT_TOKEN;

const bot = new Telegraf(token);

bot.start((ctx) => {
    ctx.reply(
        "Choose your GPT version 🤖",
        Markup.inlineKeyboard([
            [
                Markup.button.callback("ChatGPT 3.5", "gpt3.5-turbo"),
                Markup.button.callback("ChatGPT4-o", "gpt4o"),
            ],
            [Markup.button.callback("ChatGPT 4-turbo", "gpt4-turbo")],
        ])
    );
});

bot.launch(() => {
    console.log("bot started successfully");
});
