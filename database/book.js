const mongoose = require("mongoose")

const bookSchema = mongoose.Schema(
    {
        IBSN : String,
        name : String,
        pubDate : String,
        author : [Number],
        language : String,
        publication :Number,
        numPage :Number,
        category :[String]
    }
)

const bookModel=mongoose.model("books",bookSchema)

module.exports=bookModel;