const config = require('./config')
const mongoose = require('mongoose')
const Application = require('./models')
console.log(`Connecting to mongo server ${config.mongoUri}`)
mongoose.connect(config.mongoUri,{useNewUrlParser: true, useUnifiedTopology: true})
let db = mongoose.connection


class ApplicationManager {

    async getApplicationByToken(id){
        try {
            return await Application.findOne({token: id})
        } catch (e) {
            console.error(e)
            return null
        }
        
    }
    async getApplicationById(id){
        try {
            return await Application.findById(id)
        } catch (e) {
            console.error(e)
            return null
        }
        
    }

    async addApplication(name){
        //Fails if token is not unique, and retries.
        while (true){
            try {
                let a = new Application({
                    applicationName: name,
                    renewalDueBy: new Date(),
                    token: await this.generateToken(),
                })
                let aid = await a.save()
                return aid._id;
            } catch (e) {

            }
        }
    }

    async generateToken(){
        let t = ""
        while (t === "" || await this.getApplicationByToken(t)){
            t =  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        }
        return t
    }
}

module.exports = {
    ApplicationManager: ApplicationManager}