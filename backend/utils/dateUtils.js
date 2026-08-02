const calculateDuration = (
  startDate,
  endDate
) => {

  if (!startDate) {
    return "";
  }

  const start = new Date(startDate);

  const end = endDate
    ? new Date(endDate)
    : new Date();

  let months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());

  const years = Math.floor(months / 12);

  months %= 12;

  if (years && months) {
    return `${years} Years ${months} Months`;
  }

  if (years) {
    return `${years} Years`;
  }

  return `${months} Months`;

};

const calculateMonths = (
  startDate,
  endDate
) => {

  if (!startDate) {
    return 0;
  }

  const start = new Date(startDate);

  const end = endDate
    ? new Date(endDate)
    : new Date();

  return (
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth())
  );

};

const monthsToDuration = (months) => {

  const years = Math.floor(months / 12);

  const remainingMonths = months % 12;

  if (years && remainingMonths) {
    return `${years} Years ${remainingMonths} Months`;
  }

  if (years) {
    return `${years} Years`;
  }

  return `${remainingMonths} Months`;

};

module.exports = {
  calculateDuration,
  calculateMonths,
  monthsToDuration,
};