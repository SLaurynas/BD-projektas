import React, { useState, useEffect } from "react";
import {
  getProductsByCount,
  fetchProductsByFilter,
} from "../functions/product";
import { getCategories } from "../functions/category";
import { useSelector, useDispatch } from "react-redux";
import ProductCard from "../components/cards/ProductCard";
import {Menu, Slider, Checkbox} from 'antd'
import { EuroOutlined, DownSquareOutlined, StarOutlined } from "@ant-design/icons";
import Star from "../components/forms/Star";

const {SubMenu, ItemGroup} = Menu;

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState([0, 0]);
  const [ok, setOk] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryIds, setCategoryIds] = useState([]);
  const [star, setStar] = useState('')

  let dispatch = useDispatch();
  let { search } = useSelector((state) => ({ ...state }));
  const { text } = search;

  useEffect(() => {
    loadAllProducts();
    getCategories().then((res) => setCategories(res.data))
  }, []);

  // 1. load products by default on page load
  const loadAllProducts = () => {
    getProductsByCount(12).then((p) => {
      setProducts(p.data);
      setLoading(false);
    });
  };

  // 2. load products on user search input
  useEffect(() => {
    const delayed = setTimeout(() => {
      fetchProducts({ query: text });
    }, 300);
    return () => clearTimeout(delayed);
  }, [text]);

  const fetchProducts = (arg) => {
    fetchProductsByFilter(arg).then((res) => {
      setProducts(res.data);
    });
  };

    useEffect(()=>{
        console.log("ok to req")
        fetchProducts({price})
    },[ok])

    const handleSlider = (value) => {
        dispatch({
            type: "SEARCH_QUERY",
            payload: {text: ""},
        })
        setCategoryIds([]);
        setPrice(value)
        setTimeout(() => {
            setOk(!ok)
        },300)
    }

    const showCategories = () => categories.map((c) => <div key={c._id}>
        <Checkbox 
        onChange={handleCheck}
        className="pb-2 pl-4 pr-4" 
        value={c._id}
        name="category"
        checked={categoryIds.includes(c._id)}
        >
            {c.name}
        </Checkbox>
        <br/>
    </div>)

    const handleCheck = (e) => {
        dispatch({
            type:"SEARCH_QUERY",
            payload: {text: ""},
        })
        setPrice([0, 0]);
        //console.log(e.target.value)
        let inTheState = [...categoryIds];
        let justChecked = e.target.value;
        let foundInTheState = inTheState.indexOf(justChecked)

        if(foundInTheState === -1){
            inTheState.push(justChecked);
        } else {
            inTheState.splice(foundInTheState, 1)
        }
        setCategoryIds(inTheState);
        //console.log(inTheState);
        fetchProducts({category: inTheState})
    }

    const handleStarClick = num => {
        console.log(num)
    }

    const showStars = () => {
        <div className="pr-4 pl-4 pb-2">
            <Star 
            starClick={handleStarClick}
            numberOfStars={5}
            />
        </div>
    }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 pt-2">
            <h4>Search/Filter</h4>
            <Menu defaultOpenKeys={['1', '2']} mode="inline">
                <SubMenu key='1' title={<span className="h6"><EuroOutlined/> Price</span>}>
                    <div>
                        <Slider
                            className="ml-4 mr-4"
                            range
                            tooltip={(v) => (v)}
                            value={price}
                            onChange={handleSlider}
                            max={4999}
                        />
                    </div>
                </SubMenu>
                <SubMenu key='2' title={<span className="h6"><DownSquareOutlined/> Categories</span>}>
                    <div>
                        <div>
                            {showCategories()}
                        </div>
                    </div>
                </SubMenu>
                <SubMenu key='3' title={<span className="h6"><StarOutlined/> Rating</span>}>
                    <div>
                        <div>
                            {showStars()}
                        </div>
                    </div>
                </SubMenu>
            </Menu>
        </div>

        <div className="col-md-9 pt-2">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4 className="text-danger">Products</h4>
          )}

          {products.length < 1 && <p>No products found</p>}

          <div className="row pb-5">
            {products.map((p) => (
              <div key={p._id} className="col-md-4 mt-3">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
