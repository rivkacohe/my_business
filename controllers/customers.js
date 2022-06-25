const joi = require('joi');
const database = require('./database');
const bcrypt = require('bcrypt')

module.exports = {

    addBusinesscard: async function (req, res, next) {
    const reqBody = req.body;
    const schema = joi.object({
        name: joi.string().required().min(2).max(200),
        description: joi.string().required(),
        customerId: joi.number().required(),
        adress: joi.string().required(),
        phone: joi.string().required(),
        img: joi.string().allow(null).allow(''),
    });

    const { error, value } = schema.validate(reqBody);

    if (error) {
        res.send(`error adding Business Card: ${error}`);
        return;
    }

    const sql =
        "INSERT INTO business_cards(name, description, customerId, adress, phone, img)" +
        " VALUES(?,?,?,?,?,?);";

    try {
        const result = await database.query(
            sql,
            [
                reqBody.name,
                reqBody.description,
                reqBody.customerId,
                reqBody.adress,
                reqBody.phone,
                reqBody.img,
            ]
        );
    }
    catch (err) {
        console.log(err);
        return;
    }

    res.send(`${reqBody.name} added successfully`);
},

addCustomer: async function (req, res, next){
    const reqBody = req.body;

    const schema = joi.object({
        name: joi.string().required().min(2).max(200),
        email: joi.string().required().regex(/^[^@]+@[^@]+$/),
        password: joi.string().required().min(6),
        type: joi.string().required(),
    });

    const { error, value } = schema.validate(reqBody);

    if (error) {
        res.send(`error adding customer: ${error}`);
        return;
    }

    const sql =
        "INSERT INTO customers(name, email, password, type)" +
        " VALUES(?,?,?,?);";
        
    try {
        const result = await database.query(
            sql,
            [
                reqBody.name,
                reqBody.email,
                bcrypt.hashSync(reqBody.password, 10),
                reqBody.type
            ]
        );
    }
    catch (err) {
        console.log(err);
        return;
    }

    res.send(`${reqBody.name} added successfully`);   
},
getCustomerDetailes: async function (req, res, next){

    const schema = joi.object({
        customerId: joi.required()
    });
    const { error, value } = schema.validate(req.customer.customerId);

    if (error) {
        res.status(400).send('error get Customer Detailes');
        console.log(error.details[0].message);
        return;
    }

        const sql = 
       " SELECT * FROM `customers`"+
        "WHERE id = ? ;";

        try {    
            const result = await database.query( sql,[
                value.customerId,
            ]);
            res.send(result[0]);
        } 
        catch (err) {
            res.status(400).send(`search error: ${err}`);
            throw error;
        }},

getBusinessDetailes: async function (req, res, next){
    const param = req.query;
    const schema = joi.object({
        id: joi.number(),
        customerId: joi.number()
    }).min(1);

    const { error, value } = schema.validate(param);
    console.log(param);

    if (error) {
        res.status(400).send('error get Business Detailes');
        console.log(error.details[0].message);
        return;
    }

        const sql = 
       " SELECT * FROM `business_cards`"+
        "WHERE id = ? or customerId = ?;";

        try {    
            const result = await database.query( sql,[
                value.id,
                value.customerId,
            ]);
            res.send(result[0]);
        } 
        catch (err) {
            res.status(400).send(`search error: ${err}`);
            throw error;
        }
},
editBusinesscard: async function (req, res, next){
    const reqBody = req.body;
    const schema = joi.object({
        id:joi.number(),
        name: joi.string().min(2).max(200),
        description: joi.string(),
        customerId: joi.number(),
        adress: joi.string(),
        phone: joi.string(),
        img: joi.string().min(5).max(200),
    }).min(1);

    const { error, value } = schema.validate(reqBody);

    if (error) {
        res.status(400).send(`error update Business Card ${error}`);
        return;
    }

    const keys = Object.keys(value);   
    const values = Object.values(value); 
    
    const fields = keys.map(key => `${key}=?`).join(',');
    const sql = `UPDATE business_cards SET ${fields} WHERE id=${value.id}`;


    try {
        const result = await database.query(sql, values);
        res.json(value);
    }
    catch (err) {
        console.log(err);
        return;
    }
},

deleteBusinesscard: async function (req, res, next){
    const schema = joi.object({
        id: joi.number().required()
    });
    const { error, value } = schema.validate(req.params);

    if (error) {
        res.status(400).send('error delete Business Card');
        console.log(error.details[0].message);
        return;
    }

    const sql = `DELETE FROM business_cards WHERE id=?`;

    try {
        const result = await database.query(sql, [value.id]);
        res.json({
            id: value.id
        });
    }
    catch (err) {
        res.status(400).send('error delete  Business Card');
        console.log(err.message);
    }
}
}