const crypto = require("crypto");
const config = require("./config");
const https = require("https");
const helpers = {};

//================================= Hashing password =============================//
helpers.hash = (password) => {
  if (typeof password == "string" && password.length > 0) {
    const hash = crypto
      .createHmac("sha256", config.hashingSecret)
      .update(password)
      .digest("hex");

    return hash;
  } else {
    return false;
  }
};
//================================= convert json to object  =============================//

helpers.parseJsonToObject = (str) => {
  try {
    const obj = JSON.parse(str);
    return obj;
  } catch (err) {
    return {};
  }
};
//================================= convert buffer to json =============================//

helpers.parseBufferToObject = (buffer) => {
  try {
    const parseData = JSON.parse(buffer.toString());
    return parseData;
  } catch (err) {
    return {};
  }
};

//======== convert random alphanumeric characters of a given length =====//
helpers.createRandomString = (strLength) => {
  strLength = typeof strLength == "number" && strLength > 0 ? strLength : false;
  if (strLength) {
    const possibleCharacters = "abcdefghijklmnopqrstuvwxyz0123456789";
    let str = "";
    for (let i = 1; i <= strLength; i++) {
      let randomCharacter = possibleCharacters.charAt(
        Math.floor(Math.random() * possibleCharacters.length)
      );
      str += randomCharacter;
    }
    return str;
  } else {
    return false;
  }
};

//==================================  Send an Sms Message via Twilio ==========================================//
helpers.sendTwilioSms = (phone, msg, callback) => {
  phone =
    typeof phone === "string" && phone.trim().length > 10
      ? phone.trim()
      : false;
  msg =
    typeof msg === "string" &&
    msg.trim().length > 0 &&
    msg.trim().length <= 1200
      ? msg.trim()
      : false;
  if (phone && msg) {
    // Configure the request payload
    const payload = {
      From: config.twilio.fromPhone,
      To: `+880${phone}`,
      Body: msg,
    };
    // Stringify payload
    const stringifyPayload = JSON.stringify(payload);

    // Configure the request details
    const requestDetails = {
      protocol: "https:",
      hostname: "api.twilio.com",
      method: "POST",
      path: `/2010-04-01/Accounts/${config.twilio.accountSid}/Message.json`,
      auth: `${config.twilio.accountSid}:${config.twilio.authToken}`,
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
        "Content-length": Buffer.byteLength(stringifyPayload),
      },
    };

    // Instantiate the request object
    const req = https.request(requestDetails, (res) => {
      const status = res.statusCode;
      if (status === 200 || status === 201) {
        callback(false);
      } else {
        callback(`Status Code returned was ${status}`);
      }
    });
    req.on("error", (e) => {
      callback(e);
    });
    req.write(stringifyPayload);

    req.end();
  } else {
    callback("Give me valid parameter");
  }
};

module.exports = helpers;

//https://www.youtube.com/watch?v=vs4in-UFdX0
