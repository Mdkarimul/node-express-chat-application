const tokenService = require("../services/token.service");
const databaseService = require("../services/database.service");
const createUser =async (request,response)=>{
const token =  tokenService.verify_token(request);
if(token.isVerified)
{
    try {
        //start auto login during signup
   const uidJson = {
   uid : token.data.uid,
   }
   const endpoint =  request.get("origin") || "http://"+request.get("host");
   const option = {
       body : uidJson,
       endpoint : endpoint,
       originalUrl : request.originalUrl,
       iss : endpoint+request.originalUrl,
   }
   const expiresIn = 86400;

  const newToken  = await tokenService.create_custom_token(option,expiresIn);
  token.data['token'] = newToken;
  token.data['expiresIn'] = 86400;
  token.data['isLogged'] = true;
        //end auto login during signup

     const user_res = await  databaseService.createRecord(token.data,'user');
     response.status(200);
     response.json({
         isUserCreated  :true,
         token : newToken,
         message : "user created !"
     });
    }catch(error){
        response.status(500);
        response.json({
            isUserCreated  :false,
            message : "Internal server error !"
        });
    }
}
else {
    response.status(401);
    response.json({
        message : "Permission denied !"
    });
}
}


const getUserPassword =async (request,response)=>{
const token = await tokenService.verify_token(request);
if(token.isVerified)
{
const query = token.data;
const data_res = await databaseService.getRecordByQuery(query,'user');
if(data_res.length >0)
{
    response.status(200);
    response.json({
        isCompanyExit : true,
        message : "success",
        data : data_res
    });
}
else
{
    response.status(404);
    response.json({
        isCompanyExit : false,
        message : "Company not found !"
    });
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





const createLog =async (request,response)=>{
    const token = await tokenService.verify_token(request);
    if(token.isVerified)
    {
        const query = {
            uid: token.data.uid,
        };
        const data=  {
        token : request.body.token,
        expiresIn : 86400,
        isLogged : true,
        updated_at : Date.now()
        };
      const user_res = await  databaseService.updateByQuery(query,"user",data);
      response.status(201);
      response.json({
          message : "Update success !"
      });
  console.log(request.body.token);
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
    createUser : createUser,
    getUserPassword : getUserPassword,
    createLog:createLog
}