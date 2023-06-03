const mongo = require("mongoose");
const { Schema }  = mongo;
const bcryptService = require("../services/bcrypt.service");
const userSchema = new Schema({
    uid : {
      type :String,
      unique : true
    },
    password : {
        type : String,
        required : [true, " Password field is required !"]
    },
    token : String,
    expiresIn : Number,
    isLogged : Boolean,
    created_at : {
        type : Date,
        default : Date.now
    },
    updated_at :{
      type : Date,
      default :  Date.now
    }
});

userSchema.pre("save",async function(next){
    const data = this.password.toString();
  const enc_passowrd =  await bcryptService.encrypt(data);
  this.password = enc_passowrd;
  next();
});
module.exports = mongo.model("User",userSchema);
