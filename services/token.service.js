require("dotenv").config();
const jwt = require("jsonwebtoken");
const secret_key = process.env.SECRET_KEY;
const issService = require("./iss.service");

const create_token = async (request,expiresIn)=>{
const form_data = request.body;
const endpoint = request.get("origin");
const api = request.originalUrl;
const iss = endpoint+api;
const token= await jwt.sign({
    iss : iss,
    data : form_data
},secret_key,{expiresIn:expiresIn});
return token;
}

const create_custom_token = async (data,expiresIn)=>{
  const form_data = data.body;
  const endpoint = data.endpoint;
  const api = data.originalUrl;
  const iss = data.iss;
  const token= await jwt.sign({
      iss : iss,
      data : form_data
  },secret_key,{expiresIn:expiresIn});
  return token;
  }




const verify_token = (request)=>{
  let token = "";
  if(request.method=="GET")
  {
    if(request.headers['x-auth-token'])
    {
      token = request.headers['x-auth-token'];
    }
    else
    {
      token = request.cookies.authToken;
  
    }
 
  }
  else
  {
     token =  request.body.token;
  }
 
  if(token)
  {
      try{
      const tmp =   jwt.verify(token,secret_key);
      const requestCommingFrom = tmp.iss;
      if(issService.indexOf(requestCommingFrom) != -1)
      {
        return {
          isVerified : true,
          data : tmp.data
        };
      }
      else
      {
        return {
          isVerified : false
        };
      }
      }catch(error){
        return {
          isVerified : false
        };
      }
  
  }
  else
  {
    return {
      isVerified : false
    };
  }
}

module.exports = {
    create_token : create_token,
    verify_token : verify_token,
    create_custom_token:create_custom_token
}