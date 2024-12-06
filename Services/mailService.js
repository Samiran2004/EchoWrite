import nodemailer from 'nodemailer';
const sendMail = async (data, callback) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: data.to,
        subject: data.subject,
        html: data.html
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            callback(error, null);
        } else {
            callback(null, info.response);
        }
    });
}

export default sendMail;