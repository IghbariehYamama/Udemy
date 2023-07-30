import React, {useState} from 'react';
import {AppBar, Toolbar, Typography, Slider, Box, TextField, Button} from '@mui/material';

const FilterOptions = ({reviews, books, setBooks, handleFilterChange}) => {
    const [ratingValue, setRatingValue] = useState(0);
    const [yearValue, setYearValue] = useState([1900, 2023]);
    const [searchValue, setSearchValue] = useState('');

    const handleRatingChange = (event, newValue) => {
        setRatingValue(newValue);
        if((reviews.length === undefined) || (reviews.length === 0)){
            console.log("there are no reviews");
        }
        else{
        //look for all reviews that are bigger than newValue
        let tmp = reviews.filter(review => (review.reviewerRating >= newValue));
        let found;
        let res = [];
        //then get the book objects that have these high ratings
        tmp.map(item => {
            found = books.find(book => (book.id === item.bookId));
            res.push(found);
        });
        setBooks(res);
        }
    };

    const handleYearChange = (event, newValue) => {
        setYearValue(newValue);
        //look for all books that are bigger than the new year
     
        setBooks(books.map(book => {
            if(book.publicationYear >= yearValue){
                return book;
            } 
        }));
    };

    const handleYearChangeCommitted = () => {
        handleFilterChange(yearValue);
    };

    const handleSearch = () => {
        let res = books.filter(book => (book.title.includes(searchValue) || book.description.includes(searchValue)));
        setBooks(res);
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" style={{marginRight: '1rem'}} data-testid='filters-title'>
                    Filter Options
                </Typography>
                <Box sx={{width: 300}}>
                    <Toolbar>
                        <TextField
                            variant="outlined"
                            label="Search query"
                            size="small"
                            style={{backgroundColor: 'white', borderRadius: '4px', marginRight: '1rem'}}
                            data-testid='filters-search-textField'
                            onChange={(event) => {
                                setSearchValue(event.target.value)
                            }}
                        />
                        <Button variant="contained" color="primary" data-testid='filters-searchBtn' onClick={() => {
                            handleSearch()
                        }}>
                            Search
                        </Button>
                    </Toolbar>
                </Box>
                <Box sx={{width: 150, marginRight: '4rem'}}>
                    <Typography gutterBottom variant="h6" data-testid='filters-rating-title'>Rating</Typography>
                    <Slider
                        value={ratingValue}
                        onChange={() => {handleRatingChange()}}
                        onChangeCommitted={() => {
                            // add code here
                        }}
                        valueLabelDisplay="auto"
                        min={0}
                        max={5}
                        step={1}
                        color="secondary"
                        marks
                        data-testid='filters-rating-slider'
                    />
                </Box>
                <Box sx={{width: 150, marginRight: '4rem'}}>
                    <Typography gutterBottom variant="h6" data-testid='filters-publicationYear-title'>Publication Year</Typography>
                    <Slider
                        value={yearValue}
                        onChange={() => {handleYearChange()}}
                        onChangeCommitted={() => {handleYearChangeCommitted()}}
                        valueLabelDisplay="auto"
                        min={1900}
                        max={2023}
                        step={1}
                        color="secondary"
                        data-testid='filters-publicationYear-slider'
                    />
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default FilterOptions;
