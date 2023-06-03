//get country phone codes
$(document).ready(function(){
    $("#country").on("input",async function(){
        let keyword = $(this).val().trim().toLowerCase();
        const localData = checkInLs("countryCode");
        if(localData.isExit)
        {
         const countries = localData.data;
         for(let country of countries)
         {
        if(country.name.toLowerCase().indexOf(keyword) != -1)
        {
           let dial_code = country.dial_code;
           $("#code").html(dial_code);
        }
         }
        }
        else
        {
            const request = {
                type : "GET",
                url : "../json/country-code.json"
            }
          const response  = await  ajax(request);
         const countryData =  JSON.stringify(response);
         localStorage.setItem("countryCode",countryData);
        
        }
       

    });
});

//open modal
$(document).ready(function(){
    $("#add_client_btn").click(function(){
        $("#client_form").addClass("add-client-form");
        $("#client_form").removeClass("update-client-form");
        $(".add-client-submit").html("submit");
        $(".add-client-submit").removeClass("btn-danger px-3");
        $(".add-client-submit").addClass("btn-primary");
       $("#clientModal").modal('show');
       addClient();
    });
});

//addclients 
   function addClient(){
    $(".add-client-form").submit(async function(e){
   e.preventDefault();
  const token =  getCookie("authToken");
  const form_data = new FormData(this);
  form_data.append("token",token);
   const request = {
       type : "POST",
       url : "clients",
       data : form_data,
       isLoader : true,
       common_btn : ".add-client-submit",
       loader_btn : ".add-client-loader"
   }
   const response =  await ajax(request);
   console.log(response);
   const client = response.data;
   const tr = dynamicTr(client);
   $("table").append(tr);
   //activate edit delete and share
   clientAction();
   try {
   const response =  await ajax(request);
   console.log(response);
   $("#clientModal").modal("hide");
   }
   catch(error)
   {
       $("#addClientEmail").addClass("animate__animated animate__shakeX text-danger");
       $("#addClientEmail").click(function(){
           $(this).removeClass("animate__animated animate__shakeX text-danger");
           $(this).val("");
       });

    $("#clientModal").modal("hide");
  alert("Something is not right !");

   }
    });
};



//update clients
function updateClient(old_tr){
    $(".update-client-form").submit(async function(e){
        e.preventDefault();
        const id = $(this).data("id");
        const token = getCookie("authToken");
        const form_data = new FormData(this);
        form_data.append("token",token);
        form_data.append("updated_at",new Date());

        const request = {
            type : "PUT",
            url : "/clients/"+id,
            data : form_data,
            common_btn : ".add-client-submit",
            loader_btn : ".add-client-loader",
            isLoader : true
        }
       const response = await ajax(request);
        const client  = response.data;
        const tr = dynamicTr(client);
        const updated_td = $(tr).html();
        $(old_tr).html(updated_td);
        $("#clientModal").modal('hide');
        clientAction();
    }); 
};


function getCookie(cookie_name){
  const all_cookie = document.cookie;
 let cookies = all_cookie.split(";");
 let cookie_value = "";
 for(let cookie of cookies)
 {
    let current_cookie = cookie.split("=");
    if(current_cookie[0]==cookie_name)
    {
        cookie_value =  current_cookie[1];

        //console.log(cookie_value);
        break;
    }
 }
 return cookie_value;
}

function checkInLs(key){
    if(localStorage.getItem(key) != null)
    {
        let temp = localStorage.getItem(key);
      const data  =   JSON.parse(temp);
      return {
          isExit : true,
          data : data
      }
    }
    else {
        return {
            isExit : false
            
        }
    }
}

function ajax(request){
    return new Promise((resolve,reject)=>{
        let option  = {
            type : request.type,
            url :  request.url,
            // data : request.type=="GET" ? {} : request.data,
            // processData : request.type=="GET" ? true : false,
            // contentType :  request.type=="GET" ? "application/json" : false,
            beforeSend : function(){
          if(request.isLoader)
          {
              $(request.common_btn).addClass("d-none");
              $(request.loader_btn).removeClass("d-none");
          }
            },
            success : function(response){
                if(request.isLoader)
                {
                    $(request.common_btn).removeClass("d-none");
                    $(request.loader_btn).addClass("d-none");
                }
            resolve(response);
            },
            error : function(error){
                if(request.isLoader)
                {
                    $(request.common_btn).removeClass("d-none");
                    $(request.loader_btn).addClass("d-none");
                }
             reject(error);
            }
        };
        if(request.type=="POST" || request.type=="PUT")
        {
            option['data'] = request.data;
            option['processData'] = false;
            option['contentType'] = false;
        }

        if(request.type=="DELETE")
        {
            option['data'] = request.data;
        }
        $.ajax(option);
    });

}




//show clients 
$(document).ready(function(){
    let from=  0;
    let to = 5;
    showClients(from,to);
    getPaginationList();
});

async function showClients(from,to){
    $("table").html(`
    <tr>
    <th> Client </th>
    <th> Email </th>
    <th> Mobile  </th>
    <th> Status  </th>
    <th> Date  </th>
    <th> Action  </th>
    </tr>
    `);
  const request = {
      type : "GET",
      url : `/clients/${from}/${to}`,
      isLoader : true,
      common_btn : ".tmp" ,
      loader_btn : ".client-skeleton"
  }
const response = await ajax(request);
console.log(response);
if(response.data.length >0)
{
   for(let client of response.data)
   {
       const tr = dynamicTr(client);
       $("table").append(tr);
   }
   clientAction();
}
else
{
    alert("Data not found !");
}
}

//dynamic tr 
function dynamicTr(client){
    let clientString = JSON.stringify(client);
   let clientData =  clientString.replace(/"/g,"'");
const tr = `
<tr class='animate__animated animate__fadeIn'>
<td>
<div class='d-flex align-items-center'>
<i class='fa fa-user-circle mr-3' style='font-size:45px;'></i>
<div>
<p class="p-0 m-0 text-capitalize client-name">${client.clientName}</p>
<small class='text-uppercase'>${client.clientCountry}</small>
</div>
</div>
</td>

<td class="client-email">
${client.clientEmail}
</td>

<td>
${client.clientMobile}
</td>

<td>
<span class='badge badge-danger'>offline</span>
</td>

<td>
${formatDate(client.created_at)}
</td>

<td>
<div class='d-flex'>
<button class='icon-btn-primary mr-3 edit-client' data-id='${client._id}' data-client="${clientData}">
<i class='fa fa-edit'></i>
</button>

<button class='icon-btn-danger mr-3 delete-client' data-id='${client._id}'>
<i class='fa fa-trash'></i>
</button>

<button class='icon-btn-info share-client' data-id='${client._id}'>
<i class='fa fa-share-alt'></i>
</button>
</div>
</td>

</tr>
`;
return tr;
}



//date formate 
function formatDate(date_string){
const date =  new Date(date_string);
let dd = date.getDate();
//insert zero before month
if(dd <10)
{
    dd = '0'+dd;
}
let mm = date.getMonth()+1;
//insert zero before month
if(mm <10)
{
 mm = '0'+mm;
}
const yy = date.getFullYear();
//get time
const time = date.toLocaleTimeString();
return dd+"-"+mm+"-"+yy+" "+time;
}

//client action 
function clientAction(){
    //delete clients
    $(document).ready(function(){
        $(".delete-client").each(function(){
            $(this).click(async function(){
                const id = $(this).data("id");
                const token = getCookie("authToken");
                let tr = this.parentElement.parentElement.parentElement;//div->td->tr
                const request = {
                    type : "DELETE",
                    url : "/clients/"+id,
                    data : {
                        token  : token
                    }
                }

              const response = await  ajax(request);
              $(tr).removeClass('animate__animated animate__fadeIn');
              $(tr).addClass('animate__animated animate__fadeOut');
              setTimeout(function(){
                $(tr).remove();
              },500);
              console.log(response);
            });
        });
    });

    //edit clients
    $(document).ready(function(){
        $(".edit-client").each(function(){
            $(this).click(function(){
                let tr = this.parentElement.parentElement.parentElement;
                const id = $(this).data("id");
                const clientString = $(this).data('client');
               const clientData =  clientString.replace(/'/g,'"');
               let client = JSON.parse(clientData);
               for(let key in client)
               {
                   let value = client[key];
                   $(`[name=${key}]`,"#client_form").val(value);
               }
               $("#client_form").attr("data-id",id);
               $("#client_form").removeClass("add-client-form");
               $("#client_form").addClass("update-client-form");
               $(".add-client-submit").html("save");
               $(".add-client-submit").removeClass("btn-primary");
               $(".add-client-submit").addClass("btn-danger px-3");
                $("#clientModal").modal('show');
                updateClient(tr);
            });
        });
    });
}


//get pagination list

async function  getPaginationList (){

const request = {
    type : "GET",
    url  : "/clients/count-all"
}

const response =await ajax(request);

const total_client = response.data;
let  length = total_client/5;
let dataSkip = 0;
let i;
if(length.toString().indexOf(".") != -1)
{
    length = length+1;
}

   for(i=1;i<=length;i++)
   {
      let button = `<button class='btn border paginate-btn ${i==1 ? "active" : "" }' data-skip="${dataSkip}">
        ${i}
      </button>`;
       $("#client-pagination").append(button);
       dataSkip = dataSkip+5;
   }

   getPaginationData();
}

function getPaginationData(){
    $(".paginate-btn").each(function(index){
        $(this).click(function(){
            controlPrevNext(index);
            removeClasses("active");
            $(this).addClass("active");
            const skip = $(this).data('skip');
            alert(skip);
            showClients(skip,5);
        });
    });
}

function removeClasses(className){
$("."+className).each(function(){
    $(this).removeClass(className);
});
}

//click on next button on pagination
$(document).ready(function(){
    $("#next").click(function(){
        let c_index = 0;
        $(".paginate-btn").each(function(){
            if($(this).hasClass("active"))
            {
              c_index =  $(this).index();
            }
        });
     $(".paginate-btn").eq(c_index+1).click();
     controlPrevNext(c_index+1);
    });
});


//click on prev button on pagination
$(document).ready(function(){
    $("#prev").click(function(){
        let c_index = 0;
        $(".paginate-btn").each(function(){
            if($(this).hasClass("active"))
            {
              c_index =  $(this).index();
            }
        });
     $(".paginate-btn").eq(c_index-1).click();
     controlPrevNext(c_index-1);
    });
});

function controlPrevNext(c_index){
const total = $(".paginate-btn").length-1;
if(c_index == total)
{
    $("#next").prop("disabled",true);
}
else if(c_index >0)
{
    $("#prev").prop("disabled",false);
    $("#next").prop("disabled",false);
}
else
{
    $("#prev").prop("disabled",true);
    $("#next").prop("disabled",false);  
}
}

//control filter
$(document).ready(function(){
    filterByName();
    $(".filter-btn").click(function(){
       if($(".filter").hasClass('filter-by-name'))
       {
           $(".filter").removeClass("filter-by-name");
           $(".filter").addClass("filter-by-email");
           $(".filter").attr("placeholder","Search by email");
           filterByEmail();
       }
       else
       {
        $(".filter").addClass("filter-by-name");
        $(".filter").removeClass("filter-by-email");
        $(".filter").attr("placeholder","Search by name");
       }
    });
});

//filter by name
function filterByName(){
    $(".filter-by-name").on("input",function(){
        let tr = "";
       let keyword = $(this).val().trim().toLowerCase();
       $(".client-name").each(function(){
           let clientName = $(this).html().toLowerCase();
           if(clientName.indexOf(keyword) == -1)
           {
            tr =  $(this).parent().parent().parent().parent();
           $(tr).addClass("d-none");
           }
           else
           {
            tr =  $(this).parent().parent().parent().parent();
            $(tr).removeClass("d-none");
            }
           })
       });
    }


    //filter by email
function filterByEmail(){
    $(".filter-by-email").on("input",function(){
        let tr = "";
       let keyword = $(this).val().trim().toLowerCase();
       $(".client-email").each(function(){
           let clientEmail = $(this).html().toLowerCase();
           if(clientEmail.indexOf(keyword) == -1)
           {
            tr =  $(this).parent();
           $(tr).addClass("d-none");
           }
           else
           {
            tr =  $(this).parent();
            $(tr).removeClass("d-none");
            }
           })
       });
    }
