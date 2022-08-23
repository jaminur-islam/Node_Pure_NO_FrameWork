// ============== Dependence ====================//
const helpers = require("./helpers");
const _data = require("./data");
// sample handler
let handlers = {};
//=========================================== users Section ============//
//Users
handlers.users = (data, callback) => {
  const acceptableMethod = ["get", "post", "put", "delete"];
  if (acceptableMethod.indexOf(data.method) > -1) {
    handlers._users[data.method](data, callback);
  }
};

handlers._users = {};

// User Post
handlers._users.post = (data, callback) => {
  const firstName =
    typeof data.payload.firstName == "string" &&
    data.payload.firstName.trim().length > 0
      ? data.payload.firstName.trim()
      : false;
  const lastName =
    typeof data.payload.lastName == "string" &&
    data.payload.lastName.trim().length > 0
      ? data.payload.lastName.trim()
      : false;
  const phone =
    typeof data.payload.phone == "string" &&
    data.payload.phone.trim().length > 10
      ? data.payload.phone.trim()
      : false;
  const password =
    typeof data.payload.password == "string" &&
    data.payload.password.trim().length > 10
      ? data.payload.password.trim()
      : false;
  const tosAgreement =
    typeof data.payload.tosAgreement == "boolean" &&
    data.payload.tosAgreement === true
      ? true
      : false;

  // ==== get token from headers ====//
  const token =
    typeof data.headers.token == "string" ? data.headers.token : false;

  if (firstName && lastName && phone && password && tosAgreement) {
    handlers._tokens.verifyToken(token, phone, (tokenIsVerify) => {
      if (tokenIsVerify) {
        _data.read("users", phone, (err, data) => {
          if (err) {
            const hashedPassword = helpers.hash(password);
            if (hashedPassword) {
              const userObject = {
                firstName,
                lastName,
                phone,
                password: hashedPassword,
                tosAgreement,
              };

              _data.createFileFun("users", phone, userObject, (error) => {
                if (!error) {
                  callback(200, userObject);
                } else {
                  callback(500, { Error: "Could not create the new user" });
                }
              });
            } else {
              console.log();
              callback(500, { "error ": "Could Not Has the user/'s password" });
            }
          } else {
            callback(400, {
              error: "A user with that phone number already exists",
            });
          }
        });
      } else {
        callback(403, {
          Error: "Missing required token in header , or token is invalid",
        });
      }
    });
  } else {
    callback(400, { error: "missing required fields" });
  }
};

//User  Get
handlers._users.get = (data, callback) => {
  const phone =
    typeof data.queryStringObject.phone == "string" &&
    data.queryStringObject.phone.trim().length > 10
      ? data.queryStringObject.phone.trim()
      : false;

  // ==== get token from headers ====//
  const token =
    typeof data.headers.token == "string" ? data.headers.token : false;

  if (phone) {
    handlers._tokens.verifyToken(token, phone, (tokenIsVerify) => {
      if (tokenIsVerify) {
        _data.read("users", phone, (err, data) => {
          if (!err && data) {
            delete data.password;
            callback(200, data);
          } else {
            callback(404);
          }
        });
      } else {
        callback(403, {
          Error: "Missing required token in header , or token is invalid",
        });
      }
    });
  } else {
    callback(400, { Error: "missing required field " });
  }
};

// User Update
handlers._users.put = (data, callback) => {
  // Required fields
  const phone =
    typeof data.payload.phone == "string" &&
    data.payload.phone.trim().length > 10
      ? data.payload.phone.trim()
      : false;
  // Optional field
  const firstName =
    typeof data.payload.firstName == "string" &&
    data.payload.firstName.trim().length > 0
      ? data.payload.firstName.trim()
      : false;
  const lastName =
    typeof data.payload.lastName == "string" &&
    data.payload.lastName.trim().length > 0
      ? data.payload.lastName.trim()
      : false;

  const password =
    typeof data.payload.password == "string" &&
    data.payload.password.trim().length > 10
      ? data.payload.password.trim()
      : false;

  // ==== get token from headers ====//
  const token =
    typeof data.headers.token == "string" ? data.headers.token : false;

  if (phone) {
    handlers._tokens.verifyToken(token, phone, (tokenIsVerify) => {
      if (tokenIsVerify) {
        if (firstName || lastName || password) {
          _data.read("users", phone, (err, userData) => {
            if (!err && userData) {
              if (firstName) {
                userData.firstName = firstName;
              }
              if (firstName) {
                userData.lastName = lastName;
              }
              if (password) {
                userData.password = helpers.hash(password);
              }

              _data.update("users", phone, userData, (err) => {
                if (!err) {
                  callback(200, userData);
                } else {
                  console.log(err);
                  callback(500, { Error: "could't update the user" });
                }
              });
            } else {
              callback(400, { error: "the specified user does not exist" });
            }
          });
        } else {
          callback(400, { Error: "missing filed to update" });
        }
      } else {
        callback(403, {
          Error: "Missing required token in header , or token is invalid",
        });
      }
    });
  } else {
    callback(400, { Error: "Missing Required Field" });
  }
};

// User Delete
handlers._users.delete = (data, callback) => {
  const phone =
    typeof data.queryStringObject.phone == "string" &&
    data.queryStringObject.phone.trim().length > 10
      ? data.queryStringObject.phone.trim()
      : false;
  const token =
    typeof data.headers.token == "string" ? data.headers.token : false;

  if (phone) {
    handlers._tokens.verifyToken(token, phone, (tokenIsVerify) => {
      if (tokenIsVerify) {
        _data.delete("users", phone, (err) => {
          if (!err) {
            delete data.password;
            callback(200, "Delete User successfully");
          } else {
            callback(404);
          }
        });
      } else {
        callback(403, {
          Error: "Missing required token in header , or token is invalid",
        });
      }
    });
  } else {
    callback(400, { Error: "Missing required fields" });
  }
};

//=========================================== token Section ============//
handlers.tokens = (data, callback) => {
  const acceptableMethod = ["get", "put", "post", "delete"];
  if (acceptableMethod.indexOf(data.method) > -1) {
    handlers._tokens[data.method](data, callback);
  }
};
handlers._tokens = {};

handlers._tokens.post = (data, callback) => {
  const phone =
    typeof data.payload.phone == "string" &&
    data.payload.phone.trim().length > 10
      ? data.payload.phone.trim()
      : false;
  const password =
    typeof data.payload.password == "string" &&
    data.payload.password.trim().length > 10
      ? data.payload.password.trim()
      : false;

  if (phone && password) {
    //lockup the user who matches that phone number
    _data.read("users", phone, (err, userData) => {
      if (!err && userData) {
        const hashPassword = helpers.hash(password);
        if (hashPassword == userData.password) {
          const token = helpers.createRandomString(20);
          const expires = Date.now() + 1000 * 60 * 60;
          const tokenObject = {
            phone,
            token,
            expires,
          };
          _data.createFileFun("tokens", token, tokenObject, (err) => {
            if (!err) {
              callback(200, tokenObject);
            } else {
              callback(500, { Error: "could not create token" });
            }
          });
        } else {
          callback(400, { Error: "Password did not match the user" });
        }
      } else {
        callback(400, { Error: "Could not find the specified user" });
      }
    });
  } else {
    callback(400, { Error: "Missing required filed(s)" });
  }
};

handlers._tokens.get = (data, callback) => {
  const token =
    typeof data.queryStringObject.token === "string" &&
    data.queryStringObject.token.length > 18
      ? data.queryStringObject.token
      : false;

  if (token) {
    _data.read("tokens", token, (err, data) => {
      if (!err && data) {
        callback(200, data);
      } else {
        callback(404);
      }
    });
  } else {
    callback(400, { error: "Missing required field " });
  }
};

handlers._tokens.put = (data, callback) => {
  const token =
    typeof data.payload.token === "string" && data.payload.token.length > 18
      ? data.payload.token
      : false;
  const extend =
    typeof data.payload.extend == "boolean" && data.payload.extend == true
      ? true
      : false;
  if (token && extend) {
    _data.read("tokens", token, (err, tokenData) => {
      if (!err && tokenData) {
        if (tokenData.expires > Date.now()) {
          tokenData.expires = Date.now() + 1000 * 60 * 60;
          _data.update("tokens", token, tokenData, (err) => {
            if (!err) {
              callback(200, tokenData);
            } else {
              callback(400, { Error: "can't update token" });
            }
          });
        } else {
          callback(400, {
            Error: "The token has already expires, and cannot be extended",
          });
        }
      } else {
        callback(404, { Error: "specific token does not exist " });
      }
    });
  } else {
    callback(400, { Error: "Missing required filed" });
  }
};

handlers._tokens.delete = (data, callback) => {
  const token =
    typeof data.queryStringObject.token === "string" &&
    data.queryStringObject.token.length > 18
      ? data.queryStringObject.token
      : false;
  if (token) {
    _data.read("tokens", token, (err, tokenData) => {
      if (!err && tokenData) {
        _data.delete("tokens", token, (err) => {
          if (!err) {
            callback(200, tokenData);
          } else {
            callback(400, { Error: "Could not delete specific token" });
          }
        });
      } else {
        callback(400, { Error: "Could not find the specific token" });
      }
    });
  } else {
    callback(400, { Error: "Missing Required field " });
  }
};

//=================================== verify token ======================//
handlers._tokens.verifyToken = (token, phone, callback) => {
  _data.read("tokens", token, (err, tokenData) => {
    if (!err && tokenData) {
      if (tokenData.phone == phone || tokenData.expires > Date.now()) {
        console.log(tokenData);
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};

// sample handler
handlers.pink = function (data, callback) {
  callback(200);
};

// Not found handler
handlers.notFound = function (data, callback) {
  callback(404);
};

module.exports = handlers;
