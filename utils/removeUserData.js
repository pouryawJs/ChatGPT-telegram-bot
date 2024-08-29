exports.removeUserData = async (client, chatId) => {
    await client.del(`user:${chatId}:ai`);
    await client.del(`user:${chatId}:response`);
    await client.del(`user:${chatId}:version`);
};
