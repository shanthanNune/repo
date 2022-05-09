const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const res = require("express/lib/response");

var mongo = require('mongodb').MongoClient;

var url = "mongodb://shash:shashankdvn45@cluster0-shard-00-00.d3se7.mongodb.net:27017,cluster0-shard-00-01.d3se7.mongodb.net:27017,cluster0-shard-00-02.d3se7.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-85rkcv-shard-0&authSource=admin&retryWrites=true&w=majority";

console.log("Node server is running");

const createUser = (username, password, res_u) => {
    mongo.connect(url, function(err, db) {
        if(err ) throw err;
        var dbo = db.db("users");
        var collection = dbo.collection("credentials");
        collection.insertOne({username: username, password: password}, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            res_u.status(200).send("OK");
            db.close();
        }
        );
    });
}

const finduser = (username, password, res) => {
    // find user and if user if found, return true or else false

    console.log("Finding users in database");
    var d;
    mongo.connect(url, function(err, db) {
        if(err ) throw err;
        var dbo = db.db("users");
        var collection = dbo.collection("credentials");

        collection.find({user: username, password: password}).count()
        .then(function(count) {
            if(count > 0) {
                console.log("User found");
                d = true;
                res.status(200).send("OK");
            } else {
                console.log("User not found");
                res.status(500).send("SERVER");
            }
            db.close();
        });
    });
}

const app = express();
app.use(cookieParser());
const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post("/register", async (req, res) => {
    console.log(req.body);
    const username = req.body.name;
    const password = req.body.password;
    createUser(username, password, res,  (err) => {
        if (err) throw err;
        res.status(200).send("User created");
    });
});

// router post register 
router.post("/login", async (req, res) => {
    console.log(req.body);
    const username = req.body.name;
    const password = req.body.password;
    const user_found=finduser(username, password, res, (err) => {
        if (err) throw err;
        // res.send("OK");
    });
    if(user_found){
        console.log("sending 200");
        // return res.status(200).send("OK");
    }
    else{
        console.log("sending 500");
        // return res.status(500).send("Error");
    }
});

router.get("/", (req, res) => {
    // const username = req.body.name;
    // findUserByName(username,  (err, user) => {
    //     console.log(user);
    //     res.status(200).send("This is an authentication server");
    // })
    // res.status(200).send("This is an authentication server");
    res.status(200).send("This is an authentication server");
});

app.use(router);
const port = 1111;
const server = app.listen(port, () => {
    console.log("Server listening at " + port);
});