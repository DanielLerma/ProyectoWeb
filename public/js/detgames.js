const detgamesToHTML=(user)=>{
    //let sexo = (user.sexo ==='H')?'Hombre':'Mujer';
    return `
    <div class="col-sm">
        
        <div class="media-body">
        <br>
        <br>
                <h4>${user.nombre} </h4>
                <img src="${user.img}" style="width:550px;height:350px;">
                <p>Tipo: ${user.tipo}</p>
                <p>Fecha:${user.fecha} </p>
        </div>
    </div>`
    
}
const gamesListToHTML = (list, id) => {
    //console.log("id: " + id);
    //console.log("list2: " + JSON.stringify(list));
    if (id && list && document.getElementById(id)) {
        document.getElementById(id).innerHTML = list.map(detgamesToHTML).join('');
    }
}


function getgames() {
    let urlParams = new URLSearchParams(window.location.search);
    let name = urlParams.get("nombre");
    console.log("pnombre:"+name);
    let url = APIURL + `/games/`+name;
    console.log("pnombre:"+name);
    sendHTTPRequest(url, {}, HTTTPMethods.get, (datos) => {
        console.log("entrowww"+JSON.stringify(datos));
        //document.getElementById("lista").innerHTML = userListToHTML(datos, "lista");
        //console.log("datos dentro: " + JSON.stringify(datos.data));
        document.getElementById("lista").innerHTML = detgamesToHTML(JSON.parse(datos.data));
        console.log("entroyyyyyyyy");
    }, (err) => {
        alert(err);
    })
}

document.addEventListener('DOMContentLoaded',()=>{
    getgames();
});