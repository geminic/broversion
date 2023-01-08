/**
 * Endpoint to update the database
 */
const express = require('express');
const router = express.Router();
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');

router.get('/', (req, res) => {
    /**
     * Update the caniuse-lite database
     */
    exec('npx browserslist@latest --update-db', (error, stdout) => {
        if (error) {
            res.send(error);
        } else if (stdout) {
            writeLog(stdout);
            res.send(stdout);
        } else {
            res.send('Error');
        }
    });
});


/**
 * Write the result to the json file if the update was successful
 */
function writeLog(data) {
    /**
     * Compare the new log with the old one and choose what to write
     */
    const oldLog = getUpdateLog();
    const updResult = parseResult(data);
    const newLog = {};

    /**
     * Timestamp of the last succesfull request to the canise-lite repo,
     * it doesn't depend on if the database has been changed or not
     */
    newLog.lastUpdate = new Date().getTime();

    /**
     * If the new database version is equal to the old one,
     * it means that it hasn't been changed
     * and we leave the old database timestamp in the log
     */
    newLog.dbTime
        = updResult.newVersion && updResult.newVersion !== updResult.oldVersion
        ? new Date().getTime()
        : oldLog.dbTime || new Date().getTime(); // In case of emergency add current time :P

    /**
     * New version of database (or save the old just in case)
     */
    newLog.dbVersion = updResult.newVersion || oldLog.dbVersion;


    /**
     * Rewrite the log file
     */
    try {
        fs.writeFile(
            path.resolve(__dirname, '../bro_update_log.json'),
            JSON.stringify(newLog),
            () => {
                console.log('JSON data is saved.')
            }
        );
    } catch (error) {
        console.log(error);
    }
}


/**
 * We need the result of the update as an object, not a string
 */
function parseResult(data) {
    /**
     * String to array, then to object
     */
    const arr = data.split(/\r?\n/);
    const list = {};

    arr.forEach(x => {
        const a = x.split(':');
        list[a[0]] = a[1];
    });


    /**
     * Normalize names
     */
    const formatted = {
        'newVersion': list['Latest version'].trim(),
        'oldVersion': list['Installed version'].trim()
    }

    return formatted;
}

module.exports = router;


/**
 * Get information about the last update
 */
function getUpdateLog() {
    let log = {};

    try {
        log = JSON.parse(
            fs.readFileSync(path.resolve(__dirname, '../bro_update_log.json'))
        );
    } catch (error) {
        console.log(error);
    }

    return log;
}
