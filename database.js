const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "data/pricing.json");

module.exports = {
  read: () => JSON.parse(fs.readFileSync(filePath)),
  write: (data) =>
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
};
