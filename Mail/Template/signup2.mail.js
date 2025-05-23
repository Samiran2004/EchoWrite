const SignUp2MailTemplate = (email, name) => {
    return {
        to: email,
        subject: "Sign Up Success",
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to EchoWrite</title>
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
            <h1>Welcome to EchoWrite!</h1>
            <p>Dear ${name},</p>
<p>Thank you for signing up for EchoWrite. We are excited to have you on board.</p>
<p>EchoWrite is a powerful tool designed to help you create and manage your written content with ease.</p>
<p>If you have any questions or need assistance, feel free to contact our support team.</p>
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

export default SignUp2MailTemplate;