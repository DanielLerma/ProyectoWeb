
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue   + ";" + expires + ";path=/";
}

function setXAuth(){
    const cookie = getTokenValue('x-auth-user');
    console.log("cki: " + cookie);    
    return cookie;
}

function login() {
    console.log('login...');
    const form = document.getElementById("loginForm"); 
    let btn = document.getElementById('sublogin');
    const cookie = setXAuth();
    console.log("cookie adentro: " + cookie);
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
                    //const token = jwt.sign({token: JSON.parse(datos.data).token}, SECRET_JWT)
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
                        setCookie('x-auth-user', JSON.parse(datos.data).token, 2);                        
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
    

}

document.addEventListener('DOMContentLoaded', () => {
});