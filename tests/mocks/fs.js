const fs = jest.genMockFromModule("fs");

fs.writeFile.mockImplementation((file, data, cb) => {
  if (file && data) {
    cb(null);
  } else {
    cb(new Error());
  }
});
fs.statSync.mockImplementation(() => {
  throw new Error();
});

module.exports = fs;
