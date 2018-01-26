const fs = {
  writeFile: (file, data, cb) => {
    if (file && data) {
      cb(null);
    } else {
      cb("Error");
    }
  },
  readFileSync: () => JSON.stringify({}),
  statSync: () => {
    throw new Error();
  },
};

module.exports = fs;
