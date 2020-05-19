const fs  = require('fs');
const dir = './logs';

module.exports = 
{
    makeDir: function()
    {
        if(!fs.existsSync(dir))
        {
            fs.mkdirSync(dir);
        }
    }
}