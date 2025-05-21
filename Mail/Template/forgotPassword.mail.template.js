const ForgotPasswordMailTemplate = ({ email, name, link }) => {
    return {
        to: email,
        subject: "Reset Password",
        html: `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Reset Your Password</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                background-color: #f4f4f4;
                                margin: 0;
                                padding: 0;
                            }
                            .container {
                                width: 100%;
                                padding: 20px;
                                background-color: #f4f4f4;
                            }
                            .content {
                                max-width: 600px;
                                margin: 0 auto;
                                background-color: #ffffff;
                                padding: 20px;
                                border-radius: 8px;
                                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                            }
                            h1 {
                                color: #333333;
                            }
                            p {
                                color: #666666;
                            }
                            .button {
                                display: inline-block;
                                padding: 10px 20px;
                                margin-top: 20px;
                                background-color: #007BFF;
                                color: #ffffff;
                                text-decoration: none;
                                border-radius: 5px;
                            }
                            .footer {
                                text-align: center;
                                margin-top: 20px;
                                color: #999999;
                                font-size: 12px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="content">
                                <h1>Reset Your Password</h1>
                                <p>Dear ${name},</p>
                                <p>Please click the link below to reset your password:</p>
                                <p><a href="${link}" class="button">Reset Password</a></p>
                                <p>Best regards,</p>
                                <p>The EchoWrite Team</p>
                                <a href="https://echowrite.onrender.com" class="button">Visit EchoWrite</a>
                                <div class="footer">
                                    <p>&copy; 2024 EchoWrite. All rights reserved.</p>
                                    <p>123 EchoWrite Street, Suite 100, WriteCity, WC 12345</p>
                                </div>
                            </div>
                        </div>
                    </body>
                    </html>`
    }
}

export default ForgotPasswordMailTemplate;