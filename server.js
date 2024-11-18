const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const figlet = require('figlet');
const serveRoute = require('./Routes/serveRoute');
const dbConnect = require('./Services/dbConnection');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const swaggerJsDocs = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

app.use(cors());
require('dotenv').config();

app.use(cookieParser());

// Connect with Database...
dbConnect(process.env.DB_URI);

// Setup view engine...
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares...
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'Public')));

// Swagger setup
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "EchoWrite with Swagger",
            version: "1.0.0",
            description: "EchoWrite API documentation"
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT}`
            }
        ],
    },
    apis: ["./Routes/*.js"]
};

const swaggerDocs = swaggerJsDocs(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/', serveRoute);

// Connect with server...
app.listen(process.env.PORT, (err) => {
    if (err) {
        console.error("Error connecting to the server:", err);
    } else {
        figlet("Server Connected  .  .  .  .", (err, data) => {
            if (err) {
                console.error("Something went wrong!", err);
                return;
            }
            console.log(data);
        });
        console.log(`Server running on port ${process.env.PORT}`);
    }
});
