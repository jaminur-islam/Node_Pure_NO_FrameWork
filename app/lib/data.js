// Dependance
const fs = require("fs");
const path = require("path");
const helpers = require("./helpers");

// create lib module
const lib = {};
// Base directory
lib.baseDir = path.join(__dirname, "/../.data");
console.log("my D", lib.baseDir);

// ======================= create file function =============================//
lib.createFileFun = (dir, file, data, callback) => {
  fs.open(`${lib.baseDir}/${dir}/${file}.json`, "wx", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      fs.write(fileDescriptor, JSON.stringify(data), (err) => {
        if (!err) {
          fs.close(fileDescriptor, (err) => {
            if (!err) {
              callback(false);
            } else {
              callback(err);
            }
          });
        } else {
          callback(err);
        }
      });
    } else {
      callback(err);
    }
  });
};

// ======================= read file function =============================//

lib.read = (dir, file, callback) => {
  fs.readFile(`${lib.baseDir}/${dir}/${file}.json`, (err, data) => {
    if (!err && data) {
      const newData = helpers.parseBufferToObject(data);
      callback(false, newData);
    } else {
      callback(err, data);
    }
  });
};

//======================= update file function ===========================//
lib.update = (dir, file, data, callback) => {
  fs.open(`${lib.baseDir}/${dir}/${file}.json`, "r+", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      fs.ftruncate(fileDescriptor, (err) => {
        if (!err) {
          fs.writeFile(fileDescriptor, JSON.stringify(data), (err) => {
            if (!err) {
              fs.close(fileDescriptor, (err) => {
                if (!err) {
                  callback(false);
                } else {
                  callback(err);
                }
              });
            } else {
              callback(err);
            }
          });
        } else {
          callback(err);
        }
      });
    } else {
      callback(err);
    }
  });
};

//========================================= Delete file ==============================
lib.delete = (dir, file, callback) => {
  fs.unlink(`${lib.baseDir}/${dir}/${file}.json`, (err) => {
    if (!err) {
      callback(false);
    } else {
      callback(err);
    }
  });
};
// export lib module
module.exports = lib;

/* // Dependencies
const fs = require("fs");
const path = require("path");

// Container for the module (to be exported)
const lib = {};

// Base directory of data folder
lib.baseDir = path.join(__dirname, "/../.data/");
console.log(lib.baseDir);

// create file function
lib.create = function (dir, file, data, callback) {
  fs.open(
    `${lib.baseDir}${dir}/${file}` + ".txt",
    "wx",
    (error, fileDescriptor) => {
      if (!error && fileDescriptor) {
        fs.writeFile(fileDescriptor, JSON.stringify(data), (err) => {
          if (!err) {
            fs.close(fileDescriptor, (err) => {
              if (!err) {
                callback(false);
              } else {
                callback(err);
              }
            });
          } else {
            callback(err);
          }
        });
      } else {
        callback(error);
      }
    }
  );
};

module.exports = lib;
 */

//============================test file create===========================
/* _data.createFileFun("test", "new2", { foo: "bar" }, function (err) {
  console.log(err.message);
}); */

//============================test file read ===========================
/* _data.read("test", "new2", (err, data) => {
  console.log(`this error is ${err} my data is ${data}`);
}); */

//============================ test file update ==========================
/* _data.update("test", "new2", { name: "sagor", age: 20 }, (err) => {
  console.log(err);
}); */

//============================ test delete file ===========================
/* _data.delete("test", "new2", (err) => {
  console.log(err);
}); */
