/**
 * Endpoint to get browsers versions
 */
const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

router.get('/', (req, res) => {
    /**
     * Get browsers versions from the current database
     */
    exec('npx browserslist', (error, stdout) => {
        if (stdout) {
            const data = parseResult(stdout);
            printResult('success', data, res);
        } else {
            printResult('error', false, res);
        }
    });
});


/**
 * Convert data to JSON
 */
function parseResult(data) {
    /**
     * Browserslist's string to array, then to object
     */
    const arr = data.split(/\r?\n/);
    const list = {};

    arr.forEach(x => {
        const a = x.split(' ');
        list[a[0]] = a[1];
    });

    /**
     * Normalize names and separate mobile browsers from desktop
     */
    const log = getUpdateLog();
    const formatted = {
        'success': true,
        'lastUpdate': formatTime(log.lastUpdate),
        'dbVersion': `${log.dbVersion} (${formatTime(log.dbTime)})`,
        'desktop': [
            ['Chrome', list.chrome],
            ['Safari', list.safari],
            ['Firefox', list.firefox],
            ['Opera', list.opera],
            ['Edge', list.edge]
        ],
        'mobile': [
            ['Chrome Mobile', list.and_chr],
            ['iOS Safari', list.ios_saf],
            ['Samsung Internet', list.samsung]
        ]
    }

    return JSON.stringify(formatted);
}


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


/**
 * Send response
 */
function printResult(status, data, res) {
    if (status === 'error') {
        res.send(JSON.stringify({ success: false }));
        return;
    }

    res.send(data);
}


/**
 * Format time
 */
function formatTime(timestamp) {
    const date = new Date(timestamp);

    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('en', { month: 'short' });
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
}


module.exports = router;
