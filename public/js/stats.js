//const APIURL = window.location.protocol + '//' + window.location.host + '/api';
let pagina=0;
let NAME_FILTER='';
const statToHTMLSingleGame =(stat, nombre)=>{
    let won = stat.win == true ? "Ganó" : "Perdió";    
    if(nombre === stat.game){
        console.log("entró");
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
    return;
}

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

const statListToHTMLSingleGame=(list, id, nombre)=>{
    console.log("id: " + id);
    console.log("list2: " + list);
    if(id && list && document.getElementById(id)){
        document.getElementById(id).innerHTML = list.map(statToHTML).join('');
    }
}

const statListToHTML=(list, id)=>{
    console.log("id: " + id);
    //console.log("list222: " + list.nombre);
    if(id && list && document.getElementById(id)){
        document.getElementById(id).innerHTML = list.map(statToHTML).join('');        
    }
}
//AQUÍ NOS QUEDAMOS
function getFullStats(){
    let url = APIURL + `/stats/`;
    sendHTTPRequest(url, {}, HTTTPMethods.get, (datos)=>{
        //document.getElementById("lista").innerHTML = userListToHTML(datos, "lista");
        //console.log("datos fullStats: " + JSON.stringify(datos.data));
        searchStat(JSON.parse(datos.data));        
    },(err)=>{
        alert(err);
    }, TOKEN)    
}
function subir(){
    getStats(game);
pagina+=3;
}
function bajar(){
    getStats(game);
pagina-=3;
}

function searchStat(list){
    let btn = document.getElementById("searchBtn");
    console.log(pagina);
    let game = document.getElementById("gameSearched").value;
    console.log("game: " + game);
    console.log("list: " + JSON.stringify(list));
    let newList = [];
   if (pagina<=0) document.getElementById("pre").disabled = true;

    for(let i=pagina; i < pagina+3;i++){
        if(i<list.length){
        if(list[i].game.includes(game.toUpperCase())){
            newList.push(list[i]);
              }
        }    
    }
    statListToHTML(newList, "listaStat");
}


function setStat(){
    console.log("create");
    const form = document.getElementById("registerStatForm"); 
    let btn = document.getElementById("regStatBtn");
    btn.disabled = true;     
    const msg = "Éxito";    
    let elements = form.querySelectorAll("input:invalid");
    form.addEventListener("change", function (e) {
        let name = document.getElementById("nombreStats").value;
        console.log("name: " + name);
        let game = document.getElementById("gameStats").value;    
        console.log("game: " + game);
        let email = document.getElementById("emailStats").value;
        let won = document.getElementById("wins").value;
        console.log("won: " + wins);
        /*let lost = document.getElementById("lost").checked;
        console.log("lost: " + lost);*/
        let kills = document.getElementById("killStats").value;
        console.log("kills: " + kills);
        console.log(elements.length);
        let temp = 0;
        if(name != '')
            temp++;
        if(game != '')
            temp++;
        if(email != '')
            temp++;    
        if(won != '')
            temp++;
        if(kills != '')
            temp++;
        console.log("temp: " +temp);
        if(temp == 5){
            let result = true;
            if(won.includes("G"))
                result = true;
            else
                result = false;
            let url = APIURL + '/stats';         
            console.log(url);
            btn.disabled = false;
            console.log("antes");
            regStatBtn.addEventListener("click", (event) =>{
                console.log("fin")
                event.preventDefault();
                //b.nombre && b.apellidos && b.email && b.sexo && b.fecha
                sendHTTPRequest(url, {user: name, game: game, email: email, kills: kills, win: result}, HTTTPMethods.post, (datos) => {
                    //console.log(datos);
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

/*
function getSingleGameStats(gameID){
    console.log("name: " + gameID);
    console.log("API: " + APIURL);
    let url = APIURL + `/stats/` + gameID;
    console.log("url: " + url);
    sendHTTPRequest(url, {}, HTTTPMethods.get, (datos)=>{
        //document.getElementById("lista").innerHTML = userListToHTML(datos, "lista");
        console.log("datos dentro: " + JSON.stringify(datos.data));
        //statToHTMLSingleGame(JSON.parse(datos.data), "listaStat", gameID);
        //let statList = datos.data;
        window.location.href = ("stats.html");
        statToHTMLSingleGame(JSON.parse(datos.data), "listaStat", gameID);
        //console.log("statlist: " + JSON.stringify(statList));
        //window.location.href = ("stats.html");
    },(err)=>{
        alert(err);
    })
}*/

function getStats(nombre) {

    console.log("name: " + nombre);
    console.log("API: " + APIURL);
    let url = APIURL + `/stats/`;
    if(nombre != undefined) url = APIURL + `/stats/` + nombre;
    console.log("url: " + url);
    sendHTTPRequest(url, {}, HTTTPMethods.get, (datos)=>{
        //document.getElementById("lista").innerHTML = userListToHTML(datos, "lista");
        //console.log("datos dentro: " + JSON.stringify(datos.data));
        searchStat(JSON.parse(datos.data));
        
    },(err)=>{
        alert(err);
    }, TOKEN)
}
function getUsersPage(page,filter){
    let nfilter = (filter)? `${filter}`:'';
    let url = APIURL+"/stats?page="+page+"&limit=3"+nfilter
    let paginas;

    sendHTTPRequest(url, {pagina:page, limite:3}, HTTTPMethods.get, (datos)=>{
        let json = JSON.parse(datos.data);
        paginas = {pages:json.page, tp:json.totalPages};
        let paginado = $(".page-link");
        for(let i = 1; i < 4; i++){
            paginado[i].innerHTML = PAGES.current-2+i;
            let contenido = parseInt(paginado[i].innerHTML);
            if(contenido<=0 || (paginas && contenido > paginas.tp)){
                $(paginado[i]).hide();
            }else{
                $(paginado[i]).show();
            }
        }
        paginado = $(".page-item");
        if(PAGES.current > 1 && PAGES.current < paginas.tp){
            $(paginado[0]).toggleClass("disabled", false);
            $(paginado[4]).toggleClass("disabled", false);
        }else{
            $(paginado[0]).toggleClass("disabled", PAGES.current <= 1);
            $(paginado[4]).toggleClass("disabled", PAGES.current >= paginas.tp);
        }
        statListToHTML(JSON.parse(datos.data).content, 'listaStat');
    }, (err)=>{
        console.log(err);
    }, TOKEN);
}

let game = window.location.search.split('=').pop();
document.addEventListener('DOMContentLoaded',()=>{

    console.log("game: " + game);
    getStats(game);
     
    $(document).ready(()=>{
        $("#pagesList").click((event)=>{
            if($(event.target).hasClass("page-link")&&isNaN(parseInt(event.target.innerHTML))){
                PAGES.current+=(event.target.innerHTML.includes("Pre")?-1:1);
                getUsersPage(PAGES.current,NAME_FILTER);
            }else if($(event.target).hasClass("page-link")){
                PAGES.current=parseInt(event.target.innerHTML);
                getUsersPage(PAGES.current,NAME_FILTER);
            }
        });
    });
    /*let btn = document.getElementById("regStat");
    btn.addEventListener("click", function() {
        setStat();
    })*/

});