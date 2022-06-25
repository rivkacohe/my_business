
const jwt = require('jsonwebtoken');
const config = require('../config/dev');
const joi = require('joi');
const database = require('./database');
const bcrypt = require('bcrypt');
const fileMgmt = require('../shared/fileMgmt')

module.exports = {
    login: async function (req, res, next) {
        const reqBody = req.body;

        const schema = joi.object({
            email: joi.string().required().min(6).max(255).email(),
            password: joi.string().required().min(6),
        });
        0
        const { error } = schema.validate(reqBody);
        if (error) {
            console.log(error.details[0].message);
            console.log(reqBody);
            res.status(401).send('Unauthorized');
            return;
        }

        const sql = 'SELECT * FROM customers WHERE email=?;';

        try {
            const result = await database.query(sql, [reqBody.email]);
            const rows = result[0];
            // $2b$10$nOpWM1slxvsqdsHhW4VRkeY8fDsndvrf8aKHAwNdpgf
            // 123456
            const validPassword = await bcrypt.compare(reqBody.password, rows[0].password);
            const customerId ={
                customerId:rows[0].id
            }
            if (!validPassword) throw 'Invalid password';
            const param = {customerId};
            const token = jwt.sign(param, config.JWT_SECRET, { expiresIn: '72800s' });
            console.log(token);
            console.log(customerId);

            res
                .cookie('access_token', token, customerId, {
                    httpOnly: true,
                    secure: true,
                }).redirect('/customers/home')
        } catch (err) {
            console.log(`Error: ${err}`);
            res.status(401).send('Unauthorized');
            return;
        }
    },
} 