import React, { useEffect, useState } from 'react';
import { getProduct } from '../functions/product';

const Product = ({ match }) => {
    const [product, setProduct] = useState({});

    const { slug } = match.params;

    useEffect(() => {
        const loadSingleProduct = async () => {
            try {
                const res = await getProduct(slug);
                setProduct(res.data);
            } catch (error) {
                console.error("Failed to fetch product:", error);
                // Optionally, update the state to show an error message or a fallback UI
            }
        };

        loadSingleProduct();
    }, [slug]); // dependency array ensures this effect runs only when `slug` changes

    return <>{JSON.stringify(product)}</>;
};

export default Product;
