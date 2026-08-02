const detectEmploymentGaps = (timeline = []) => {

  const gaps = [];

  for (let i = 0; i < timeline.length - 1; i++) {

    const current = timeline[i];

    const next = timeline[i + 1];

    if (!current.end_date || !next.start_date) {
      continue;
    }

    const end = new Date(current.end_date);

    const start = new Date(next.start_date);

    const gapMonths =
      (start.getFullYear() - end.getFullYear()) * 12 +
      (start.getMonth() - end.getMonth());

    // Ignore transitions within one month
    if (gapMonths > 1) {

      gaps.push({

        afterCompany:
          current.company_name,

        beforeCompany:
          next.company_name,

        gapMonths,

      });

    }

  }

  return gaps;

};

module.exports = {
  detectEmploymentGaps,
};