//redirect user if already logged
if(document.cookie.indexOf("authToken") != -1)
{
window.location = "/profile";
}

//requesting login modal
$(document).ready(function(){
    $("#request-login-modal").click((e)=>{
        e.preventDefault;
        $("#signup-modal").modal('hide');
        $("#login-modal").modal('show');
    });
});


//requesting signup modal
$(document).ready(function(){
    $("#request-signup-modal").click((e)=>{
        e.preventDefault;
        $("#login-modal").modal('hide');
        $("#signup-modal").modal('show');
    });
});

//signup request
$(document).ready(function(){
    $("#signup-form").submit((e)=>{
     e.preventDefault();
     $.ajax({
         type : "POST",
         url : "api/signup",
         data : new FormData(e.target),
         processData : false,
         contentType : false,
         beforeSend : function(){
        $(".before-send").removeClass("d-none");
        $(".signup-btn").addClass("d-none");
         },
         success : function(response){
            $(".before-send").addClass("d-none");
            $(".signup-btn").removeClass("d-none");
            if(response.isUserCreated)
            {
                window.location="/profile";
            }
         },
         error : function(error){
            console.log(error);
         if(error.status==409)
         {
            $(".before-send").addClass("d-none");
            $(".signup-btn").removeClass("d-none");
        const data = JSON.parse(error.responseJSON.text);

         const field = "."+data.message.field;
         const message = data.message.label;
         $(field).addClass("border border-danger");
         $(field+"-error").html(message);
         $(field).click(function(){
           resetValidator(field);
         });

         }
         else {
             alert("Internal server error !");
         }
         }
         
     });
    });
});



//login request
$(document).ready(function(){
    $("#login-form").submit((e)=>{
     e.preventDefault();
     $.ajax({
         type : "POST",
         url : "api/login",
         data : new FormData(e.target),
         processData : false,
         contentType : false,
         beforeSend : function(){
        $(".before-send").removeClass("d-none");
        $(".login-btn").addClass("d-none");
         },
         success : function(response){
         if(response.isLogged)
         {
             window.location = "/profile";
         }
         else
         {
            $(".company-password").addClass("border border-danger");
            $(".password-error").html(error.responseJSON.message); 
            $(".company-password").click(()=>{
                $(".company-password").removeClass("border border-danger");
                $(".password-error").html(""); 
            });
         }
         },

         error : function(error){
            console.log(error);
            $(".before-send").addClass("d-none");
            $(".login-btn").removeClass("d-none");
         if(error.status==404)
         {
             $(".username").addClass("border border-danger");
             $(".username-error").html("User not found !");
             $(".username").click(()=>{
                $(".username").removeClass("border border-danger");
                $(".username-error").html(""); 
            });
         }
         else if(error.status ==401)
         {

            //$(".company-password").addClass("border border-danger");
             $(".password-error").html(error.responseJSON.message); 
            $(".company-password").click(()=>{
                $(".company-password").removeClass("border border-danger");
                $(".password-error").html(""); 
            });
         }
         else if(error.status ==406)
         {

            $(".company-password").addClass("border border-danger");
             $(".password-error").html(error.responseJSON.message); 
            $(".company-password").click(()=>{
                $(".company-password").removeClass("border border-danger");
                $(".password-error").html(""); 
            });
         }
         else
         {
             alert("Internal server error !");
         }
         }
         
     });
    });
});



function resetValidator(field){
$(field).removeClass("border border-danger");
$(field+"-error").html("");
}