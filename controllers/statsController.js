const fs = require('fs');
//const USERS_DB = require('../data/users.json');
const CloudantSDK = require('@cloudant/cloudant');
const CLOUDANT_CREDS = require('../localdev-config.json');
const cloudant = new CloudantSDK(CLOUDANT_CREDS.url);
const STATS_DB_CLOUDANT = cloudant.db.use('stats');
let CURRENT_ID = 0;


/*let uids = USERS_DB.map((obj)=>{return obj.uid});
CURRENT_ID = Math.max(...uids)+1;
console.log(`Current id: ${CURRENT_ID}`);*/
// console.table(USERS_DB);

class statsController {
    generateId(){
        let id = CURRENT_ID;
        CURRENT_ID++;
        fs
        return id;
    }
    insertStat(stat,cbOk){
        STATS_DB_CLOUDANT.insert(stat).then((addedEntry)=>{
            //console.log(addedEntry);
            if(addedEntry.ok){
                stat.rev= addedEntry.rev;
                stat.uid = addedEntry.id;
                cbOk(stat);
            }else{
                cbOk();
            }
        }).catch((error)=>{
            cbOk(null,error);
        });
    }

    async deleteStat(usr,cbOk){
        /*console.log(user.email)
        console.log(user.nombre)
        console.log(user.apellidos)*/
        const q = {
            selector:{
                email:{"$eq":usr.email},
                user:{"$eq":usr.nombre},
                apellidos:{"$eq":usr.apellidos}
            }
        }
        //console.log("antes");
        let docs = await STATS_CLOUDANT_DB.find(q);
        //console.log("docs: " + JSON.stringify(docs));
        if(docs.docs.length>0){
            //regresar resultado..
            let usr = {
                nombre: docs.docs[0].nombre,
                apellidos: docs.docs[0].apellidos,
                email: docs.docs[0].email,            
                uid: docs.docs[0]._id,
                rev: docs.docs[0]._rev
            }
            STATS_CLOUDANT_DB.destroy(usr.uid,usr.rev).then((body)=>{
                //console.log(body);
                if(body.ok){
                    cbOk(true);
                }else{
                    cbOk(false);
                }
            }).catch((error)=>{
                cbOk(error);
            });
        } 
    }

    async getList(cbOk){
        let stats = new Array();
        let entries = await STATS_DB_CLOUDANT.list({
            include_docs: true
        });
        //console.log("entries: " + JSON.stringify(entries));
        for (let entry of entries.rows) {
            //console.log("entry: " + entry.doc)
            stats.push(entry.doc);
        }
        //console.log("games: " + JSON.stringify(games));
        return stats;
    }
    async getUserByCredentials(email, password,cbOk){
        const q = {
            selector:{
                email:{"$eq":email},
                password:{"$eq":password}
            }
        }
        let docs = await USERS_CLOUDANT_DB.find(q);
        if(docs.docs.length>0){
            //regresar resultado..
            // cbOk(true);
                let user = {
                    nombre: docs.docs[0].nombre,
                    apellidos: docs.docs[0].apellidos,
                    email: docs.docs[0].email,
                    password: docs.docs[0].password,
                    fecha: docs.docs[0].fecha,
                    sexo: docs.docs[0].sexo,
                    image: docs.docs[0].image,
                    uid: docs.docs[0]._id,
                    rev: docs.docs[0]._rev
                }
            return user;
        }else{
            // cbOk(false);
            return ;
        }
    }
    getUniqueUser(name,lastname,email,cbOk){
        const q = {
            selector:{
                email:{"$eq":email},
                nombre:{"$eq":name},
                apellidos:{"$eq":lastname}
            }
        }
        STATS_DB_CLOUDANT.find(q).then((docs)=>{
            //console.log(docs);
            if(docs.docs.length>0){
                //regresar resultado..
                let stat = {
                    user: docs.docs[0].user,
                    apellidos: docs.docs[0].apellidos,
                    email: docs.docs[0].email,
                    game: docs.docs[0].game,
                    kills: docs.docs[0].kills,
                    win: docs.docs[0].win,
                    uid: docs.docs[0]._id,
                    rev: docs.docs[0]._rev
                }
                cbOk(stat);
            }else{
                cbOk();
            }
        });
    }
    async getStat(id){
        // let user = USERS_DB.find(ele=>ele.uid ===id);
        // return user;
        let user = await STATS_DB_CLOUDANT.get(id);
        return user;
    }
    async getStatByGame(nombre,cbOk){
        const q = {
            selector:{
                game:{"$eq":nombre}
            }
        }
        let docs = await STATS_DB_CLOUDANT.find(q);
        if(docs.docs.length>0){
            //console.log(docs);
            //window.location.assign("http://localhost:3000/api/stats/nombre")
            let stat = docs.docs;      
            cbOk(stat);
        }else{
            cbOk();
        }
        
    }
    async getStatByUser(email,cbOk){
        const q = {
            selector:{
                email:{"$eq":email}
            }
        }
        let docs = await STATS_DB_CLOUDANT.find(q);
        if(docs.docs.length>0){
            //console.log(docs);
            //window.location.assign("http://localhost:3000/api/stats/nombre")
            let stat = docs.docs;      
            cbOk(stat);
        }else{
            cbOk();
        }
        
    }
}

module.exports = statsController;