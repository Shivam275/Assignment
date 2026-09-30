const path = require('node:path');

require('dotenv').config({
    path: [
        path.resolve(process.cwd(), '.env'),
        path.join(__dirname, '.env')
    ]
});

const config = {
    baseURL: process.env.BASE_URL,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    employeeName: process.env.EMPLOYEE_NAME
};

config.validateCredentials = function () {
    const missing = ['BASE_URL', 'USERNAME', 'PASSWORD']
        .filter((name) => !process.env[name]);

    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
};

module.exports = config;