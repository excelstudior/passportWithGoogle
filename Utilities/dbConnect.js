const keys=require('../config/keys')

//var {url,database}=require('../database/config')
var mongoose=require('mongoose')
var db;
var connectionState;

function connectDbServer() {
    if (db===undefined) {
        console.warn("Trying to init DB again!");
        return mongoose.connect(keys.mongodb.url+keys.mongodb.database,handleDbConnect);

    } else{
        console.log('readyState ',db.readyState)
    }
}

function handleDbConnect(err,connectedDb) {
    if (err) {
        return console.log(err)
    }
    console.log("DB initialized - connected to: " );
    console.log(connectedDb)
    connectionState=connectedDb.readyState
    db = connectedDb;
}

function connectDb(connectionString){
    return mongoose.connect(connectionString,(err,connectDb)=>{
        if(err){
            return console.log(err)
        }
        console.log(`Connected  to ${connectDb.name}` )
        console.log (connectDb.db)
        return connectDb.name
    })
}

function initDatabaseServer(req,res,next){
    connectDbServer();
    next();
}

module.exports={
    db,
    connectDb,
    initDatabaseServer,
}