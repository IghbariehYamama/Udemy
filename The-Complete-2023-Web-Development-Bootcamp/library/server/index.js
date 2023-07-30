const express = require('express');
const {Books} = require("./model/Books");
const {Reviews} = require("./model/Reviews");
const { v4: uuidv4 } = require("uuid");
const app = express();
app.use(express.json());
const cookieParser = require("cookie-parser");
var bodyParser = require('body-parser')
const cors = require('cors');

const {baseUrl} = require('../constants');

const port = 3080;

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors());

const corsOptions = {
    origin: `${baseUrl.client}`,
    credentials: true
}

app.get("/", cors(corsOptions), (req, res) => {
    res.send("Welcome to your Wix Enter exam!");
});

app.get("/user", cors(corsOptions), (req, res) => {
    const userId = req.cookies?.userId || uuidv4();
    res.cookie("userId", userId).send({id: userId});
});

app.get('/books', cors(corsOptions), (req, res) => {
    let booksToReturn = Books;
    const {after} = req.query
    if (after) {
        booksToReturn = booksToReturn.filter((book) => book.publicationYear === after)
    }
    //return also all reviews
    res.send({Books: booksToReturn, Reviews});
});

app.post('/books', cors(corsOptions), (req, res) => {
    const userId = req.cookies?.userId;
    if (!userId) {
        res.status(403).end();
        return;
    }

    const {book} = req.body;
    if (!book) {
        res.status(400).json({message: 'Book is missing'}).end();
        return;
    }

    const {title ,author, publicationYear ,description} = book;
    if (!(title && author && publicationYear && description)) {
        res.status(400).json({message: 'Bad request'}).end();
        return;
    }

    const newBook = {
        title ,author, publicationYear ,description, id: uuidv4()
    }
    Books.push(newBook);
    res.send({book: newBook}).status(200).end()
});


//to add the review for the book that has bookId
//in the array Reviews
app.post('/books/:bookId', cors(corsOptions), (req, res) => {
    const userId = req.cookies?.userId;
    if (!userId) {
        res.status(403).end();
        return;
    }

    const {review} = req.body;
    if (!review) {
        res.status(400).json({message: 'Review is missing'}).end();
        return;
    }

    const {bookId ,reviewerName, reviewerContent, reviewerRating} = review;
    if (!(bookId && reviewerName && reviewerContent && reviewerRating)) {
        res.status(400).json({message: 'Bad request'}).end();
        return;
    }

    const newReview = {
        bookId ,reviewerName, reviewerContent, reviewerRating, id: uuidv4()
    }
    Reviews.push(newReview);
    res.send({review: newReview}).status(200).end()
});


app.get('/books/:bookId', cors(corsOptions), (req, res) => {
    const userId = req.cookies?.userId;
    if (!userId) {
        res.status(403).end();
        return;
    }

    const {bookId} = req.params
    const book = Books.find((book) => book.id === bookId);
    if (!book) {
        res.status(400).json({message: 'Book not found'}).end();
        return;
    }
    let reviews = Reviews.map(review => review.bookId === bookId);
    res.send({book, reviews});
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
