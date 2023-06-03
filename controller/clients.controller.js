const tokenService = require("../services/token.service");
const databaseService = require("../services/database.service");
const create =async (request,response)=>{
  const tokenData =await tokenService.verify_token(request);  
  if(tokenData.isVerified)
  {
    const data = request.body;
    data['companyId'] = tokenData.data.uid;
    try{  
        const data_res = await databaseService.createRecord(data,"client");
        response.status(200);
        response.json({
            message : "Record created !",
            data : data_res
        });
    }catch(error)
    {
        response.status(409);
        response.json({
            message : "Record not created !",
            error : error
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


const countClient =async (request,response)=>{
    const tokenData =await tokenService.verify_token(request);  
    if(tokenData.isVerified)
    {
  const data_res =await  databaseService.countData('client');
  response.status(200);
  response.json({
      data : data_res
  });
    }else
    {
        response.status(401);
        response.json({
            message : "permission denied"
        });
    }
}


const paginate =async (request,response)=>{
    const tokenData =await tokenService.verify_token(request);  
    if(tokenData.isVerified)
    {
        let from = Number(request.params.from);
        let to = Number(request.params.to);
       const data_res = await databaseService.paginate(from,to,'client');
        response.status(200);
        response.json({
           data: data_res
        });
    }
    else
    {
        response.status(401);
        response.json({
            message  :"Permission denied !"
        });
    }
}



const deleteClient =async (request,response)=>{
    const tokenData =await tokenService.verify_token(request);  
    if(tokenData.isVerified)
    {
        const id  =request.params.id;
    const delete_res = await  databaseService.deleteById(id,'client');
    response.status(200);
    response.json({
        data : delete_res
    });
    }
    else
    {
        response.status(401);
        response.json({
            message  :"Permission denied !"
        });
    }

}


const updateClient =async (request,response)=>{
    const tokenData =await tokenService.verify_token(request);  
    if(tokenData.isVerified)
    {
    const id  =request.params.id;
   const data = request.body;
   const update_res =await databaseService.updateById(id,data,'client');
   response.status(201);
   response.json({
       data : update_res
   });
    }
    else
    {
        response.status(401);
        response.json({
            message  :"Permission denied !"
        });
    }

}






module.exports = {
    create : create,
    countClient:countClient,
    paginate : paginate,
    deleteClient:deleteClient,
    updateClient:updateClient
}