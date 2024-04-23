import React, { useEffect, useState } from 'react';
import { getProduct, productStar } from '../functions/product';
import SingleProduct from '../components/cards/SingleProduct';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const Product = () => {
    const [product, setProduct] = useState({});
    const { slug } = useParams();
    const [star, setStar] = useState(0);
    const { user } = useSelector((state) => ({ ...state }));

    useEffect(() => {
        loadSingleProduct();
    }, [slug]);

    const loadSingleProduct = () =>
    getProduct(slug).then((res) => setProduct(res.data));

    const onStarClick = (newRating, name) => {
        setStar(newRating);
        productStar(name, star, user.token)
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
        </div>
    );
};

export default Product;

