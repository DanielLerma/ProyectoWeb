'use strict';
const { log } = require('console');
const express = require('express');
const UsersController = require('../controllers/UsersController');
const usersCtrl = new UsersController();
const StatsController = require('../controllers/statsController');
const statsCtrl = new StatsController();
const router = express();

router.post('/', (req, res) => {
    let b = req.body;
    if (b.user && b.game && b.email) {
        usersCtrl.getUserByEmail(b.email, (u)=>{
            console.log(u);
            if (u) {
                statsCtrl.insertStat(b, (stat) => {
                    res.status(201).send(stat);
                })
            } else {
                res.status(400).send("Usuario no dado de alta");
            }
        });
    } else {
        res.status(400).send('missing arguments');
    }
});

router.get('/:game',(req,res)=>{
    // let userCtrl = new UsersController();
    // let users = userCtrl.getList();
    if(req.params.game.includes('@')){
        console.log("email");
        // users = users.find(ele=> ele.email === req.params.email);
        statsCtrl.getStatByUser(req.params.game,(stats)=>{
            if(stats){
                res.send(stats);
            }else{
                res.set('Content-Type','application/json');
                res.status(204).send({});
            }
        });
    }
    else if(!req.params.game.includes('@')){
        console.log("name");
         // users = users.find(ele=> ele.email === req.params.email);
         statsCtrl.getStatByGame(req.params.game,(stats)=>{
            if(stats){
                res.send(stats);
            }else{
                res.set('Content-Type','application/json');
                res.status(204).send({});
            }
        });
    }
    else{
        res.status(400).send('missing params');
    }
});

router.put('/:email',(req,res)=>{
    let b = req.body;
    if (req.params.email && (b.nombre || b.apellidos || b.password  || b.fecha)) {
        usersCtrl.getUserByEmail(b.email, (u)=>{

            if (u) {
                b.uid = u.uid;
                Object.assign(u,b);
                usersCtrl.updateUser(u,(updatee)=>{
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

// USAR MIDDLEWARE DE AUT. DE ADMIN. PARA PODER BORRAR
router.delete('/',(req,res)=>{
    let b = req.body;
    if (b.nombre && b.apellidos && b.email) {
        usersCtrl.getUniqueUser(b.nombre, b.apellidos, b.email, (u)=>{
            console.log("U: " + JSON.stringify(u));
            if (u) {
                statsCtrl.deleteStat(u, (stat) => {
                    res.status(201).send("deleted: "+stat);
                })
            } else {
                res.status(400).send("Usuario no dado de alta");
            }
        });
    } else {
        res.status(400).send('missing arguments');
    }
});
module.exports = router;