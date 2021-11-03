const process = require('process')
module.exports = {
    applicationName: "TPFaaS",
    factsApi: process.env['FACTS_API_URI'] || 'http://printerfacts/printerfacts',
    port: process.env['PORT'] || 2345,
    mongoUri: process.env['MONGO_URI'] || `mongodb://mongo:27017/tpfaas`
}

