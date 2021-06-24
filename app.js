const express = require('express');
const app = express();
const http = require('http');
const enforce = require('express-sslify');
const PORT = process.env.PORT || 1010;
const routerIndex = require('./routes/index');
const routerGetbro = require('./routes/getbro');
const routerUpdate = require('./routes/update');
const env = process.env.NODE_ENV;

/**
 * Enforce https for heroku
 */
if (env !== 'dev') {
    app.use(enforce.HTTPS({ trustProtoHeader: true }));
}


/**
 * Include static files
 */
app.use(express.static('public'));


/**
 * Routes
 */
app.use('/', routerIndex);
app.use('/getbro', routerGetbro);
app.use('/update', routerUpdate);


/**
 * Launch server
 */
if (env !== 'dev') {
    http.createServer(app).listen(PORT, () => {
        console.log('Server has been started');
    });
} else {
    app.listen(PORT, () => {
        console.log('Server has been started');
    });
}
