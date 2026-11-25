const mongoose = require('mongoose');
const { config } = require('./app.config');

// connect mongodb database 
const connectDb = async () => {
    try {
        const mongoInstance = await mongoose.connect(config.databaseUrl);
        console.log('Connected to Database');

    } catch (error) {

        console.log('Database connection got failed', error);
        process.exit(1);

    }
}

module.exports = connectDb