const infoLoggerOptions =
{
    errorEventName: "info",
    logDirectory: "./logs",
    fileNamePattern: "info-<DATE>.log",
    dateFormat: "DD-MM-YYYY",
    timestampFormat: "YYYY-MM-DD HH:mm:ss",
};

const debugLoggerOptions = 
{
    errorEventName: "debug",
    logDirectory: "./logs",
    fileNamePattern: "debug-<DATE>.log",
    dateFormat: "DD-MM-YYYY",
    timestampFormat: "YYYY-MM-DD HH:mm:ss",
};

const infoLogger = require("simple-node-logger").createRollingFileLogger(infoLoggerOptions);
const debugLogger = require("simple-node-logger").createRollingFileLogger(debugLoggerOptions);

infoLogger.setLevel("info");
debugLogger.setLevel("debug");

module.exports =
{
    infoLog: (text) => 
    {
        infoLogger.info(text.replace(/[\t\n\r\f\v ]+/g, " "));
    },
    debugLog: (text) => 
    {
        debugLogger.error(text.replace(/[\t\n\r\f\v ]+/g, " "));
    },
};