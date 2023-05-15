const nodemailer = require('nodemailer');
const nodemailergun = require('nodemailer-mailgun-transport');


const passwordEmail = async ({ email, firstName, lastName, message }) => {

  const auth = {
    auth: {
      api_key: '7bfc9f4f9a96064890b559114cfe3e9d-81bd92f8-165f9e23',
      domain: 'sandbox755ea099008c4a1e81e63eb48fbeba68.mailgun.org'
    }
  }


  let transporter = nodemailer.createTransport(nodemailergun(auth));


  const mailOptions = {
    from: 'ajeethkumar.gopal@gmail.com',
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

module.exports = { passwordEmail }
