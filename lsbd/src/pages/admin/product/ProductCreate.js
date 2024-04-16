import React, {useState, useEffect} from 'react'
import AdminNav from '../../../components/nav/AdminNav';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import {createProduct}from "../../../functions/product"
import ProductCreateForm from "../../../components/forms/ProductCreateForm"
import {getCategories, getCategorySubs}from "../../../functions/category"

const initialState = {
        title: 'Macbook Pro',
        description: 'This is a laptop',
        price: '3999.99',
        categories: [],
        category: '',
        subs: [],
        shipping: 'Yes',
        quantity: '37',
        images: [],
        colors: ["Black", "Brown", "White", "Silver", "Blue"],
        brands: ["Apple", "Samsung", "Microsoft", "Lenovo", "Asus"],
        color: 'White',
        brand: 'Apple',
}

const ProductCreate = () => {
    const [values, setValues] = useState(initialState);
    const [subOptions, setSubOptions] = useState([]);

    const {user} = useSelector((state)=>({...state}))

    useEffect(() => {
        loadCategories();
    },[])

    const loadCategories = () => 
    getCategories().then((c) => setValues({...values, categories: c.data}));

    const handleSubmit = (e) => {
        e.preventDefault();
        createProduct(values, user.token)
        .then((res) =>{
            console.log(res);
            window.alert(`${res.data.title} is created`);
            window.location.reload();
        })
        .catch((err) =>{
            console.log(err);
            toast.error(err.response.data.err)
        })
    }

    const handleChange = (e) => {
        setValues({...values, [e.target.name]: e.target.value});
    }

    const handleCategoryChange = (e) => {
        e.preventDefault();
        console.log('CLICKED CATEGORY', e.target.value); 
        setValues({...values, category: e.target.value});
        getCategorySubs(e.target.value).then((res) =>{
            console.log('SUB OPTIONS ON CATEGORY CLICK', res)
            setSubOptions(res.data);
        })
    }
     
    return(
        <div className='container-fluid'>
            <div className='row'>
            <div className='col-md-2'>
            <AdminNav/>
            </div>
            </div>

            <div className='col-md-10'>
            <h4>Product Create</h4>
            <hr></hr>
 
            <ProductCreateForm 
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            values={values}
            handleCategoryChange={handleCategoryChange}
            />
            </div>
        </div>
    )
}

export default ProductCreate;