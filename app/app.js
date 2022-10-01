import express, { json } from "express";
import path from "path";
import { entriesRouter } from "./routes/entriesRouter.js";
import { userRouter } from "./routes/usersRouter.js";

const app = express();
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(express.static("public"))

app.use(entriesRouter)
app.use(userRouter)


app.get("/", (req, res)=>{
    res.sendFile(path.resolve("./public/landingpage/landingpage.html"),(err)=>{ //TODO: consider refactoring
        if(err){
            console.error(err)
        }
    })
})

app.get("/login", (req, res)=>{
    res.sendFile(path.resolve("./public/login/login.html"),(err)=>{ //TODO: consider refactoring
        if(err){
            console.error(err)
        }
    })
})



const server = app.listen(PORT, (error) =>{
    if(error){
        console.error(error)
    }
    console.log("Server is running on port:", server.address().port)
})