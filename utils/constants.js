module.exports = {
    endpoints: {
        logView: "/log/view"
    },
    paths: {
        logFile: "/data/example.txt"
    },
    messages: {
        SMTHNG_WRNG: "Something went wrong. Please try again",
        LOG_VIEW_SUCCESS: "Log file read successfully",
        LOG_VIEW_FAIL: "Log file read failed. Retry with correct parameters",
        LOG_VIEW_ERR: "Error reading log file",
        LOG_VIEW_NO_DATA: "No log data found for the given date and time range"
    },
    events: {
        readFile: "Time taken for reading file",
        getLine: "Time taken for fetching line",
        getLineCount: "Time taken for counting number of lines in file"
    }
}