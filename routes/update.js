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
 * In case of succeed update write result to json file
 */
function writeLog(data) {
    const obj = {
        lastUpdate: new Date().getTime(),
        dbVersion: '1.0.123456657',
        dbTime: 1624285052925
    }

    fs.writeFile(
        path.resolve(__dirname, '../bro_update_log.json'),
        JSON.stringify(obj),
        () => {
            console.log('JSON data is saved.')
        }
    );
}

module.exports = router;
