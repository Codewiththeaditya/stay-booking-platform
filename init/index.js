const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js")

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().catch((err)=>{console.log(err)});

async function main(){
    await mongoose.connect(MONGO_URL).then((res) => console.log("connected"));

};


const initDB = async () =>{
    await Listing.deleteMany({}).then((res)=>{console.log("not here")});
    await Listing.insertMany(initData.data).then((res)=>{console.log("not here ig")}).catch((err)=>{console.log(err)});
    console.log("data Logged");
}

initDB();