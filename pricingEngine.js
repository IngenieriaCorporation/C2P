module.exports = (analysis, pricing, options) => {
  const material = pricing.materials[options.material];

  const layers = analysis.height / options.layerHeight;
  const timeHours =
    (layers * pricing.infillMultipliers[options.infill]) / 3600;

  const materialCost = analysis.weight * material.pricePerGram;
  const machineCost = timeHours * pricing.machineHourlyRate;

  let subtotal =
    materialCost + machineCost + pricing.fixedOverhead;

  let profit = subtotal * pricing.profitMargin;
  let total = subtotal + profit;

  total = Math.max(total, pricing.minimumOrder);
  total *= options.quantity;

  return {
    price: total.toFixed(2),
    hours: timeHours.toFixed(2)
  };
};
