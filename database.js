const mongoose = require('mongoose');
   mongoose.set('strictQuery',true);
// mongoose.set('useNewUrlParser', true);
// mongoose.set('useUnifiedTopology',true);
// mongoose.set('useFindAndModify',false);
// mongoose.set('useUnifiedTopology',true);


class Database{
         
    constructor(){
        this.connect();

    } 

     connect(){
        mongoose.connect("mongodb+srv://admin:1234*@musemosaiccluster.oobyaon.mongodb.net/MuseMosaicDB?retryWrites=true&w=majority")
          //then block code will run when the above connection with database is succesful
        .then(() => {
            console.log("Database connection successfull");
 })

 // the catch code will run when the connection with database is unsucessful.
        .catch((err ) => {
             console.log("Problem in connecting with database" + err);
 })
    }
}

module.exports = new Database();
