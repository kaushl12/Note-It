import  express  from 'express';

const app = express();
import noteRouter from './routes/notes.routes.js'


app.use('/api/notes/',noteRouter)
app.listen(5001,()=>{
    console.log("Hello sever started bcudicviduvciv");
    
})


// 