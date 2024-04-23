import React, { useEffect, useState } from 'react';
import { getProduct, productStar } from '../functions/product';
import SingleProduct from '../components/cards/SingleProduct';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {getRelated} from '../functions/product';
import ProductCard from '../components/cards/ProductCard';

const Product = () => {
    const [product, setProduct] = useState({});
    const [related, setRelated] = useState([]);
    const { slug } = useParams();
    const [star, setStar] = useState(0);
    const { user } = useSelector((state) => ({ ...state }));

    useEffect(() => {
        loadSingleProduct();
    }, [slug]);

    useEffect(() => {
        if(product.ratings && user){
            let existingRatingObject = product.ratings.find(
                (ele) => ele.postedBy.toString() === user._id.toString()
            );
            existingRatingObject && setStar(existingRatingObject.star);
        }
    })

    const loadSingleProduct = () => {
    getProduct(slug).then((res) => {
       setProduct(res.data)
       getRelated(res.data._id).then((res) => setRelated(res.data))
    });
    }

    const onStarClick = (newRating, name) => {
        setStar(newRating);
        productStar(name, newRating, user.token)
        .then((res) => {
            console.log('Rating clicked ', res.data);
            loadSingleProduct();
        });
    }

    return (
        <div className='container-fluid'>
            <div className='row pt-4'>
                <SingleProduct 
                    product={product} 
                    onStarClick={onStarClick} 
                    star={star}
                />
            </div>
            <div className='row'>
                <div className='col text-center pt-5 pb-5'>
                    <hr/>
                    <h4>
                        Related Products
                    </h4>
                    <hr/>
                </div>
            </div>
            <div>
                {related.length ? 'yes' : "no"}
            </div>
        </div>
    );
};

export default Product;

