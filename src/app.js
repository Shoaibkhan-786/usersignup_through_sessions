require("dotenv").config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const userRouter = require("./routes/user-route");
const db_connect = require('./utils/db.connection')(session);

const app = express();
const port = parseInt(process.env.PORT || 8000);

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static("public"));
app.set('views', 'src/views')
app.set('view engine', 'ejs');



// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/session-demo-database',
        ttl: oneDay,
        autoRemove: 'native' 
    }) ,
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));



app.use((err,req,res,next) => {
    const { status = 500, message = 'something went wrong' } = err;
    res.status(status).send({message});
})

app.use(userRouter);

db_connect.
then(() => {
    app.listen(port, () => {
        console.log(`server is up and running on port ${port}`);
    });
})
.catch(() => {
    console.log('something went wrong while connecting database');
})













// app.get('/',(req,res) => {
//     session=req.session;
//     if(session.userid){
//         res.send("Welcome User <a href=\'/logout'>click to logout</a>");
//     }else
//     res.sendFile('views/index.html',{root:__dirname})
// });

// app.post('/user',(req,res) => {
//     if(req.body.username == myusername && req.body.password == mypassword){
//         session=req.session;
//         session.userid=req.body.username;
//         console.log(req.session)
//         res.send(`Hey there, welcome <a href=\'/logout'>click to logout</a>`);
//     }
//     else{
//         res.send('Invalid username or password');
//     }
// })


// app.get('/logout',(req,res) => {
    //     req.session.destroy();
    //     res.redirect('/');
    // });