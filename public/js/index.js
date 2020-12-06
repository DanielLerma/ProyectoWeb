/*const { TokenExpiredError } = require("jsonwebtoken");

const HTTTPMethods = {
    "put": "PUT",
    "post": "POST",
    "get": "GET",
    "delete": "DELETE"
}
const APIURL = window.location.protocol+'//'+window.location.host+'/api';
let TOKEN = getTokenValue('token');

function getTokenValue(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue   + ";" + expires + ";path=/";
}
function sendHTTPRequest(urlAPI, data, method, cbOK, cbError, authToken) {
    // 1. Crear XMLHttpRequest object
    let xhr = new XMLHttpRequest();
    // 2. Configurar:  PUT actualizar archivo
    xhr.open(method, urlAPI);
    // 3. indicar tipo de datos JSON
    xhr.setRequestHeader('Content-Type', 'application/json');
    if (authToken)
        xhr.setRequestHeader('x-auth-user', authToken);
    // 4. Enviar solicitud al servidor
    xhr.send(JSON.stringify(data));
    // 5. Una vez recibida la respuesta del servidor
    xhr.onload = function () {
        if (xhr.status != 200 && xhr.status != 201) { // analizar el estatus de la respuesta HTTP 
            // Ocurrió un error
            cbError(xhr.status + ': ' + xhr.statusText);
        } else {
            console.log(xhr.responseText); // Significa que fue exitoso
            cbOK({
                status: xhr.status,
                data: xhr.responseText
            });
        }
    };
}
*/
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue   + ";" + expires + ";path=/";
}

function login() {
    console.log('login...');
    const form = document.getElementById("loginForm"); 
    let btn = document.getElementById('sublogin');
    form.addEventListener("change", function (e) {
        elements = form.querySelectorAll("input:invalid");
        let email = document.getElementById('userInputLogin').value;
        console.log("email: " + email);
        let password = document.getElementById('passwordInputLogin').value
        console.log("password: " + password);
        let btn = document.getElementById('sublogin');
        let temp = 0;
        if(email != '')
            temp++;
        if(password != '')
            temp++;
        console.log("temp: " +temp);
        if(temp == 2){   
            let url = APIURL+'/login/';
            console.log(url);
            btn.disabled = false;
            console.log("antes");
            btn.addEventListener("click", (event) =>{
                console.log("fin")
                event.preventDefault();
                //b.nombre && b.apellidos && b.email && b.sexo && b.fecha
                sendHTTPRequest(url, {email:email, password:password}, HTTTPMethods.post, (datos) => {
                    console.log("entroooooooooooo");
                    setCookie('x-auth-user', JSON.parse(datos.data).token, 2);
                    document.getElementById('loginResponseMSG').innerHTML='<div class="text-success">Bienvenido</div>';
                    console.log("finalizo");
                    window.location.href = `stats.html?stats=${email}`;
                }, (error) =>{
                    document.getElementById('loginResponseMSG').innerHTML='<div class="text-danger">'+error+'</div>';
                }, TOKEN)
            }) 

        }
        else{
            console.log("f3");
            btn.disabled = true;   
        }
    });

}

function createUser() {
    console.log("create");
    const form = document.getElementById("createUserForm"); 
        let btn = document.getElementById("createUserBtn");
        btn.disabled = true;     
        const msg = "Bienvenido";    
        let elements = form.querySelectorAll("input:invalid");
        form.addEventListener("change", function (e) {
            elements = form.querySelectorAll("input:invalid"); 
               
            let name = document.getElementById("nombres").value;
            console.log("name: " + name);
            let aps = document.getElementById("apellidos").value;    
            console.log("aps: " + aps);
            let email = document.getElementById("email").value;
            let pwd1 = document.getElementById("password1").value;
            console.log("pwd1: " + pwd1);
            let pwd2 = document.getElementById("password2").value;
            console.log("pwd2: " + pwd2);
            console.log(elements.length);
            let temp = 0;
            if(name != '')
                temp++;
            if(aps != '')
                temp++;
            if(email != '')
                temp++;    
            if(pwd1 != '')
                temp++;
            if(pwd2 === pwd1 && pwd2 != '')
                temp++;
            console.log("temp: " +temp);
            if(temp == 5){   
                let url = APIURL + '/users';         
                console.log(url);
                btn.disabled = false;
                console.log("antes");
                createUserBtn.addEventListener("click", (event) =>{
                    console.log("fin")
                    event.preventDefault();
                    //b.nombre && b.apellidos && b.email && b.sexo && b.fecha
                    sendHTTPRequest(url, {nombre: name, apellidos: aps, email: email, password: pwd1}, HTTTPMethods.post, (datos) => {
                        console.log(datos);
                        setCookie('token', JSON.parse(datos.data).token,2);
                        console.log("cookie: " + datos.token);            
                        alert(msg);
                        window.location.href = "stats.html";                
                    }, (error) =>{
                        console.log("error");
                        alert(error);
                    }, TOKEN)
                }) 

            }
            else{
                console.log("f3");
                btn.disabled = true;   
            }
        });
    

}/*
function createUser() {
    console.log('createUser');

    let newUser=document.querySelectorAll("#createUserForm");
    console.log(newUser);

    let url = APIURL+'/users';
    console.log(url);

    console.log(TOKEN);

    sendHTTPRequest(url,{
            nombre:newUser[0][0].value,
            apellidos:newUser[0][1].value,
            email:newUser[0][2].value,
        },HTTTPMethods.post,(data)=>{
            setCookie('token',JSON.parse(data.data).token,2);
            document.getElementById("responseMSG").innerHTML='<div class="text-success">Gracias por Registrarse</div>';
        },(err)=>{
            document.getElementById("responseMSG").innerHTML='<div class="text-danger">'+err+'</div>';
    }, TOKEN);
    

}*/
document.addEventListener('DOMContentLoaded', () => {
    //agrega tu codigo de asignación de eventos...

    /*let btn = document.getElementById("loginBtn");
    btn.addEventListener('click', function (event){
        login();
    })*/

   /* $('#createFormModal').on('show.bs.modal', function (event) {
        /*console.log("register");
        let us=document.getElementById("createUserForm");
        us.addEventListener('change',(a)=>{
            let u=document.querySelectorAll("#createUserForm");
            document.getElementById("createUserBtn").disabled=!($(u[0][0]).is(":valid")&&$(u[0][1]).is(":valid")&&
            $(u[0][2]).is(":valid")&&$(u[0][3]).is(":valid")&&(u[0][4].value===u[0][3].value)&&$(u[0][5]).is(":valid")
            &&(u[0][8].value.length==0||$(u[0][8]).is(":valid")));
        });

        document.getElementById("createUserBtn").addEventListener('click',(e)=>{
            e.preventDefault();
            createUser();
        });
    });*/
    
});