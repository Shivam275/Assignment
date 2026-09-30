const { randomUUID } = require('node:crypto');
const { employeeName } = require('../config/config');

function createTestUser() {
    return {
        username: `qauser_${randomUUID().replaceAll('-', '').slice(0, 12)}`,
        password: 'Test@12345',
        role: 'ESS',
        status: 'Enabled',
        employeeName
    };
}

module.exports = {
    createTestUser
};
