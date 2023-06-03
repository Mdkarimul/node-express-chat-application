const bcrypt = require("bcrypt");

const encrypt =async (data)=>{
 const encrypted =  await bcrypt.hash(data,12);
 return encrypted;
}

const decrypt =async (realPassword,password)=>{
const isVerified = await  bcrypt.compare(password,realPassword);
return isVerified;
}

module.exports = {
    encrypt : encrypt,
    decrypt : decrypt
}