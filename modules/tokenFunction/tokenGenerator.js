const jwt    = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

module.exports = 
{
  generateAccessToken: function(user_code, expire_in, uuid)
  {
      const token = jwt.sign({ user_code: user_code, token_id : uuid},
      process.env.PRIVATE_KEY, {expiresIn : expire_in, issuer : process.env.TOKEN_ISSUER, algorithm : process.env.TOKEN_ALGORITHM});
      return token;
  },

  generateRefreshToken: function(user_code, expire_in, uuid)
  {
      const token = jwt.sign({ user_code: user_code, token_id : uuid},
      process.env.PRIVATE_KEY, {expiresIn : expire_in, issuer : process.env.TOKEN_ISSUER, algorithm : process.env.TOKEN_ALGORITHM});
      return token;
  }
}