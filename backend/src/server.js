import  express  from 'express';

const app = express();
import noteRouter from './routes/notes.routes.js'


app.use('/api/notes/',noteRouter)
app.listen(5001,()=>{
    console.log("Hello sever started bcudicviduvciv");
    
})


// mongodb+srv://kaushalchaudhari82_db_user:Nsh8M9y11MtzhkAf@cluster0.dzma5nz.mongodb.net/?appName=Cluster0