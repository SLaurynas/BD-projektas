import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import AdminNav from '../../../components/nav/AdminNav';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import {
    createCategory, 
    getCategories, 
    removeCategory
}from "../../../functions/category" 
import { 
    EditOutlined,
    DeleteOutlined 
} from '@ant-design/icons';
import CategoryForm from '../../../components/forms/CategoryForm';
import LocalSearch from '../../../components/forms/LocalSearch';

const CategoryCreate = () =>{
    const {user} = useSelector(state => ({...state}))
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    const [keyword, setKeyword] = useState("");

    useEffect(() => {
        loadCategories();
    },[])

    const loadCategories = () => 
    getCategories().then((c) => {
        setCategories(c.data)
    })

    const handleRemove = async (slug) =>{
        if(window.confirm(`Delete ${slug}`)){
            setLoading(true)
            removeCategory(slug, user.token)
            .then(res => {
                setLoading(false)
                loadCategories();
                toast.error(`${res.data.name} deleted`)
            })
            .catch(err =>{
                if (err.response.status === 400){
                    setLoading(false)
                    toast.error(err.response.data)
                }
            })
        }
    }

    const handleSubmit = (e) =>{
        e.preventDefault();
        setLoading(true);

        createCategory({name}, user.token)
        .then(res =>{
            setLoading(false);
            setName('');
            loadCategories();
            toast.success(`"${res.data.name}" is created`)
        })
        .catch(err =>{
            console.log(err);
            setLoading(false);
            if(err.response.status === 400)toast.error(err.response.data);
        })
    }

    const searched = (keyword) => (c) => c.name.toLowerCase().includes(keyword)

    return(
        <div className='container-fluid'>
            <div className='row'>
                <div className='col-md-2'>
                <AdminNav/>
                </div>
                {loading ? 
                <h4 className='text-danger'>Loading..</h4> : 
                <h4>Create Categoy</h4>}
                <CategoryForm
                 handleSubmit={handleSubmit}
                 name={name}
                 setName={setName}
                />

                <LocalSearch 
                keyword={keyword}
                setKeyword={setKeyword}
                />

                {categories.filter(searched(keyword)).map((c) => (
                <div 
                className='
                alert 
                alert-secondary 
                d-flex 
                justify-content-between 
                align-items-center
                '
                key={c._id}
                >
                {c.name}
                    <div>
                    <Link to={`/admin/category/${c.slug}`} className='btn btn-sm'>
                        <EditOutlined className="text-warning" />
                    </Link>
                    <span className='btn btn-sm' onClick={() => handleRemove(c.slug)}>
                        <DeleteOutlined className="text-danger" />
                    </span> 
                    </div>
                </div>
                ))}
            </div>
    </div>
    )
}

export default CategoryCreate;