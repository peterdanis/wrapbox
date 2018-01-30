const fs = {
  writeFile: jest.fn((file, data, cb) => {
    if (file && data) {
      cb(null);
    } else {
      cb("Error");
    }
  }),
  readFileSync: jest.fn(() => {}),
  statSync: jest.fn(() => {
    throw new Error();
  }),
};

module.exports = fs;
