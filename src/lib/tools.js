const md5 = require('md5');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { secret } = require('../keys')

module.exports = {
    process(email, date_in, pswd_in) {
        // MD5
        const usrid = md5(email)

        // Date format
        let date = new Date(date_in)
        let form_date = `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`


        // SHA256 - salt: email
        const pswd = crypto.createHash('sha256').update(email + pswd_in).digest('hex');

        return { usrid, form_date, pswd }
    },
    authenticate(email, password) {
        // MD5
        const usrid = md5(email)

        // SHA256 - salt: email
        const pswd = crypto.createHash('sha256').update(email + password).digest('hex');

        return { usrid, pswd }
    }, verifyToken(req, res, next) {
        const token = req.headers['x-access-token'];
        if (!token) {
            return res.status(401).json({
                auth: false,
                message: "Sin token proporcionado"
            });
        }
        const decoded = jwt.verify(token, secret);
        req.user_id = decoded.user_id
        next();
    }
}