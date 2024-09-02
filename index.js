const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json());

const transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    auth: {
        user: process.env.GOOGLE_EMAIL,
        pass: process.env.GOOGLE_IN_APP_PASSWORD
    }
})



app.get('/', () => {
    res.send('Hello World');
})

app.post('/send-email', (req, res) => {
    try{
        const {firstName, lastName, company, email, message} = req.body
        console.log(firstName);

        const mailOptions = {
            from: email,
            to: process.env.GOOGLE_EMAIL,
            subject: 'Contact From Portfolio',
            text: `Name: ${firstName} ${lastName}\n ${company}, \n ${email}, \n${message}\n `
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