const tokenService = require("../services/token.service");
const databaseService = require("../services/database.service");

const refreshToken =async (uid,request)=>{
   const endpoint =  request.get("origin") || "http://"+request.get("host");
   const option = {
       body : uid,
       endpoint : endpoint,
       originalUrl : request.originalUrl,
       iss : endpoint+request.originalUrl,
   }
   const expiresIn = 86400;

  const newToken  = await tokenService.create_custom_token(option,expiresIn);
  const updateMe = {
      token : newToken,
      expiresIn : 86400,
      updated_at: Date.now()
  }
 await databaseService.updateByQuery(uid,"user",updateMe);
 return newToken;
}
const checkUserLog = async (request,response)=>{
 const token_data = await tokenService.verify_token(request);
 if(token_data.isVerified)
 {
     const query = {
         token : request.cookies.authToken,
         isLogged : true
     };
const user_data = await databaseService.getRecordByQuery(query,"user");
if(user_data.length >0)
{
  const newToken =  await refreshToken(token_data.data,request);
   response.cookie("authToken",newToken,{maxAge :(86400*1000)});
   return true;
}
else
{
    return false;
}
 }
 else
 {
     return false;
 }
}


const logout =async (request,response)=>{
    const token_data = await tokenService.verify_token(request);
    if(token_data.isVerified)
    {
        const query = {
            token : request.cookies.authToken,
        }
        const updateMe = {
            isLogged : false,
            updated_at : Date.now()
        }
 const user_res =await  databaseService.updateByQuery(query,"user",updateMe);
 if(user_res.acknowledged)
 {
    await response.clearCookie("authToken");
    response.redirect("/");
 }
 else 
 {
    response.redirect("/profile");
 }
    }
    else
    {
        response.status(401);
        response.json({
            message : "Permission denied !"
        });
    }
}

module.exports = {
    checkUserLog  :checkUserLog,
    logout : logout
}