const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Register user
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(username && password){
    if(!isValid(username)){
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered"});
    } else {
      return res.status(404).json({message: "User already exists"});
    }
  }
  return res.status(400).json({message: "Unable to register user"});
});


// ✅ Get all books (using async/await + axios)
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});


// ✅ Get book details based on ISBN (using async/await + axios)
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;

  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: "Book not found" });
  }
});


// ✅ Get book details based on author (using async/await + axios)
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;

  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: "No books found for this author" });
  }
});


// ✅ Get all books based on title (using async/await + axios)
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;

  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: "No books found for this title" });
  }
});


// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if(book){
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
