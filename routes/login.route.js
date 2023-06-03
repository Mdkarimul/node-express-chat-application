const express = require("express");
const { route } = require("express/lib/application");
const router = express.Router();
const tokenService = require("../services/token.service");
const httpService = require("../services/http.service");
const bcryptService = require("../services/bcrypt.service");

router.post("/",async (request,response)=>{
    const expiresIn = 120;
const token = await tokenService.create_token(request,expiresIn);
//getting user id
const company_res =await httpService.getRequest({
    endpoint : request.get('origin'),
    api : "/api/private/company",
    data : token
});
if(company_res._body.isCompanyExit)
{
 const query ={ 
     body : {
        uid : company_res._body.data[0]._id
     },
     endpoint : request.get("origin"),
     api : "/api/private/user",
     iss:  request.get("origin")+request.originalUrl
 }
 const uidToken =await tokenService.create_custom_token(query,expiresIn);
 //getting user password
 const password_res =await httpService.getRequest({
    endpoint : request.get('origin'),
    api : "/api/private/user",
    data : uidToken
});
 if(password_res._body. isCompanyExit)
 {
     //allow single device
     /*
     if(password_res._body.data[0].isLogged)
     {
         response.status(406);
         response.json({
             message  : 'Please logout from other device !'
         });
         return false;
     }
     */
     const realPassword = password_res._body.data[0].password;
     console.log(realPassword);
    const isLogged = await bcryptService.decrypt(realPassword,request.body.password);
    console.log(isLogged);
    if(isLogged)
    {
        const secondsInOneDay =86400;
        const authToken = await tokenService.create_custom_token(query,secondsInOneDay);
       //update token in database
      const dbToken = await httpService.putRequest({
           endpoint : request.get("origin"),
           api : "/api/private/user",
           data : authToken
       });
        response.cookie("authToken",authToken,{maxAge:(secondsInOneDay*1000)});
        response.status(200);
        response.json({
            isLogged  :true,
            message :  "success !"
        });
    }
    else
    {
        response.status(401);
        response.json({
            isLogged  :false,
            message :  "Wrong password !"
        });
    }
 }
 else
 {
     response.status(password_res.status);
     response.json(password_res._body);
 }
}
else
{
    response.status(company_res.status);
    response.json(company_res._body);
}
});

module.exports = router;