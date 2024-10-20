const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();


/*Routes */
const notesRoutes = require("./routes/note");
const usersRoutes = require("./routes/user");
const authRoutes = require("./routes/auth.js");
const authMiddleware = require("./middlewares/authMiddlewares.js");


/*Db Connect */
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to db");
    } catch (error) {
        console.log(error);
    }
}

/*cors kullanma*/
app.use(express.json());
app.use(cors());

/*Routes dahil etme  */
app.use("/api/notes" , notesRoutes);
app.use("/api/users" , authRoutes);
app.use("/api/profile" , usersRoutes);
/*PORTU belirleme  */
const PORT = 8000
/*Öylesine istek xd  */
app.get("/" ,(req,res)=>{
    res.send("Hello World");
})
/*Server Dinleme */
app.listen(PORT,()=>{
    connect();
    console.log(`Server ${PORT} portunda çalıştı!`);
})