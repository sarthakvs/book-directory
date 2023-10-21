const express = require('express');
const Joi = require('joi');
const app = express();
app.use(express.json());

const books = [
    {   id: 1 , title : "The Alchemist" , 
        author:"Paulo Coelho" , genre:["Fiction","Thriller"] , 
        pages: 208 ,publicationYear: 1988  
    },
    {   id: 2 , title : "1984", 
        author: "George Orwell", genre: ["Dystopian"] , 
        pages: 323 ,publicationYear: 1949 
    },
    {   id: 3 , title : "To Kill a Mockingbird", 
        author: "Harper Lee", genre:["Fiction","Thriller"] , 
        pages: 281 ,publicationYear: 1960 
    }
];

function validateBook(book){
    const schema = Joi.object({
        title: Joi.string().min(3).required(),
        author: Joi.string().min(2).required(),
        genre: Joi.array().items(Joi.string()).required(),
        pages: Joi.number().min(1).required(),
        publicationYear : Joi.number().integer().min(1700).max(2023).required()
    })
    return schema.validate(book);
}
function isTilePresent(book){
    if(books.find(bk=>bk.title === book.title)) return true;
    else return false;
}
function isIdPresent(id){
    const isPresent = books.find(bk=>bk.id===parseInt(id));
    if(isPresent) return isPresent;
    else return null;
}
function updateBook(toUpdate,updateFrom){
    if(updateFrom.title) toUpdate.title = updateFrom.title;
    if(updateFrom.author) toUpdate.author = updateFrom.author;
    if(updateFrom.genre) toUpdate.genre = updateFrom.genre;
    if(updateFrom.pages) toUpdate.pages = updateFrom.pages;
    if(updateFrom.publicationYear) toUpdate.publicationYear = updateFrom.publicationYear;
}

const port = 3000|| process.env.PORT;
app.listen(port,()=>{
    console.log(`Listening on port ${port}`);
});

app.get('/', (req,res)=>{
    res.send(`Hello,Good Game Theory!! Welcome to my Book directory API.Test it with Postman.Thanks.`);
});

  app.get('/api/books', (req, res) => {
    try {
      res.json(books);
    } catch (error) {
      console.error("Error retrieving book directory", error);
      res.status(500).send("Internal Server Error");
    }
  });

  app.post('/api/books', (req, res) => {
    const {error} = validateBook(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    if(!isTilePresent(req.body)){
        const newBook = {
            id : books.length +1,
            title: req.body.title,
            author: req.body.author,
            genre: req.body.genre,
            pages: req.body.pages,
            publicationYear: req.body.publicationYear
        }
        books.push(newBook);
        res.send(books);
      }
      else res.status(409).send("Book already exists");
  });

  app.put('/api/books/:id',(req,res)=>{
    const currentBook = isIdPresent(req.params.id);
    if(!currentBook) return res.status(404).send("Book not found");
    const {error} = validateBook(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    updateBook(currentBook,req.body);
    res.send(books);
});

app.delete('/api/books/:id',(req,res)=>{
      const currentBook = isIdPresent(req.params.id);
      if(!currentBook) return res.status(404).send("Book not found");
      const index = books.indexOf(currentBook);
      books.splice(index,1);
      res.send("Book " + JSON.stringify(currentBook.title) + " was deleted Sucessfully");
  });