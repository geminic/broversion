const express = require('express');
const { exec } = require('child_process');
const app = express();
const PORT = process.env.PORT || 1010;


/**
 * Index page
 */
app.get('/', (req, res) => {

    /**
     * Get browsers versions from current database
     */
    exec('npx browserslist', (error, stdout) => {
        if (stdout) {
            res.send(renderHtml(stdout));
        } else {
            res.send(renderHtml('Error'));
        }
    });
});


/**
 * Render HTML for index page
 */
function renderHtml(data) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Browsers versions</title>
</head>
<body>
    <h1>Current versions</h1>
    <p>${data}</p>
</body>
</html>
    `;
}


/**
 * Page for database update
 */
app.get('/update', (req, res) => {
    /**
     * Update caniuse-lite database
     */
    exec('npx browserslist@latest --update-db', { env: { 'NO_COLOR': 1 } }, (error, stdout) => {
        if (stdout) {
            res.send(stdout);
        } else {
            res.send('Error');
        }
    });
});


/**
 * Launch server
 */
app.listen(PORT, () => {
    console.log('Server has been started');
});
