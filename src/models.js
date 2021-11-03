const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    applicationName: String,
    token: {type: String , unique: true}, 
    characters: { type: Number, default: 0},
    renewalDueBy: { type: Date},
})
applicationSchema.methods = {
    asResponse: function(){
        return {
            id:this.id,
            token:this.token,
            name:this.name,
            valid:this.isValid()
        }
    },
    extend: async function(count, character=null){
        this.characters = Number(character) || this.characters
        this.renewalDueBy.setTime((new Date()).getTime() +  count * 24 * 60 * 60 * 1000);
        //since it doesn't pick up the setTime method as a change.
        this.markModified('renewalDueBy')
        await this.save()
    },

    isValid: function(){
 
        return (new Date()).getTime() < this.renewalDueBy.getTime() 
    }
}


module.exports = mongoose.model('Application', applicationSchema);