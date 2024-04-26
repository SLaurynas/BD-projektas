import React, { useState, useEffect } from "react";
import {
  getProductsByCount,
  fetchProductsByFilter,
} from "../functions/product";
import { getCategories } from "../functions/category";
import { getSubs } from "../functions/sub";
import { useSelector, useDispatch } from "react-redux";
import ProductCard from "../components/cards/ProductCard";
import {Menu, Slider, Checkbox, Radio} from 'antd'
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
  const [star, setStar] = useState('');
  const [subs, setSubs] = useState([]);
  const [sub, setSub] = useState('');
  const [stones, setStones] = useState([
    "Agate",
    "Amethyst",
    "Emerald",
    "Diamond",
    "Topaz",
  ]);
  const [stone, setStone] = useState("");
  const [materials, setMaterials] = useState([
    "Gold",
    "Silver",
  ]);
  const [material, setMaterial] = useState("");
  const [shipping, setShipping] = useState("");

  let dispatch = useDispatch();
  let { search } = useSelector((state) => ({ ...state }));
  const { text } = search;

  useEffect(() => {
    loadAllProducts();
    getCategories().then((res) => setCategories(res.data))
    getSubs().then((res) => setSubs(res.data))
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
      if(!text){
        loadAllProducts();
      }
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
         // reset
        setCategoryIds([]);
        setPrice(value);
        setStar("");
        setSub("");
        setStone("");
        setMaterial("");
        setShipping("");
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
        setStar("");
        setSub("");
        setStar("");
        setSub("");
        setStone("");
        setMaterial("");
        setShipping("");

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

    const handleStarClick = (num) => {
        dispatch({
            type:"SEARCH_QUERY",
            payload: {text: ""},
        })
        setPrice([0, 0]);
        setCategoryIds([]);
        setStar(num);
        setSub("");
        setStone("");
        setMaterial("");
        setShipping("");
        fetchProducts({ stars: num});
    }

    const showStars = () => (
        <div className="pr-4 pl-4 pb-2">
            <Star starClick={handleStarClick} numberOfStars={5}/>
            <Star starClick={handleStarClick} numberOfStars={4}/>
            <Star starClick={handleStarClick} numberOfStars={3}/>
            <Star starClick={handleStarClick} numberOfStars={2}/>
            <Star starClick={handleStarClick} numberOfStars={1}/>
        </div>
    );
    
    const showSubs = () => 
    subs.map((s) => 
    <div 
    key={s._id}
    onClick={() => handleSub(s)} 
    className="p-1 m-1 badge badge-secondary bg-danger"
    style={{cursor: 'pointer'}}
    >
        {s.name}
    </div>)

    const handleSub = (sub) => {
        //console.log("sub ", sub)
        setSub(sub)
        dispatch({
            type:"SEARCH_QUERY",
            payload: {text: ""},
        })
        setPrice([0, 0]);
        setCategoryIds([])
        setStar("")
        setStone("");
        setMaterial("");
        setShipping("");
        fetchProducts({ sub })
    }

    const showMaterials = () =>
    materials.map((m) => (
      <Radio
        value={m}
        name={m}
        checked={m === material}
        onChange={handleMaterial}
        className="pb-1 pl-4 pr-4"
      >
        {m}
      </Radio>
    ));

    const handleMaterial = (m) => {
      setSub("");
      dispatch({
        type: "SEARCH_QUERY",
        payload: { text: "" },
      });
      setPrice([0, 0]);
      setCategoryIds([]);
      setStar("");
      setMaterial("");
      setStone(m.target.value);
      setShipping("");
      fetchProducts({ material: m.target.value });
    };

    const showStones = () =>
    stones.map((s) => (
      <Radio
        value={s}
        name={s}
        checked={s === stone}
        onChange={handleStone}
        className="pb-1 pl-4 pr-4"
      >
        {s}
      </Radio>
    ));

    const handleStone = (s) => {
      setSub("");
      dispatch({
        type: "SEARCH_QUERY",
        payload: { text: "" },
      });
      setPrice([0, 0]);
      setCategoryIds([]);
      setStar("");
      setMaterial("");
      setStone(s.target.value);
      setShipping("");
      fetchProducts({ stone: s.target.value });
    };

    const showShipping = () => (
      <>
        <Checkbox
          className="pb-2 pl-4 pr-4"
          onChange={handleShippingchange}
          value="Yes"
          checked={shipping === "Yes"}
        >
          Yes
        </Checkbox>
  
        <Checkbox
          className="pb-2 pl-4 pr-4"
          onChange={handleShippingchange}
          value="No"
          checked={shipping === "No"}
        >
          No
        </Checkbox>
      </>
    );

    const handleShippingchange = (e) => {
      setSub("");
      dispatch({
        type: "SEARCH_QUERY",
        payload: { text: "" },
      });
      setPrice([0, 0]);
      setCategoryIds([]);
      setStar("");
      setMaterial("");
      setStone("");
      setShipping(e.target.value);
      fetchProducts({ shipping: e.target.value });
    };
  
  

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 pt-2">
            <h4>Search/Filter</h4>
            <Menu defaultOpenKeys={['1', '2', '3', '4','5','6','7']} mode="inline">
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
                <SubMenu key='4' title={<span className="h6"><StarOutlined/> Sub-Categories</span>}>
                    <div>
                        <div>
                            {showSubs()}
                        </div>
                    </div>
                </SubMenu>
            <SubMenu
              key="5"
              title={
                <span className="h6">
                  <DownSquareOutlined /> Materials
                </span>
              }
            >
              <div className="pr-5">
                {showMaterials()}
              </div>
            </SubMenu>
            <SubMenu
              key="6"
              title={
                <span className="h6">
                  <DownSquareOutlined /> Stones
                </span>
              }
            >
              <div className="pr-5">
                {showStones()}
              </div>
            </SubMenu>
            <SubMenu
              key="7"
              title={
                <span className="h6">
                  <DownSquareOutlined /> Shipping
                </span>
              }
            >
              <div style={{ maringTop: "-10px" }} className="pr-5">
                {showShipping()}
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
