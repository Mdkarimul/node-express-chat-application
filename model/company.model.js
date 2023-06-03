const mongo = require("mongoose");
const { Schema } = mongo;

const companySchema = new Schema({
    company_name : {
        type:  String,
        unique : true
    },
    email : {
        type: String,
        unique :true
    },
    mobile : Number,
    emailVerified : {
        type: Boolean,
        default : false,  
    },
    mobileVerified : {
        type: Boolean,
        default : false,  
    },
    created_at : {
        type: Date,
        default : Date.now
    }
});


//company name unique validation
companySchema.pre('save',async function(next) {
    console.log(this);
    const query = {
        company_name : this.company_name,

    };
   const length =await mongo.model("Company").countDocuments(query);
   if(length >0)
   {
       const cmp_error = {
           label : "Company name already exits !",
           field : "company-name"
       }
  throw next(cmp_error);
   }
   else
   {
  next();
   }
});

//company email unique validation
companySchema.pre('save',async function(next) {
    console.log(this);
    const query = {
        email : this.email,

    };
   const length =await mongo.model("Company").countDocuments(query);
   if(length >0)
   {
    const email_error = {
        label : "Company email already exits !",
        field : "company-email"
    }
  throw next(email_error);
   }
   else
   {
  next();
   }
});

module.exports =  mongo.model("Company",companySchema);
