const nodemailer = require('nodemailer');
const nodemailergun = require('nodemailer-mailgun-transport');


const passwordEmail = async ({ email, firstName, lastName, message }) => {
  

  const auth = {
    auth: {
      api_key: '756c2b87a44b16f9ae1a13d4c21f362c-db4df449-26c75377',
      domain: 'sandboxcb7198d726344cc0a34de05cbaa915e3.mailgun.org'
    }
  }


  let transporter = nodemailer.createTransport(nodemailergun(auth));

  const mailOptions = {
    from: 'ajeevishnu2026@gmail.com',
    to: `${email}`,
    subject: "Reset password - Pizza hut ",
    html: ` <div style="background-color: antiquewhite; margin-left:25%; margin-right:25%; padding:20px;">
        <div>
          <b>Hello ${firstName} ${lastName},</b>
        </div>
        <br>
        <br>
        <div>
          Expires in 30 mins-${message}
        </div>
        <br>
        <footer style="text-align: center;">
          <b>Thank you from pizza hut</b>
        </footer>
      </div>`
  }

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log('Error' + err);
    } else {
      console.log('Email send');
    }
  })


}

module.exports =  {passwordEmail} 
