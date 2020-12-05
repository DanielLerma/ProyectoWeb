const fs = require('fs');
const GAMES_DB = require('../data/games.json');
let CURRENT_ID = 0;
const CLOUDANT_CREDS = require('../localdev-config.json');
const CloudantSDK = require('@cloudant/cloudant');
const { EPROTONOSUPPORT } = require('constants');
let url = CLOUDANT_CREDS.url;
const cloudant = new CloudantSDK(url);
const GAMES_DB_CLOUDANT = cloudant.db.use('mydb');

/*let uids = GAMES_DB.map((obj)=>{return obj.uid});
CURRENT_ID = Math.max(...uids)+1;*/

console.log(`Current id: ${CURRENT_ID}`);
// console.table(GAMES_DB);
class GameController {
    generateId(){
        let id = CURRENT_ID;
        CURRENT_ID++;
        fs
        return id;
    }
    async insertGame(game, cbOk){
        GAMES_DB_CLOUDANT.insert(game).then((addedEntry) => {
            //console.log("ae: " + addedEntry);
            //addedEntry.ok? -> prop. que crea la BD cuando se inserta
            if(addedEntry.ok){
                game.rev = addedEntry.rev;
                game.uid = addedEntry.id;
                cbOk(game);
            }
            else{
                cbOk();
            }
        }).catch((error) => {
            cbOk(null, error);
        })
    }
    async getList(cbOk){
        let games = new Array();
        let entries = await GAMES_DB_CLOUDANT.list({
            include_docs: true
        });
        //console.log("entries: " + JSON.stringify(entries));
        for (let entry of entries.rows) {
            //console.log("entry: " + entry.doc)
            games.push(entry.doc);
        }
        //console.log("games: " + JSON.stringify(games));
        return games;
    }
    async deleteGame(game, cbOk){

        let dtry = await GAMES_DB_CLOUDANT.destroy(game.uid, game.rev);
        cbOk(dtry);
        return dtry;
        
    }
    getGameByName(nombre, cbOk){
        const q = {
            selector: {
              nombre: { "$eq": nombre}
            }
        };
        GAMES_DB_CLOUDANT.find(q).then((docs) => {
            if(docs.docs.length>0){
                //console.log(docs);
                //cbOk(true);
                let game = {
                    nombre: docs.docs[0].nombre,
                    tipo: docs.docs[0].tipo,
                    fecha: docs.docs[0].fecha,
                    img: docs.docs[0].img,
                    uid: docs.docs[0]._id,
                    rev: docs.docs[0]._rev
                }        
                cbOk(game);
            }else{
                cbOk();
            }
        });
        
        
    }
}
module.exports = GameController;
