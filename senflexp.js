const bodyParser   = require('body-parser');
const express      = require('express');
const app          = express();
const cors         = require('cors');
const dotenv       = require('dotenv');
dotenv.config();
const portNumber   = process.env.SERVER_PORT;
const makeDir      = require('./modules/logger/logDirectoryMaker');
const commonRouter = require('./modules/router/common');
const mobileRouter = require('./modules/router/mobile');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use('/common', commonRouter.router);
app.use('/mobile', mobileRouter.router);

makeDir.makeDir();

app.get('/', (req, res) => 
{
    res.json({Info: 'API Endpoint is Running'});
})

app.listen(portNumber, () => console.log('Server Listnening on Port: ' + portNumber));