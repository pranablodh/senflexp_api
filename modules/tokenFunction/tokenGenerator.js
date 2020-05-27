const jwt    = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

module.exports = 
{
  generateAccessToken: function(user_code, uuid)
  {
      const token = jwt.sign({ user_code: user_code, token_id : uuid},
      process.env.PRIVATE_KEY_ACCESS, {expiresIn : process.env.TOKEN_EXP_ACCESS, issuer : process.env.TOKEN_ISSUER, 
      algorithm : process.env.TOKEN_ALGORITHM});
      return token;
  },

  generateRefreshToken: function(user_code, uuid)
  {
      const token = jwt.sign({ user_code: user_code, token_id : uuid},
      process.env.PRIVATE_KEY_REFRESH, {expiresIn : process.env.TOKEN_EXP_REFRESH, issuer : process.env.TOKEN_ISSUER, 
      algorithm : process.env.TOKEN_ALGORITHM});
      return token;
  }
}