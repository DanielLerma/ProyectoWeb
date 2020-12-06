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

router.put('/games/:nombre',(req,res)=>{
    let b = req.params.nombre;
    console.log("b: "+b);
    let body=req.body;
    console.log("body: "+JSON.stringify(body));
    if (b && (body.nombre || body.tipo || body.fecha  || body.img)) {
        gameCtrl.getGameByName(b, (u)=>{
            if (u) {
                console.log(JSON.stringify(u));
                Object.assign(u,body);
                gameCtrl.updateGame(u,(updatee)=>{
                    console.log("update:"+JSON.stringify(updatee));
                    res.status(200).send(updatee);
                });
            } else {
                res.status(404).send('user does not exist');
            }
        });
    } else {
        res.status(400).send('missing arguments');
    }
});

router.delete('/games/:nombre', (req, res) =>{
    console.log("nombre dentro del delete: " + req.params.nombre);
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