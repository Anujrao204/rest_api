const express = require("express");
const app=express();
var bodyParser = require("body-parser")
const mongoose = require("mongoose")

//Database connection
const db="mongodb+srv://anujanilnemanwar204:Anujrao123@cluster0.ythqeri.mongodb.net/Booky?retryWrites=true&w=majority"
mongoose.connect(db,{useNewUrlParser:true}).then(()=>{
    console.log("Database connected")
});



// Database models
const bookModel=require("./database/book")
const authorModel=require("./database/author")
const publicationModel=require("./database/publication")



app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
/* Home page*/ 
app.get('/',(req,res)=>{
    res.end("Home page")
})

/* Get All books*/ 
app.get('/books', async (req,res)=>{
    const getallBooks = await bookModel.find()
    res.json({
       books : getallBooks
     } )
})

//Get specified isbn book
app.get('/books/isbn/:isbn',async (req,res)=>{
    const getspecifiedbook=await bookModel.findOne({IBSN : req.params.isbn})
    if(!getspecifiedbook){
        res.json({error:`The book with the ISBN Number ${req.params.isbn} is not found`})
    }
    else{
    return res.json({book : getspecifiedbook})   
    }
});


    


//Get specified books based on category
app.get('/books/category/:category',async (req,res)=>{
    const getspecifiedbook=await bookModel.findOne({category : req.params.category})
    if(!getspecifiedbook){
        res.json({error:`The book with the Category ${req.params.category} is not found`})
    }
    else{
    return res.json({book : getspecifiedbook})   
    }
});


//Get specified book on language
app.get('/books/language/:lan',async(req,res)=>{
    const getspecifiedbook=await bookModel.findOne({language : req.params.lan})
    if(!getspecifiedbook){
        res.json({error:`The book with the Language ${req.params.lan} is not found`})
    }
    else{
    return res.json({book : getspecifiedbook})   
    }
})

/* Get All Authors*/ 
app.get('/authors',async (req,res)=>{
    const getallauthors = await authorModel.find()
    res.json({
        Author : getallauthors
})
})

//Get a specific author
app.get('/authors/id/:id',async(req,res)=>{
    const getspecifiedbook=await authorModel.findOne({id : req.params.id})
    if(!getspecifiedbook){
        res.json({error:`The Author with the ID ${req.params.id} is not found`})
    }
    else{
    return res.json({book : getspecifiedbook})   
    }
})

//List of authors based on book's isbn number
app.get('/authors/isbn/:isbn',async(req,res)=>{
    const getspecifiedbook=await authorModel.findOne({books : req.params.isbn})
    if(!getspecifiedbook){
        res.json({error:`The Author with the book ISBN ${req.params.isbn} is not found`})
    }
    else{
    return res.json({book : getspecifiedbook})   
    }
})




/* Get All Publications*/ 
app.get('/publications',async (req,res)=>{
    const getallpub = await publicationModel.find()
    res.json({
        Publications : getallpub
})
})

//Get a specific publication
app.get('/publications/id/:id',async(req,res)=>{
    const getspecifiedbook=await publicationModel.findOne({id : req.params.id})
    if(!getspecifiedbook){
        res.json({error:`The Publication with the book ID ${req.params.id} is not found`})
    }
    else{
    return res.json({book : getspecifiedbook})   
    }
})

//Get a specific publication based on books
app.get('/publications/isbn/:isbn',async(req,res)=>{
    const getspecifiedbook=await publicationModel.findOne({books : req.params.isbn})
    if(!getspecifiedbook){
        res.json({error:`The Publication with the book ISBN ${req.params.isbn} is not found`})
    }
    else{
    return res.json({book : getspecifiedbook})   
    }
})




//Post method

//Add a new book
app.post('/book/new',async(req,res)=>{
    const {newBook} = req.body
    const addnewBook=bookModel.create(newBook)
    return res.json({Updatedbooks : bookModel})
})

//Add a new Author
app.post('/author/new',async(req,res)=>{
    const{newAuthor}=req.body
    const addnewAuthor=authorModel.create(newAuthor)
    return res.json({
        Authors : addnewAuthor
    })
})

//Add a new Publication
app.post('/publication/new',async(req,res)=>{
    const {newpub} = req.body
    const addNewPub=publicationModel.create(newpub)
    return res.json({UpdatedPublications : publicationModel})
})


//PUT method 
//Update the isbn for the given pubId
app.put('/publication/update/isbn/:isbn',(req,res)=>{
    

    database.publication.forEach(
        (pub)=>{
            if(pub.id===req.body.pubId){
                return pub.books.push(req.params.isbn)
            }
        }
    )

    database.books.forEach(
        (book)=>{
            if(book.IBSN===req.params.isbn){
            book.publication=req.body.pubId
            return
            }
        }
    )
    return res.json({Publications : database.publication,
                    books:database.books,
                    message:"SuccessfullyUpdated"})
})


//Update title of the book using isbn as parameter
app.put('/book/update/name/:isbn',async(req,res)=>{
    const updatedbook=await bookModel.findOneAndUpdate(
        {
            IBSN : req.params.isbn
        },
        {
           name : req.body.newName
        },
        {
            new:true
        }
    )
    return res.json({
        updatedbook : updatedbook,
        "message":"Successfully Updated"
    })
})

//Add a new author to the given the given isbn book
app.put('/addnewauthor/:isbn',async(req,res)=>{
    //For updating in Books databse
      const newbook=await bookModel.findOneAndUpdate(
        {
            IBSN : req.params.isbn
        },
        {
            $addToSet:{
               author:req.body.newAuthor
            }
        },
        {
            new:true
        }
      )

    //For updating in Authors database
    const newauthor=await authorModel.findOneAndUpdate(
        {
            id : req.body.newAuthor
        },
        {
            $addToSet :{
                books : req.params.isbn
            }
        }
    )
      return res.json({
        Updatedbooks:newbook,
        UpdatedAuthors : newauthor,
        "message":"Successfully Updated"
      })
})


//DELETE
//Delete a specified book
app.delete('/books/delete/isbn/:isbn',async(req,res)=>{
    const specificbooks= await bookModel.findOneAndDelete(
    {
        IBSN : req.params.isbn
    }        
    )
    await authorModel.updateMany(
        { books: req.params.isbn },
        { $pull: { books: req.params.isbn } }
    );
    await publicationModel.updateMany(
        { books: req.params.isbn },
        { $pull: { books: req.params.isbn } }
    ); 
    return res.json({
    updatedbook : specificbooks,
    "message":"Successfully Updated"
    })
})

app.listen(3000,()=>{
    console.log("The server is up and running");
})

//Delete a specified Author
app.delete('/author/delete/:id',async(req,res)=>{
    const speciedauthor = await authorModel.findOneAndDelete({
        id : parseInt(req.params.id)
    })
    return res.json({
         deletedauthor : speciedauthor,
         "message":"Successfully Deleted"
    })
})


//Delete a specified Publication
app.delete('/publication/delete/:id',async(req,re)=>{
    const specifiedpub= await publicationModel.findOneAndDelete(
        {
            id : parseInt(req.params.id)
        }
    )
    return res.json({
        deletepub : specifiedpub,
        "Message":"Deleted Successfully"
    })
})


