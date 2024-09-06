const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const joi = require("joi");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json());
app.disable('x-powered-by')

const transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    auth: {
        user: process.env.GOOGLE_EMAIL,
        pass: process.env.GOOGLE_IN_APP_PASSWORD
    }
})

app.get('/', (req,res) => {
    res.send('Hello World');
})

app.post('/send-email', async (req, res) => {
    try{
        console.log(req.body);
        const schema = joi.object({
            firstName: joi.string().min(3).max(30).required(),
            lastName: joi.string().min(3).max(30).required(),
            email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
            company: joi.string().min(10).max(30).optional(),
            message: joi.string().min(10).max(200).required(),
        })

        const success = await schema.validateAsync(req.body)

        if(success){
            let {firstName, lastName, company, email, message} = req.body
            company = company === undefined ? '': company
        
            let mailOptions = {
                from: email,
                to: process.env.GOOGLE_EMAIL,
                subject: 'Contact From Portfolio',
                text: `Name: ${firstName} ${lastName},\n ${company}, \n ${email}, \n${message}\n `
            }

            transporter.sendMail(mailOptions, (err, info) => {
                if(err){
                    return res.status(500).json({
                        success: false,
                        message: `Failed to send the message ${err}` 
                    })
                }
                res.status(200).json({
                    success: true,
                    message: `Message Sent Successfully ${JSON.stringify(info)}`
                })
            })
        } else {
            return res.status(400).json({
                success: false,
                message: `False Statement`
            })
        }

        
    } catch (err){
        return res.status(500).json({
            success: false,
            message: `Failed to send the message ${err}` 
        })
    }
    
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})