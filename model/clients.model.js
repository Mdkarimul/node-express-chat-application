const mongo = require("mongoose");
const { Schema } =  mongo;
const clientSchema = new Schema({
    company_id  : String,
    clientName : String,
    clientEmail : {
        type : String,
        unique : true
    },
    clientCountry : String,
    clientMobile : Number,
    created_at  : {
        type : Date,
        default : Date.now
    },
    updated_at  : {
        type : Date,
        default : Date.now
    }
});

module.exports = mongo.model("Client",clientSchema);
