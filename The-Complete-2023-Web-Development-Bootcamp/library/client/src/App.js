// App.js
import React, {useEffect, useState} from 'react';
import BookListing from './BookListing';
import BookDetails from './BookDetails';
import {BrowserRouter as Router, Route, Routes,} from "react-router-dom";
import axios from "axios";
import {AppBar} from "@mui/material";
import FilterOptions from "./FilterOptions";

const App = () => {
    axios.defaults.withCredentials = true;
    const baseURL = "http://localhost:3080";

    const [userId, setUserId] = useState([])
    const [books, setBooks] = useState([]);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        getUser();
        getBooks();
    }, []);

    const getBooks = () => {
        axios.get(`${baseURL}/books`)
            .then((response) => {
                setBooks(response.data.Books)
                setReviews(response.data.Reviews)
            })
            .catch((error) => console.error(error));
    }

    const postBook = (title, author, publicationYear, description) => {
        axios.post(`${baseURL}/books`, {
            book: {title, author, publicationYear, description}
        }, {
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            }
        }).then((response) => {
            setBooks([...books, response.data.book])
        }).catch(error => {
            console.log(error)
        });

    }

    const getUser = () => {
        axios.get(`${baseURL}/user`).then((response) => {
            setUserId(response.data.id);
        }).catch(error => {
            console.log(error)
        });
    }

    //a function that gives the top reviewer badge
    //based on if he reviewed more than 5 different book
    const topReviewBadge = () => {
        axios.get(`${baseURL}/books`)
            .then((response) => {
                const reviews = response.data.Reviews;
                const res = [];
                let found;
                reviews.map(review => {
                    //look for any previous reviews by this human
                    found = res.find(item => item.reviewerName === review.reviewerName);
                    //if this is the first review add him to the array
                    if(found === undefined){
                        res.push({found, count: 1});
                    }
                    //else then check if this is a new review
                    else{
                        //if this is a new review then update the count property
                        if(found.bookId != review.bookId){
                            res = res.map(ob => {
                                if(ob.reviewerName == review.reviewerName){
                                    ob.count += 1;
                                }
                                return ob;
                            });
                        }
                    }
                });
                return topBadge(res);
            })
            .catch((error) => console.error(error));
    }

    //a helping function that returns the one with the top badge
    //according to the instructions
    const topBadge = (res) => {
        let theTop = '';
        theTop = res.find(item => item.count > 5);
        return theTop;
        };


    const handleFilterChange = (publicationYear) => {
        const params = [];
        if (publicationYear) {
            params.push(`after=${publicationYear[0]}&before=${publicationYear[1]}`)
        }

        let url = `${baseURL}/books${params ? `?${params.join('&')}` : ``}`;
        axios.get(url)
            .then((response) => {
                setBooks(response.data.Books)
            })
            .catch((error) => console.error(error));
    }

    const renderToolBar = () => {
        return (
            <AppBar position="sticky" color='inherit'>
                <FilterOptions
                    reviews = {reviews}
                    books = {books}
                    setBooks = {setBooks}
                    handleFilterChange={handleFilterChange}/>
            </AppBar>
        );
    }

    return (
        <div className="App">
            {renderToolBar()}
            <Router>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <BookListing
                                books={books}
                                postBook={postBook}
                                showTopReviewerBadge={
                                    topReviewBadge
                                }/>
                        }
                    />
                    <Route
                        path="/book/:bookId"
                        element={
                            <BookDetails/>
                        }
                    />
                </Routes>
            </Router>
        </div>
    );
};

export default App;

