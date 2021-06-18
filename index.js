const express = require('express');
const app = express();

const PORT = process.env.PORT || 1010;

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

app.listen(PORT, () => {
    console.log('Server has been started');
});
