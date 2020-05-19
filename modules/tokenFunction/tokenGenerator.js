const jwt    = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

module.exports = 
{
  generateToken: function(company_name, email, contact_number, email_verified, mobile_verified, created_at, updated_at)
  {
    const token = jwt.sign
    ({
      company_name: company_name,
      email: email,
      contact_number: contact_number,
      email_verified: email_verified,
      mobile_verified: mobile_verified,
      created_at: created_at,
      updated_at: updated_at
    },
      process.env.PRIVATE_KEY, {expiresIn: process.env.TOKEN_EXP, issuer : process.env.TOKEN_ISSUER}
    );
    return token;
  }
}