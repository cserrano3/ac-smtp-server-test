const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD
  }
});

transporter.verify(function (error, success) {
  if (error) {
    console.log('error');
  } else {
    console.log('success')
    console.log("Server is ready to take our messages");
  }
});

app.post('/send', (req, res, next) => {
  const name = req.body.name
  const email = req.body.email
  const subject = req.body.subject
  const message = req.body.message

  const mail = {
    from: name,
    to: email,
    subject: subject,
    text: message
  }

  transporter.sendMail(mail, (err, data) => {

    if (err) {
      res.json({
        status: 'fail',
        err: err.message
      })
    } else {
      res.status(200).send({
        status: 'ok',
        message: 'email was sent successfully'
      })
    }
  });
});

app.listen(3000, () => {
  console.log('Server Listening on 3000')
})