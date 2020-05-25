const mongoose = require('mongoose')
const credentials = require('../credentials');

// let url = "mongodb+srv://admin:admin@cluster0-ql4pi.mongodb.net/test?retryWrites=true&w=majority"

mongoose.connect(credentials.dbUrl,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("Connected to database");
}).catch((err)=>{
    console.log("Not connected to database ",err);
});


module.exports = mongoose;