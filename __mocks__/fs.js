const fs = {
  writeFile: (file, data, cb) => {
    if (file && data) {
      cb(null);
    } else {
      cb("Error");
    }
  },
  readFileSync: () => JSON.stringify({}),
};

module.exports = fs;
