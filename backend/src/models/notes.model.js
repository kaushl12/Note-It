import  mongoose,{Schema}  from 'mongoose';


const noteSchema=new Schema({
    title:{
        type:String,
        required:true,
    trim: true,

    },
    content:{
        type:String,
        required:true,
    trim: true,

    },
    user:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"User"
    }

},{timestamps:true})

export const Note=mongoose.model("Note",noteSchema)