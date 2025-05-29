const crypto = require('crypto');

module.exports.generateRadomNumber = (length) => {
    const characters = "0123456789";

    let result = "";
    for(let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
}

module.exports.createHmac = (orderId) => {
  const data = `orderId=${orderId}`;
  return crypto.createHmac('sha256', process.env.HMAC_SECRET).update(data).digest('hex');
}