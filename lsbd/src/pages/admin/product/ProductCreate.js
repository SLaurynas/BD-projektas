import React, {useState, useEffect} from 'react'
import AdminNav from '../../../components/nav/AdminNav';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import {createProduct}from "../../../functions/product"
import ProductCreateForm from "../../../components/forms/ProductCreateForm"
import {getCategories, getCategorySubs}from "../../../functions/category"
import FileUpload from '../../../components/forms/FileUpload';
import { LoadingOutlined } from '@ant-design/icons'

const initialState = {
        title: 'Auksinis moteriškas žiedas su natūraliu topazu ZUR0061',
        description: 'Mokesčiai įtraukti. Siuntimo išlaidos apskaičiuojamos atsiskaitant.',
        price: '320',
        categories: [],
        category: '',
        subs: [],
        shipping: 'Yes',
        weight: '3.7',
        images: [],
        stones: ["Agate", "Amethyst", "Emerald", "Diamond", "Sapphire", "Topaz"],
        materials: ["Gold", "Silver"],
        stone: 'Agate',
        material: 'Gold',
}

const ProductCreate = () => {
    const [values, setValues] = useState(initialState);
    const [subOptions, setSubOptions] = useState([]);
    const [showSub, setShowSub] = useState(false);
    const [loading, setLoading] = useState(false);

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
        setValues({...values, subs: [], category: e.target.value});
        getCategorySubs(e.target.value).then((res) =>{
            console.log('SUB OPTIONS ON CATEGORY CLICK', res)
            setSubOptions(res.data);
        })
        setShowSub(true);
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
            <h4>Product Create</h4>}
            <hr></hr>

            <div className="p-3">
                <FileUpload 
                values={values} 
                setValues={setValues} 
                setLoading={setLoading}
                />
            </div>
 
            <ProductCreateForm 
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            setValues={setValues}
            values={values}
            handleCategoryChange={handleCategoryChange}
            subOptions={subOptions}
            showSub={showSub}
            />
            </div>
            </div>
        </div>
    )
}

export default ProductCreate;