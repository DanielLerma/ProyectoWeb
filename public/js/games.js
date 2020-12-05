//import statFile from "/js/stats.js";

/*
const statToHTML=(stat)=>{
    let won = stat.win == true ? "Ganó" : "Perdió";
    return `
    <div class="row" >
        <div class="col-sm border border-dark">
            ${stat.user}
        </div>
        <div class="col-sm border border-dark">
            ${stat.game}
        </div>
        <div class="col-sm border border-dark">
            ${stat.kills}
        </div>
        <div class="col-sm border border-dark">
            ${stat.email}
        </div>
        <div class="col-sm border border-dark">
            ${won}
        </div>
        
    </div>
    `
}

const statListToHTML=(list, id)=>{
    console.log("id: " + id);
    console.log("list2: " + list);
    if(id && list && document.getElementById(id)){
        document.getElementById(id).innerHTML =  list.map(statToHTML).join('');
    }
}

function getSingleGameStats(){
    /*let bt = document.getElementById("game");
    bt.addEventListener("click", () => {
        let name = $("game").text();
        console.log("name: " + name);
    });
    $("game").click(() => {
        let name = $("gameName").text();
        console.log("name: " + name);
    });
    let name = document.getElementById("gameName").innerHTML;
    console.log("name: " + name);
}

*/

const gameToHTML = (user) => {
    return `
    <div class="col-sm">
        <a href="stats.html?stats=${user.nombre}"><input id="game" type="image"src=${user.img} width="250px" height="150px" onclick="help('${user.nombre}')"></a>
        <div class="btn btn-primary mt-2" data-toggle="modal" data-target="#deleteFormModal"  data-name="${user.nombre}"><i class="fas fa-trash-alt remove "></i></div>
        <p id="gameName">${user.nombre}</p>
    </div>`
}
/*
const gameToHTML = (user) => {
    return `
    <div class="col-sm">
        <input id="game" type="image"src=${user.img} width="250px" height="150px">
        <a href="stats.html"  onclick="getSingleGameStats('${user.nombre}')"><p id="gameName">${user.nombre}</p></a>
    </div>`
}*/

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
            alert('usuario eliminado');
        }, (error)=>{
            alert(error);
        })
    });
}

/*
function getGame(){
    let urlParams = new URLSearchParams(window.location.search);
    let name = urlParams.get("nombre");
    console.log("name: " + name);
    let url = APIURL + `/games/` + name;
    sendHTTPRequest(url, {}, HTTTPMethods.get, (datos)=>{
        //document.getElementById("lista").innerHTML = userListToHTML(datos, "lista");
        console.log("datos dentro: " + JSON.stringify(datos.data));
        gameToHTML(JSON.parse(datos.data));
    },(err)=>{
        alert(err);
    })
}
*/

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

    /*let btn = document.getElementById("regGame");
    btn.addEventListener("click",function(e){
        createGame();
    })
*/
});