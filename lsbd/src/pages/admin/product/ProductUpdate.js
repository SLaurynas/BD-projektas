import React, {useState, useEffect} from 'react'
import AdminNav from '../../../components/nav/AdminNav';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import {getProduct, updateProduct}from "../../../functions/product"
import {getCategories, getCategorySubs}from "../../../functions/category"
import FileUpload from '../../../components/forms/FileUpload';
import { LoadingOutlined } from '@ant-design/icons'
import ProductUpdateForm from '../../../components/forms/ProductUpdateForm';

const initialState = {
        title: '',
        description: '',
        price: '',
        category: '',
        subs: [],
        shipping: '',
        weight: '',
        images: [],
        stones: ["Agate", "Amethyst", "Emerald", "Diamond", "Sapphire", "Topaz"],
        materials: ["Gold", "Silver"],
        stone: '',
        material: '',
}

const ProductUpdate = () => {
    const [values, setValues] = useState(initialState);
    const [subOptions, setSubOptions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [arrayOfSubIds, setArrayOfSubIds] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    //redux
    const {user} = useSelector((state)=>({...state}))
    //router
    let {slug} = useParams();

    useEffect(() => {
        loadProduct();
        loadCategories();
    },[])

    const loadProduct = () => {
        getProduct(slug).then((p) => {
            //console.log('single product' , p);
            setValues({...values, ...p.data});
            getCategorySubs(p.data.category._id).then((res) => {
                setSubOptions(res.data); //show default subs on first load
            });
            let arr = [];
            p.data.subs.map((s) => {
                arr.push(s._id);
            });
            setArrayOfSubIds((prev) => arr);
        });
    };

    const loadCategories = () => 
    getCategories().then((c) => {
        setCategories(c.data);
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        values.subs = arrayOfSubIds; 
        values.category = selectedCategory ? selectedCategory : values.category;

        updateProduct(slug, values, user.token)
        .then((res) =>{
            setLoading(false);
            toast.success(`${res.data.title} is updated`);
            navigate('/admin/products');
        })
        .catch((err) =>{
            setLoading(false);
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
        setValues({...values, subs: []});

        setSelectedCategory(e.target.value);

        getCategorySubs(e.target.value).then((res) =>{
            console.log('SUB OPTIONS ON CATEGORY CLICK', res)
            setSubOptions(res.data);
        })
        //remember original category and load if clicked
        if(values.category._id === e.target.value){
            loadProduct();
        }
        setArrayOfSubIds([]);
    }

    return(
        <div className='container-fluid'>
            <div className='row'>
            <div className='col-md-2'>
            <AdminNav/>
            </div>

            <div className='col-md-10'>
            {loading ? 
            <LoadingOutlined className='text-danger h1'/> : 
            <h4>Product Update</h4>}

            <div className="p-3">
                <FileUpload 
                values={values} 
                setValues={setValues} 
                setLoading={setLoading}
                />
            </div>

            <ProductUpdateForm
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            setValues={setValues}
            values={values}
            handleCategoryChange={handleCategoryChange}
            categories={categories}
            subOptions={subOptions}
            arrayOfSubIds={arrayOfSubIds}
            setArrayOfSubIds={setArrayOfSubIds}
            selectedCategory={selectedCategory}
            />
 
            </div>
            </div>
        </div>
    )
}

export default ProductUpdate;