import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import { SearchOutlined } from '@ant-design/icons';

const Search = () => {
    const dispatch = useDispatch();
    const { search } = useSelector((state) => ({ ...state }));
    const { text } = search;

    const navigate = useNavigate();

    const handleChange = (e) => {
        dispatch({
            type: "SEARCH_QUERY",
            payload: { text: e.target.value },
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate(`/shop?${text}`);
    };

    return (
        <form onSubmit={handleSubmit} className='d-flex'>
            <InputGroup>
                <Button variant="outline-dark" type="submit">
                    <SearchOutlined />
                </Button>
                <FormControl
                    type='search'
                    placeholder='Search'
                    onChange={handleChange}
                    value={text}
                />
            </InputGroup>
        </form>
    );
};

export default Search;