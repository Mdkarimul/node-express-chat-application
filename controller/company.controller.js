const tokenService = require("../services/token.service");
const dbService = require("../services/database.service");
const createCompany =async (request,response)=>{
   const token =  tokenService.verify_token(request);
   if(token.isVerified)
   {
  const data = token.data;
  //now you can store the data
  try {
    const data_res =await dbService.createRecord(data,'company');
    response.status(200);
    response.json({
        isCompanyCreated : true,
        message : "Company created !",
        data : data_res
    });
    //console.log(data_res);
  }catch(error){
  response.status(409);
  response.json({
      isCompanyCreated : false,
      message : error
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


const getCompanyId =async (request,response)=>{
const token = tokenService.verify_token(request);
if(token.isVerified)
{
 const query = {
     email : token.data.email
 }
 const company_res =await dbService.getRecordByQuery(query,'company');
 if(company_res.length >0)
 {
    response.status(200);
    response.json({
        isCompanyExit :true,
        message : "Company available!",
        data  : company_res
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



module.exports = {
    createCompany : createCompany,
    getCompanyId : getCompanyId
};