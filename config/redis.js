const redis = require("redis");

exports.client = (function () {
    return redis.createClient();
})();
