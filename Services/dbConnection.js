const mongoose = require('mongoose');

async function databaseConnect(dbUri) {
    try {
        await mongoose.connect(dbUri);
        console.log("⚙️  ⚙️  ⚙️  Database connected ⚙️  ⚙️  ⚙️");
    } catch (error) {
        console.log("Database connection error ❌  ❌  ❌");
    }
}
module.exports = databaseConnect;