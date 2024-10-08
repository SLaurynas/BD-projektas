import React, {useState} from 'react'
import {Card, Tabs, Tooltip} from 'antd'
import {useNavigate} from 'react-router-dom'
import { HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import {Carousel} from 'react-responsive-carousel'
import defimg from '../../images/verte.png'
import ProductListItems from './ProductListItems'
import StarRating from 'react-star-ratings'
import RatingModal from '../modal/RatingModal'
import { addToWishlist } from "../../functions/user";
import { showAverage } from '../../functions/rating'
import { toast } from 'react-toastify'

import _ from 'lodash'
import { useSelector, useDispatch } from 'react-redux'

const {TabPane} = Tabs;

const SingleProduct = ({product, onStarClick, star}) => {
    const [tooltip, setTooltip] = useState('Click to Add')
    const navigate = useNavigate()

    const {user, cart} = useSelector((state) => ({...state}));
    const dispatch = useDispatch()

    const handleAddToCart = () =>{
        
        let cart = [];
        if(typeof window !== 'undefined'){
            if(localStorage.getItem('cart')){
                cart = JSON.parse(localStorage.getItem('cart'))
            }
            cart.push({
                ...product,
                count: 1,
            })
            let unique = _.uniqWith(cart, _.isEqual)
            localStorage.setItem('cart', JSON.stringify(unique))
            setTooltip('Added')

            dispatch({
                type: "ADD_TO_CART",
                payload: unique,
            })

            dispatch({
                type: "SET_VISIBLE",
                payload: true,
            })
        }
    }

    const handleAddToWishlist = (e) => {
        e.preventDefault();
        addToWishlist(product._id, user.token).then((res) => {
          console.log("ADDED TO WISHLIST", res.data);
          toast.success("Added to wishlist");
          navigate("/user/wishlist");
        });
      };

    const {title, images, description, _id} = product;
    return (
        <>
          <div className="col-md-7">
            {images && images.length ? (
              <Carousel showArrows={true} autoPlay infiniteLoop>
                {images && images.map((i) => <img src={i.url} key={i.public_id} />)}
              </Carousel>
            ) : (
              <Card cover={<img src={defimg} className="mb-3 card-image" />}></Card>
            )}
    
            <Tabs type="card">
              <TabPane tab="Description" key="1">
                {description && description}
              </TabPane>
              <TabPane tab="More" key="2">
                Call use on xxxx xxx xxx to learn more about this product.
              </TabPane>
            </Tabs>
          </div>
    
          <div className="col-md-5">
            <h1 className="bg-info p-3">{title}</h1>
    
            {product && product.ratings && product.ratings.length > 0 ? (
              showAverage(product)
            ) : (
              <div className="text-center pt-1 pb-3">No rating yet</div>
            )}
    
            <Card
              actions={[
                <Tooltip placement="top" title={tooltip}>
                  <a onClick={handleAddToCart} disabled={product.quantity < 1}>
                    <ShoppingCartOutlined className="text-danger" />
                    <br />
                    {product.quantity < 1 ? "Out of Stock" : "Add To Cart"}
                  </a>
                </Tooltip>,
                <a onClick={handleAddToWishlist}>
                  <HeartOutlined className="text-info" /> <br /> Add to Wishlist
                </a>,
                <RatingModal>
                  <StarRating
                    name={_id}
                    numberOfStars={5}
                    rating={star}
                    changeRating={onStarClick}
                    isSelectable={true}
                    starRatedColor="red"
                  />
                </RatingModal>,
              ]}
            >
              <ProductListItems product={product} />
            </Card>
          </div>
        </>
      );
    };

    export default SingleProduct;