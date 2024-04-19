const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app = express();
app.use(express.json());
app.use(cors());


const db = mysql.createConnection({
    host:"localhost",
    user: "root",
    password: "",
    database: "dealfinder" // DEAL FINDER
})

// function get_items(){
//     // SQL query
//     var sql = "select STORENAME from grocerystore where website='None'";        console.log(sql);
//     return sql;
// }

app.listen(8081, () => { // port number and function to say it is listening
    console.log("listening")
})


// console.log(get_items());