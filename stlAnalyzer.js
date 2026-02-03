const fs = require("fs");
const parseSTL = require("stl-parser");

module.exports = (filePath, density) => {
  const data = parseSTL(fs.readFileSync(filePath));

  const volumeCm3 = data.volume / 1000;
  const weight = volumeCm3 * density;
  const height = data.boundingBox.max.z - data.boundingBox.min.z;

  return { volumeCm3, weight, height };
};
