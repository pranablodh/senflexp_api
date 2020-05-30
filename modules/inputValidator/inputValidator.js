const bcrypt            = require('bcrypt');
const passwordValidator = require('password-validator');
const {isUuid}          = require('uuidv4');
const salt_round        = 10; 
const schema            = new passwordValidator();

schema.is().min(8).is().max(15).has().uppercase().has().lowercase()                              
.has().digits().has().symbols().has().not().spaces()
.is().not().oneOf(['Passw0rd', 'Password123', 'Qwerty1234']);

module.exports = 
{
    hashPassword: function(password)
    {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(salt_round));
    },

    comparePassword: function(hashPassword, password) 
    {
        return bcrypt.compareSync(password, hashPassword);
    },

    isValidPassword: function(password)
    {
        return schema.validate(password);
    },

    isValidEmail: function(email) 
    {
        return /\S+@\S+\.\S+/.test(email);
    },

    isValidMobileNumber: function(mobile)
    {
        return /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/.test(mobile);
    },

    isValidString: function(data)
    {
        return /^[a-z][a-z\s]*$/i.test(data);
    },

    isValidAlphaNumericString: function(data)
    {
        return /^[a-z0-9]+$/i.test(data);
    },

    isvalidPinCode: function(pin)
    {
        return /^\d{6}(,\d{6})*$/.test(pin)
    },

    isvalidGSTIN: function(gstin)
    {
        let regTest = /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/.test(gstin);
        if(regTest)
        {
            let a=65, b=55, c=36;
            return Array['from'](gstin).reduce((i, j, k, gstin)=>
            { 
                p=(p=(j.charCodeAt(0)<a?parseInt(j):j.charCodeAt(0)-b)*(k%2+1))>c?1+(p-c):p;
                return k<14?i+p:j==((c=(c-(i%c)))<10?c:String.fromCharCode(c+b));
            },0); 
        }
        return regTest;
    },

    isValidUUID: function(data)
    {
        return isUuid(data);
    },

    isValidDate: function(data)
    {
        return /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/.test(data);
    },

    isValidUnsignedInteger: function(data)
    {
        return /^\+?\d+$/.test(data)
    }
}