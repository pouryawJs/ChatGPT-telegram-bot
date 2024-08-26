const { Telegraf } = require("telegraf");
const dotenv = require("dotenv");
dotenv.config();

const token = process.env.BOT_TOKEN;

const bot = new Telegraf(token);

bot.launch(() => {
    console.log("bot started successfully");
});
