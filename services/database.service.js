const mongo = require("mongoose");
const companySchema = require("../model/company.model");
const userSchema = require("../model/user.model");
const clientSchema = require("../model/clients.model");

const schemaList = {
    company : companySchema,
    user : userSchema,
    client : clientSchema
}
const url = "mongodb://localhost:27017/frontwap";
const option = {
 useNewUrlParser :true,
 useUnifiedTopology : true,
 family:4
};
mongo.connect(url,option);


const createRecord =async (data,schema)=>{
  const c_schema =   schemaList[schema];
const collection =  new c_schema(data);
const data_res =await collection.save();
return data_res;
}


const getRecordByQuery =async (query,schema)=>{
const c_schema = schemaList[schema];
const data_res =await c_schema.find(query);
return data_res;
}


const updateByQuery =async (query,schema,data)=>{
  const c_schema = schemaList[schema];
  const data_res =await c_schema.updateOne(query,data);
  return data_res;
  }

  const countData = async (schema)=>{
    const c_schema = schemaList[schema];
    const data_res =await c_schema.countDocuments();
    return data_res;
    }

    const paginate = async (from,to,schema)=>{
      const c_schema = schemaList[schema];
      const data_res =await c_schema.find().skip(from).limit(to);
      return data_res;
      }

      const deleteById = async (id,schema)=>{
        const c_schema = schemaList[schema];
        const data_res =await c_schema.findByIdAndDelete(id);
        return data_res;
        }

        const updateById = async (id,data,schema)=>{
          const c_schema = schemaList[schema];
          const data_res =await c_schema.findByIdAndUpdate(id,data,{new:true});
          return data_res;
          }


module.exports = {
 createRecord : createRecord,
 getRecordByQuery:getRecordByQuery,
 updateByQuery:updateByQuery,
 countData: countData,
 paginate : paginate,
 deleteById:deleteById,
 updateById:updateById
};