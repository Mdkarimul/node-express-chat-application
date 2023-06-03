const { get } = require("express/lib/response");
const ajax = require("supertest");
const { set } = require("../app");


const post_request =async (request)=>{
const response = await ajax(request.endpoint)
.post(request.api)
.send({token : request.data});
return response;
}

const getRequest =async (request)=>{
const response   = await ajax(request.endpoint)
.get(request.api+"/"+request.data)
.set({'X-Auth-Token' : request.data});
return response;
}

const putRequest =async (request)=>{
    const response   = await ajax(request.endpoint)
    .put(request.api+"/"+request.data)
    .send({token: request.data});
    return response;
    }

module.exports = {
    post_request:post_request,
    getRequest:getRequest,
    putRequest : putRequest
};