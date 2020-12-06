const gameToHTML = (user) => {
    return `
    <div class="row">
    <div class="col-sm">
        <a href="stats.html?stats=${user.nombre}"><input id="game" type="image"src=${user.img} width="220px" height="140px" onclick="help('${user.nombre}')"></a>
        <div class="btn btn-primary" data-toggle="modal" data-target="#deleteFormModal"  data-name="${user.nombre}"><i class="fas fa-trash-alt remove "></i></div>
        <div class="btn btn-primary"data-user='${JSON.stringify(user)}' data-toggle="modal" data-target="#updateFormModal" onclick="updateGame('${user.nombre}')"><i class="fas fa-pencil-alt edit"></i></div>
        <div class="btn btn-primary"> <a class="text-white" href="detgames.html?nombre=${user.nombre}"><i class="fas fa-search"></i></a></div>
        <p id="gameName">${user.nombre}</p>
    </div>
    </div>`
}

const gameListToHTML = (list, id) => {
    //console.log("id: " + id);
    //console.log("list2: " + JSON.stringify(list));
    if (id && list && document.getElementById(id)) {
        document.getElementById(id).innerHTML = list.map(gameToHTML).join('');
    }
}

function createGame() {
    console.log("hola");
    const form = document.getElementById("registerGameForm"); 
    let btn = document.getElementById("subgame");
    btn.disabled = true;     
    const msg = "Bienvenido";    
    let elements = form.querySelectorAll("input:invalid");
    form.addEventListener("change", function (e) {
        //elements = form.querySelectorAll("input:invalid"); 
            
        let name = document.getElementById("namegame").value;
        console.log("name: " + name);
        let cat = document.getElementById("namecat").value;    
        console.log("aps: " + cat);
        let fec = document.getElementById("dategame").value; 
        console.log("fecha: " + fec);
        let imgg = document.getElementById("gameimg").value; 
        let temp = 0;
        if(name != '')
            temp++;
        if(cat != '')
            temp++;
        if(fec != '')
            temp++;
        if(imgg != '')
            temp++
        console.log("temp: " +temp);
        if(temp == 4){   
            let url = APIURL + '/games';         
            console.log(url);
            btn.disabled = false;
            console.log("antes");
            subgame.addEventListener("click", (event) =>{
                console.log("fin")
                //b.nombre && b.apellidos && b.email && b.sexo && b.fecha
                sendHTTPRequest(url,{nombre: name, tipo: cat, fecha: fec, img: imgg}, HTTTPMethods.post, (datos) => {
                    console.log("entrooojaja");   
                    console.log(datos);     
                    alert(msg);
                    window.location.href = "games.html";
                }, (error) =>{
                    console.log(error);
                    alert(error);
                }, TOKEN)
            }) 

        }
        else{
            console.log("f3");
            btn.disabled = true;   
        }
    });
    console.log("token: " + TOKEN);

}

function deleteGame(ele){
    let nombre = ele.getAttribute('data-name');
    console.log("ola: " + nombre);
    let url = APIURL+'/games/'+nombre;

    console.log(url);
    $('.btn-danger').off();
    $(".btn-danger").on('click', function(event){
        sendHTTPRequest(url, {}, HTTTPMethods.delete, (datos)=>{
            console.log("datos: "+datos.data);
            getGames();
            alert('juego eliminado');
        }, (error)=>{
            alert(error);
        }, TOKEN)
    });
}

function updateGame(ele){
    let url = APIURL+'/games/'+ele;
    console.log(url);
    let btn = document.getElementById("updatebtn");
    btn.disabled = true;
    let form=document.getElementById("updateid");
    form.addEventListener("change", function (e) {
        let name = document.getElementById("name1").value;
        console.log("name: " + name);
        let tipo = document.getElementById("tipo1").value;
        console.log("aps: " + tipo);
        let fecha = document.getElementById("fecha1").value;
        let imgg = document.getElementById("img1").value;
        console.log("pwd1: " + fecha);
        let temp = 0;
        if(name != '')
            temp++;
        if(tipo != '')
            temp++;
        if(fecha != '')
            temp++;
        if(imgg != '')
            temp++;
        console.log("temp: " +temp);

        if(temp == 4){
            console.log(url);
            btn.disabled = false;
            console.log("antes");
            btn.addEventListener("click", (event) =>{
                console.log("fin")
                event.preventDefault();
                sendHTTPRequest(url, {nombre: name, tipo: tipo, fecha: fecha, img: imgg}, HTTTPMethods.put, (datos) => {
                    console.log(datos);
                    window.location.href = "games.html";
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

function getGames() {
    let urlParams = new URLSearchParams(window.location.search);
    let name = urlParams.get("nombre");
    let url = APIURL + `/games/`;
    sendHTTPRequest(url, {}, HTTTPMethods.get, (datos) => {
        //document.getElementById("lista").innerHTML = userListToHTML(datos, "lista");
        //console.log("datos dentro: " + JSON.stringify(datos.data));
        gameListToHTML(JSON.parse(datos.data), "listaJuegos");
    }, (err) => {
        alert(err);
    })
}

document.addEventListener('DOMContentLoaded', () => {
    getGames();

    $('#deleteFormModal').on('show.bs.modal', function (event) {
        deleteGame(event.relatedTarget);

    });

});