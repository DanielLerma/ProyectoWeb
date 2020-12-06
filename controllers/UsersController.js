const fs = require('fs');
//const USERS_DB = require('../data/users.json');
const CloudantSDK = require('@cloudant/cloudant');
const CLOUDANT_CREDS = require('../localdev-config.json');
const cloudant = new CloudantSDK(CLOUDANT_CREDS.url);
const USERS_CLOUDANT_DB = cloudant.db.use('users');
let CURRENT_ID = 10000;

class UsersController {
    generateId(){
        let id = CURRENT_ID;
        CURRENT_ID++;
        fs
        return id;
    }
    insertUser(user,cbOk){
        USERS_CLOUDANT_DB.insert(user).then((addedEntry)=>{
            //console.log(addedEntry);
            if(addedEntry.ok){
                //user.id = generateId()
                user.rev= addedEntry.rev;
                user.uid = addedEntry.id;
                cbOk(user);
            }else{
                cbOk();
            }
        }).catch((error)=>{
            cbOk(null,error);
        });
    }
    updateUser(user,cbOk){
        //console.log('update user...')
        let updatee = {
            nombre: user.nombre,
            apellidos: user.apellidos,
            email: user.email,
            password: user.password,
            _id: user.uid,
            _rev: user.rev,
            token: user.token
        }
        this.getUserByEmail(updatee.email,(foundUser)=>{
            if(foundUser){
                USERS_CLOUDANT_DB.insert(updatee).then((addedEntry)=>{
                    //console.log(addedEntry);
                    if(addedEntry.ok){
                        user.rev= addedEntry.rev;
                        user.uid = addedEntry.id;
                        cbOk(user);
                    }else{
                        cbOk();
                    }
                }).catch((error)=>{
                    cbOk(error);
                });
            }else{
                cbOk();
            }
        })
    }

    deleteUser(user,cbOk){
        USERS_CLOUDANT_DB.destroy(user.uid,user.rev).then((body)=>{
            //console.log(body);
            if(body.ok){
                cbOk(true);
            }else{
                cbOk(false);
            }
        });
    }

    
    async getList(cbOk){
        let users = new Array();
        let entries = await USERS_CLOUDANT_DB.list({include_docs:true});
            for(let entry of entries.rows){
                //console.log(entry);
                users.push( entry.doc );
            }
        return users;
    }
    async getUserByCredentials(email, password,cbOk){
        const q = {
            selector:{
                email:{"$eq":email},
                password:{"$eq":password}
            }
        }
        let docs = await USERS_CLOUDANT_DB.find(q);
        console.log(docs.docs)
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
        USERS_CLOUDANT_DB.find(q).then((docs)=>{
            //console.log(docs);
            if(docs.docs.length>0){
                //regresar resultado..
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
                cbOk(user);
            }else{
                cbOk();
            }
        });
    }
    async getUser(id){
        // let user = USERS_DB.find(ele=>ele.uid ===id);
        // return user;
        const q = {
            selector:{
                _id:{"$eq":id}
            }
        }
        let user = await USERS_CLOUDANT_DB.find(q);
        console.log("user dentro de get: " + JSON.stringify(user));
        return user.docs[0];
    }
    async getUserByEmail(email,cbOk){
        // let user = USERS_DB.find(ele=>ele.email ===email);
        // return user;
        const q = {
            selector:{
                email:{"$eq":email}
            }
        }
        let docs = await USERS_CLOUDANT_DB.find(q)
        console.log(docs);
        if(docs.docs.length>0){
            //regresar resultado..
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
            cbOk(user);
        }else{
            cbOk();
        }
    }
}

module.exports = UsersController;