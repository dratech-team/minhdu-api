export const rangeDatetimeQuery = (startedAt: Date, endedAt: Date) =>
[
  {
    AND: [
      {
        startedAt: {
          lte: startedAt,
        },
      },
      {
        endedAt: {
          gte: endedAt
        },
      }
    ]
  },
  {
    OR: [
      {
        startedAt: {
          gte: startedAt,
          lte: endedAt,
        },
      },
      {
        endedAt: {
          gte: startedAt,
          lte: endedAt,
        },
      }
    ]
  },
];
