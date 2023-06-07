
const express = require("express");
const router = express.Router();
const tokenService = require("../services/token.service");
const httpService = require("../services/http.service");
router.post("/", async (request,response)=>{
    const form_data = request.body;
    const expiresIn = 120;
  const token =await  tokenService.create_token(request,expiresIn);
  //requesting company api
 const company_res = await httpService.post_request({
      endpoint : request.get('origin'),
      api : "/api/private/company",
      data : token
  });
  //requesting user api
  if(company_res.body.isCompanyCreated)
  {
const newUser = {
  body : {
    uid : company_res.body.data._id,
    password : request.body.password,
  },
  endpoint : request.get('origin'),
  originalUrl : request.originalUrl,
  iss : request.get("origin")+request.originalUrl
};
const user_token = await  tokenService.create_custom_token(newUser,expiresIn);
  //requesting user api
  const user_res = await httpService.post_request({
    endpoint : request.get('origin'),
    api : "/api/private/user",
    data : user_token
})
// return user response 
 response.cookie("authToken",user_res.body.token,{maxAge:(86400*1000)});
 response.status(user_res.status);
 response.json(user_res.body);
  }
  else
  {
    response.status(company_res.status);
    response.json(company_res);
  }
});

module.exports = router;