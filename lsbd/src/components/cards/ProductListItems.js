import React from 'react'
import { Link } from 'react-router-dom'

const ProductListItems = ({product}) => {
    const {price, category, subs, shipping, stone, material, quantity, sold} = product;
    return(
        <ul className='list-group'>
            <li className='list-group-item'>
                Price{" "}
                Price <span className='label label-default label-pill pull-xs-right'>
                    ${price}
                    </span>
            </li>

            {category &&<li className='list-group-item'>
                Category{" "}
                <Link to={`/category/${category.slug}`}
                 className='label label-default label-pill pull-xs-right'>
                    {category.name}
                </Link>
            </li>}

            {subs &&<li className='list-group-item'>
                Sub-Categories{" "}
                {subs.map((s) => (
                <Link 
                key={s._id}
                to={`/sub/${s.slug}`}
                className='label label-default label-pill pull-xs-right'>
                    {s.name}
                </Link>))}
            </li>}

            <li className='list-group-item'>
                Shipping{" "}
                <span className='label label-default label-pill pull-xs-right'>
                    {shipping}
                </span>
            </li>

            <li className='list-group-item'>
                Stone{" "}
                <span className='label label-default label-pill pull-xs-right'>
                    {stone}
                </span>
            </li>

            <li className='list-group-item'>
                Material{" "}
                <span className='label label-default label-pill pull-xs-right'>
                    {material}
                </span>
            </li>

            <li className='list-group-item'>
                Availible{" "}
                <span className='label label-default label-pill pull-xs-right'>
                    {quantity}
                </span>
            </li>

            <li className='list-group-item'>
                Sold{" "}
                <span className='label label-default label-pill pull-xs-right'>
                    {sold}
                </span>
            </li>
        </ul>
    )
}

export default ProductListItems