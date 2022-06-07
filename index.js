const express = require('express');
const app = express();
const server = require('http').createServer(app);

// Startup
require('./startup/db')();
const { startupSocket } = require('./startup/socket')
startupSocket(server);
require('./startup/routes')(app);
require('./startup/prod')(app);


console.log(`Environment: ${process.env.NODE_ENV}`);

const port = process.env.PORT || 8080
server.listen(port, () => console.log(`Listening on port ${port}`));
// require('./generateUser')();