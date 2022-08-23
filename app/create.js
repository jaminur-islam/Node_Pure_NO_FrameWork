const fs = require("fs");
const path = require("path");

/* console.log(lib);

lib.create = function (dir, file, data, callback) {
  fs.open(
    lib.baseDir + dir + "/" + file + ".js",
    "wx",
    function (err, fileDescriptor) {
      console.log("file D", fileDescriptor);
      if (!err && fileDescriptor) {
        const stringData = JSON.stringify(data);
        fs.writeFile("", stringData, function (err) {
          if (!err) {
            fs.close(fileDescriptor, function (err) {
              if (!err) {
                callback(false);
              } else {
                callback("Error closing new file ");
              }
            });
          } else {
            callback("Error writing a new file ");
          }
        });
      } else {
        callback("could not create new  file, it may already exist");
      }
    }
  );
};

// Export the module */

fs.open(
  path.join(__dirname + "/.data/test/") + "ekhon5" + ".js",
  "wx",
  (err, fileDescriptor) => {
    console.log("y", fileDescriptor, err);
    if (!err && fileDescriptor) {
      fs.writeFile(
        fileDescriptor,
        JSON.stringify({ name: "new fil" }),
        (err) => {
          console.log(err);
        }
      );
    } else {
      console.log(err);
    }
  }
);
