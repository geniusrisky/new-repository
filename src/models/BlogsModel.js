const mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
const blogsSchema = new mongoose.Schema( {
    title :{
        type:String,
        required :true,
       

    },
    body: {
        type: mongoose.Schema.Types.Mixed,
        required:true
    },
    authorId: {
        
        type:ObjectId,
        ref: "Author",
        required:true
    },
    
    tags: {
        type:[String],
       
    
    },
    category: {
        type:String,
        required:true
    },
    subcategory:{type:[String]},
   
    deletedAt: {
        type: Date,
        default:null
    }, 
    isDeleted:{
        type:Boolean,
        default:false,
    },
    publishedAt: {
        type : Date,
        default:null

    },
    isPublished:{
        type:Boolean,
        default:false
    }

   
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogsSchema)