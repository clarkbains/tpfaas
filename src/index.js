const express = require('express')
const am = require('./userManager')
const fetch = require('node-fetch')
const config = require('./config')
let app = express()
let manager = new am.ApplicationManager()
console.log(`${config.applicationName} Starting up...`)

app.use(express.json())
app.get("/api/fact", async (req,res)=>{
    let key = req.headers['X-Api-Key'] || req.query['key']
    let app = await manager.getApplicationByToken(key)
    console.log(`Got Request with key ${key}. ${app?`App is ${app.applicationName}`:`No App Found`}`)
    if (app){
        let r = await fetch(config.factsApi)
        let rb = await r.text()
        console.log("Got Fact: ", rb)
        let slc = rb.slice(0,app.characters)
        console.log(`Client Paid for ${app.characters} characters. Sliced to: `, slc)
        res.send(slc)
    } else{
        res.status(401).send("Invalid Token. Attach as X-Api-Key header or key query parameter")
    }
})

app.post("/api/app", async (req,res)=>{
    let name = req.body.name || "Sample Application"
    let id = await manager.addApplication(name)
    let app = await manager.getApplicationById(id)
    res.json(app.asResponse())

})

app.get("/api/app/:id", async (req,res)=>{
    let app = await manager.getApplicationById(req.params.id)
    if (app)
        res.json(app.asResponse())
    else
        res.status(404).json({})
})

app.post("/api/app/:id/renew", async (req,res)=>{
    let app = await manager.getApplicationById(req.params.id)
    let payment = Number(req.body.amount || 5)
    let tier = Math.max(1, Math.min(100, payment))
    let number = (req.body.card || "000000000000").replace(/[^\d]/g,"")
    if (app){
        let paid = true
        if (!number || number.length != 16 || number.match(/^0+$/)){
            paid = false
        }
        if (paid){
            await app.extend(29, tier)
            app.save()
        }
        res.json({
            success: paid,
            total: tier,
            characters: app.characters,
            expires: app.renewalDueBy,
        })
    }
    else{
        res.status(404).json({})
    }
})

app.listen(Number(config.port))