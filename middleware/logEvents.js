const { format } = require("date-fns");
const uuid = require("uuid");

const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const logEvents = async (message, fileName) => {
  const dateTime = format(new Date(), "yyyy-MM-dd HH:mm:ss");
  const logItem = `${dateTime}\t${uuid.v4()}\t${message}`;
  console.log(logItem);
  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", fileName),
      `\n${logItem}`
    );
  } catch (e) {
    console.error(e);
  }
};

const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.url}`, "reqLog.txt");
  next();
};

module.exports = { logger, logEvents };
