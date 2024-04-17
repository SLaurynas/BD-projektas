import React from 'react'
import {Select} from 'antd'

const {Option} = Select;

const ProductUpdateForm = ({
    handleSubmit, 
    handleChange,
    setValues,
    values, 
    handleCategoryChange,
    categories,
    subOptions,
    arrayOfSubIds,
    setArrayOfSubIds,
    selectedCategory,
}) => {

        //destructure
        const {
            title, 
            description, 
            price,  
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
                    value={shipping === 'Yes' ? 'Yes' : 'No'}
                    name="shipping"
                    className="form-control"
                    onChange={handleChange}
                    >
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
                    value={stone}
                    name="stone"
                    className="form-control"
                    onChange={handleChange}
                    >
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
                    value={material}
                    name="material"
                    className="form-control"
                    onChange={handleChange}
                    >
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
                    value={selectedCategory ? selectedCategory : category._id}
                    >
                        {categories.length > 0 && 
                            categories.map((c)=>(
                            <option key={c._id} value={c._id}>
                              {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                <label>Sub-categories</label>
                <Select
                    mode="multiple"
                    style={{width: '100%'}}
                    placeholder="Please select"
                    value={arrayOfSubIds}
                    onChange={(value) => setArrayOfSubIds(value)}
                >
                    {subOptions.length && subOptions.map((s) => (
                        <Option key={s._id} value={s._id}>
                            {s.name}
                        </Option>
                    ))}
                </Select>
                </div>

                <br/>
                <button className="btn btn-outline-info">
                    Save
                </button>
            </form>
);
};
export default ProductUpdateForm;