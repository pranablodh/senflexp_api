const bodyParser       = require('body-parser');
const express          = require('express');
const app              = express();
const cors             = require('cors');
const dotenv           = require('dotenv');
dotenv.config();
const portNumber       = process.env.SERVER_PORT;
const makeDir          = require('./modules/logger/logDirectoryMaker');
const commonRouter     = require('./modules/router/common');
const mobileRouter     = require('./modules/router/mobile');
const deviceRouter     = require('./modules/router/device');
const consumerRouter   = require('./modules/router/consumer');
const technicianRouter = require('./modules/router/technician');
const analysisRouter   = require('./modules/router/analysis');
const adminRouter      = require('./modules/router/admin');

app.use(bodyParser.json({limit: '50mb'}));
app.use(cors());
app.use('/common', commonRouter.router);
app.use('/mobile', mobileRouter.router);
app.use('/device', deviceRouter.router);
app.use('/consumer', consumerRouter.router);
app.use('/technician', technicianRouter.router);
app.use('/analysis', analysisRouter.router);
app.use('/admin', adminRouter.router);
app.use('/files', express.static('public/pdf'));
app.use('/image', express.static('public/image'));

makeDir.makeDir();

app.get('/', (req, res) => 
{
    res.json({Info: 'API Endpoint is Running'});
})

app.listen(portNumber, () => console.log('Server Listnening on Port: ' + portNumber));