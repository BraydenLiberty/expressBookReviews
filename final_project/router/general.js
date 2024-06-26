const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {  
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (!doesExist(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let allBooksPromise = new Promise((resolve,reject) => {
        res.send(JSON.stringify(books,null,4));
        resolve("Get all books promise resolved");
    })
    
    allBooksPromise.then((successMessage) => {
        console.log(successMessage);
    })
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let byISBNPromise = new Promise((resolve,reject) => {
        res.send(books[isbn]);
        resolve("Get by isbn promise resolved");
    })

    byISBNPromise.then((successMessage) => {
        console.log(successMessage);
    })
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let searchByAuthorPromise = new Promise((resolve,reject) => {
        for(let key in books) {
            if(books.hasOwnProperty(key)) {
                let book = books[key];
                if (book.author === author) {
                    res.send(book)
                }
            }
        }
        resolve("Retrieve by author promise resolved")
    })

    searchByAuthorPromise.then((successMessage) => {
        console.log(successMessage);
    })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let searchByTitlePromise = new Promise((resolve,reject) => {
        for(let key in books) {
            if(books.hasOwnProperty(key)) {
                let book = books[key];
                if (book.title === title) {
                    res.send(book)
                }
            }
        }
        resolve("Retrieve by title promise resolved");
    })

    searchByTitlePromise.then((successMessage) => {
        console.log(successMessage);
    })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews) 
});

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }


module.exports.general = public_users;
