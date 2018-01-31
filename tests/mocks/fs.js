const fs = jest.genMockFromModule("fs");

fs.writeFile.mockImplementation((file, data, cb) => {
  if (file && data) {
    cb(null);
  } else {
    cb("Error");
  }
});
fs.statSync.mockImplementation(() => {
  throw new Error();
});

module.exports = fs;
