require('dotenv').config()
var nodemailer = require('nodemailer');


// General mailer to send notifications, can be only used inside req,res function via router
const Mailer = async (to, sub, body) => {

    return new Promise((resolve, reject) => {

        const mailPass = process.env.EMAIL_PASS2;
        const email = process.env.EMAIL
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: email,
                pass: mailPass
            }
        });
        var mailOptions = {
            from: email,
            to: to,
            subject: sub,
            attachments: [
                {   // utf-8 string as an attachment
                    filename: 'https://res.cloudinary.com/dgamp83c3/image/upload/v1690659104/to-let-images/rentlogo_jzns35.png',
                    content: 'logo',
                    cid: "8303203jdidca0dxs2"
                }
            ],
            html: `<html>
            <head>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
        rel="stylesheet">
</head>

<body>
    <div
        style="margin: 0 auto; width: 650px; background: #fff; min-height: 200px; text-align: center; padding: 25px; border: 1px solid rgba(255, 241, 207, 0.62);">
        <img src="https://res.cloudinary.com/dgamp83c3/image/upload/v1690659104/to-let-images/rentlogo_jzns35.png"
            alt="To-Let" title="To-Let" width="150">
        <div style="color: #101828; font-size: 20px; font-weight: 600; padding: 25px 0; font-family: Inter;">${sub}
        </div>
        <div style="color: #101828; font-size: 18px; padding:25px 0; font-family: Inter; margin-bottom: 100px;">${body}
        </div>
        <div style="color: #344054; font-size: 14px;align-items: end; padding:25px 0; font-family: Inter;">If you did
            not request, you can safely ignore this email.</div>
    </div>
    <div
        style="margin: 0 auto; font-family: Inter; width: 650px; padding: 25px; background: rgba(255, 241, 207, 0.62); text-align: center;">
        <div style="font-size: 13px">Copyright © 2023 Sanjeev Singh, All rights reserved.</div>
    </div>
</body>

</html>`
        };

        try {
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log("error is " + error);
                    resolve(false); // or use rejcet(false) but then you will have to handle errors
                }
                else {
                    console.log('Email sent: ' + info.response);
                    resolve(true);
                }
            });
        } catch (error) {
            resolve(false);
        }
    })

}

module.exports = Mailer




