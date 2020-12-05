'use strict';
const fs = require('fs');
const express = require('express');
const app = express();
const randomize = require('randomatic');
const GameController = require('./controllers/gameControllers');
const gameCtrl = new GameController();

const UserController = require('./controllers/UsersController');
const userCtrl = new UserController();

const StatsController = require('./controllers/statsController');
const statsCtrl = new StatsController();

const jwt = require('jsonwebtoken');

// CARGAR MIDDLEWARE
app.use(express.static(__dirname +'/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.procces || 3000; // PONEMOS EL PUERTO

const gamerRouter = require('./routes/gameRoutes');
const userRouter = require('./routes/userRoutes');
const statsRouter = require('./routes/statsRoutes');
const SECRET_JWT = process.env.SECRET_JWT || 'h@la123Cr@yola';

async function authentication(req,res,next){
    let xauth = req.get('x-auth-user');
    if(xauth){
        let id = xauth.split("-").pop();
        let user = userCtrl.getUser(parseInt(id));
        console.log("user: " + user);
        if(user && user.token === xauth){
            req.uid = user.uid;
            next();
        }else{
            res.status(401).send('Not authorized');
        }
    }else{
        res.status(401).send('Not authorized');
    }
    
}

app.post('/api/login', async (req,res)=>{
    if(req.body.email && req.body.password){
        console.log(req.body);
        let uctrl = new UserController();
        let user = await uctrl.getUserByCredentials(req.body.email,req.body.password);
        if(user){
            let token = randomize('Aa0','10')+"-"+user.uid;
            //let token = jwt.sign({uid:user.uid}, SECRET_JWT);
            console.log(token);
            console.log(user);
            user.token = token;
            uctrl.updateUser(user);
            res.status(200).send({"token":token});
        }else{
            res.status(401).send('Wrong credentials');
        }
    }else{
        res.status(400).send('Missing user/pass');
    }
});

app.post('/api/users', (req, res) => {
    let b = req.body;
    if (b.nombre && b.apellidos && b.email) {
        let usersCtrl = new UserController();
        usersCtrl.getUniqueUser(b.nombre, b.apellidos, b.email, (u)=>{
            console.log(u);
            if (u) {
                res.status(400).send('user already exists');
            } else {
                usersCtrl.insertUser(b,(user)=>{
                    res.status(201).send(user);
                });
            }
        });
    } else {
        res.status(400).send('missing arguments');
    }
});

app.get('/api/games/', async (req, res) => {
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

app.get('/api/stats/', async (req, res) => {
    let list = await statsCtrl.getList();
    if(list){
        //console.log("List: " + JSON.stringify(list));
        //newL = JSON.stringify(list);
        res.status(200).send(list);
    }        
    else
        res.status(400).send(error);
})

app.use('/api', gamerRouter);
app.use('/api/users', userRouter);
app.use('/api/stats', statsRouter)

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
})
