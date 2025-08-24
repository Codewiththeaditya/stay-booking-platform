const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js")
require("dotenv").config({path: __dirname + "/../.env"});

const MONGO_URL =  process.env.MONGO_URL ||"mongodb://127.0.0.1:27017/wanderlust";

main().catch((err)=>{console.log(err)});

async function main(){
    await mongoose.connect(MONGO_URL).then((res) => console.log("connected"));

};


const initDB = async () =>{
    await Listing.deleteMany({}).then((res)=>{console.log("not here")});
    
    initData.data = initData.data.map((obj)=>({...obj, owner: "68aaefd7de63f06a9debb97d"}));console.log(initData.data);
    await Listing.insertMany(initData.data).then((res)=>{console.log("not here ig")}).catch((err)=>{console.log(err)});
    console.log("data Logged");
}

initDB();