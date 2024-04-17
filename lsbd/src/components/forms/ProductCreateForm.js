import React from 'react'
import {Select} from 'antd'

const {Option} = Select;

const ProductCreateForm = ({
    handleSubmit, 
    handleChange,
    setValues,
    values, 
    handleCategoryChange,
    subOptions,
    showSub,
}) => {

        //destructure
        const {
            title, 
            description, 
            price,  
            categories, 
            category, 
            subs, 
            shipping, 
            weight,  
            images, 
            stones,
            materials, 
            stone, 
            material
        } = values;
    
    return(
    <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label>Title</label>
                    <input 
                    type="text" 
                    name="title" 
                    className='form-control' 
                    value={title} 
                    onChange={handleChange}
                    />
                </div>

                <div className='form-group'>
                    <label>Description</label>
                    <input 
                    type="text" 
                    name="description" 
                    className='form-control' 
                    value={description} 
                    onChange={handleChange}
                    />
                </div>

                <div className='form-group'>
                    <label>Price</label>
                    <input 
                    type="number" 
                    name="price" 
                    className='form-control' 
                    value={price} 
                    onChange={handleChange}
                    />
                </div>

                <div className='form-group'>
                    <label>Shipping</label>
                    <select 
                    name="shipping"
                    className="form-control"
                    onChange={handleChange}
                    >
                        <option>Select Shipping</option>
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                    </select>
                </div>

                <div className='form-group'>
                    <label>Weight</label>
                    <input 
                    type="number" 
                    name="weight" 
                    className='form-control' 
                    value={weight} 
                    onChange={handleChange}
                    />
                </div>

                <div className='form-group'>
                    <label>Stone</label>
                    <select 
                    name="stone"
                    className="form-control"
                    onChange={handleChange}
                    >
                        <option>Select Stone</option>
                        {stones.map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                        ))}
                    </select>
                </div>

                <div className='form-group'>
                    <label>Material</label>
                    <select 
                    name="material"
                    className="form-control"
                    onChange={handleChange}
                    >
                        <option>Select Material</option>
                        {materials.map((m) => (
                        <option key={m} value={m}>
                            {m}
                        </option>
                        ))}
                    </select>
                </div>

                <div className='form-group'>
                    <label>Category</label>
                    <select 
                    name='category'
                    className='form-control' 
                    onChange={handleCategoryChange}
                    >
                        <option>Please select</option>
                        {categories.length > 0 && 
                            categories.map((c)=>(
                            <option key={c._id} value={c._id}>
                              {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                {showSub && <div>
                <label>Sub-categories</label>
                <Select
                    mode="multiple"
                    style={{width: '100%'}}
                    placeholder="Please select"
                    value={subs}
                    onChange={value => setValues({...values, subs: value})}
                >
                    {subOptions.length && subOptions.map((s) => (
                        <Option key={s._id} value={s._id}>
                            {s.name}
                        </Option>
                    ))}
                </Select>
                </div>}
                <br/>
                <button className="btn btn-outline-info">
                    Save
                </button>
            </form>
);
};
export default ProductCreateForm;