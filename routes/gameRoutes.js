'use strict';
const { response } = require('express');
const fs = require('fs');
const express = require('express');
const router = express.Router();
const GameController = require('../controllers/gameControllers');
const gameCtrl = new GameController();

router.post('/games', (req, res) =>{    
    let b = req.body;
    console.log("post");
    if (b.nombre && b.tipo && b.fecha && b.img) {
        console.log("name: " + b.nombre);
        gameCtrl.getGameByName(b.nombre, (u)=>{
            console.log("u: " +JSON.stringify(u));
            if (u) {
                res.status(400).send('game already exists');
            } else {
                gameCtrl.insertGame(b,(game)=>{
                    res.status(201).send(game);
                });
            }
        });
    } else {
        res.status(400).send('missing arguments');
    }
})

// FALTA 
router.get('/games/', async (req, res) => {
    /*try{
        let list = await gameCtrl.getList();
        console.log("list: " + JSON.stringify(list));
        res.status(200).send(JSON.parse(list));
    }catch(error){
        res.status(400).send(error);
    }*/
    let list = await gameCtrl.getList();
    if(list){
        //console.log("List: " + JSON.stringify(list));
        //newL = JSON.stringify(list);
        res.status(200).send(list);
    }        
    else
        res.status(400).send(error);
})

router.get('/games/:nombre', (req, res) =>{
    if(req.params.nombre){
        // users = users.find(ele=> ele.email === req.params.email);
        gameCtrl.getGameByName(req.params.nombre,(games)=>{
            if(games){
                res.send(games);
            }else{
                res.set('Content-Type','application/json');
                res.status(204).send({});
            }
        });
    }else{
        res.status(400).send('missing params');
    }
    
})

// put/api/games/:email
router.put('/games/:email', (req, res) =>{
    let mail = req.path.split("/").pop();
    let user = gameCtrl.getUserByEmail(mail);
    const oldU = user;
    console.log("user: " + JSON.stringify(user));
    const reqs = req.query;
    console.log("reqs: " + JSON.stringify(reqs));
    if(!user){
        res.status(404).send("Usuario no encontrado");
    }
    else{
        const oldUID = oldU.uid;
        user = reqs;
        console.log("uid: " + user.uid);
        user.email = oldU.email;
        user.fecha = oldU.fecha;
        user.sexo = oldU.sexo;
        user.password = oldU.password;   
        gameCtrl.deleteUser(oldU);
        gameCtrl.insertUser(user);
        user.uid = oldU.uid;
        console.log("update: " + JSON.stringify(user));
        const games = gameCtrl.getList();
        let file = fs.readFileSync('./data/games.json');
        console.log("file: " + file);
        fs.writeFileSync('./data/games.json', JSON.stringify(games, null, 2));
        res.status(200).send(user);
    }
})
/*
"_id": "6293fa845442a6b3de6234d424590b45",
  "_rev": "1-383c3cc35c5f3bbe28647197220d4247",
*/
router.delete('/games/:nombre', (req, res) =>{
    if(req.params.nombre){
        gameCtrl.getGameByName(req.params.nombre, (g) => {
            if(g){
                gameCtrl.deleteGame(g, (deleted) => {
                    res.status(200).send({"deleted":deleted});
                })
            }
            else{
                res.status(400).send("El juego no existe");
            }
        })
    }
    else{
        res.status(200).send("Argumentos inválidos");
    }
})

module.exports = router;