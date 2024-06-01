var index=0;
var stompClient=null
   function sendMessage(){
    let jsonOb={
        name:localStorage.getItem("name"),
        content:$("#message-value").val()
    }
    // document.getElementById("message-value").innerHTML="";
    $("#message-value").val("");
    stompClient.send("/app/message",{},JSON.stringify(jsonOb));

   }

function connect()
{

    let socket=new SockJS("/server1")

    stompClient=Stomp.over(socket)

    stompClient.connect({},function(frame){

        // console.log("Connected : "+frame)

        $("#name-from").addClass('d-none')
        $("#chat-room").removeClass('d-none')


            //subscribe
            stompClient.subscribe("/topic/return-to",function(response){

                    showMessage(JSON.parse(response.body))

            })



    })

}


 function showMessage(message)
 {

    $("#message-container-table").append(`<tr><td><b>${message.name} :</b> ${message.content}</td></tr>`)

 }


$(document).ready((e)=>{
    
    $("#name-value").keyup((event) => {

        if (event.keyCode === 13) {
            $("#login").click(); // Trigger the login button click event
            document.getElementById("message-value").innerHTML = "";
        }

    });

    
   $("#login").click(()=>{

       let name=$("#name-value").val()
       localStorage.setItem("name",name)
       $("#name-title").html(`Welcome , <b style="font-family: Ink Free; font-weight: 600; word-wrap: break-word">${name} </b>`)
       connect();

   })

   $("#send-btn").click(()=>{
    sendMessage()
    document.getElementById("message-value").innerHTML=""
   });
   
   
   $("#message-value").keyup((event) => {
    if (event.keyCode === 13) {
        sendMessage();
        document.getElementById("message-value").innerHTML = ""; // Clear the textbox
    }
});

   
$("#logout").click(()=>{

    localStorage.removeItem("name")
    if(stompClient!==null)
    {
        stompClient.disconnect()

         $("#name-from").removeClass('d-none')
         $("#chat-room").addClass('d-none')
         console.log(stompClient)
         $("#message-container-table").empty()
    }

})

})
