import winston from "winston";

const levelsColors = {
  levels: {
    error: 0,
    debug: 1,
    info: 2,
  },
  colors: {
    error: "red",
    debug: "yellow",
    info: "green",
  },
};

winston.addColors(levelsColors.colors);

const logger = winston.createLogger({
  levels: levelsColors.levels,
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.colorize({
      all: true,
    }),
    winston.format.timestamp({
      format: "YY-MM-DD HH:MM:SS",
    }),
    winston.format.printf(
      (info) => `${info.timestamp} - [${info.level}] : ${info.message}`
    )
  ),
});

export default logger;
