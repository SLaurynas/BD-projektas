import React, { useState } from "react";
import { Menu } from "antd";
import {
  AppstoreOutlined,
  SettingOutlined,
  UserOutlined,
  UserAddOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOut, getAuth } from "firebase/auth";
import Search from "../forms/Search";

const Header = () => {
  const [current, setCurrent] = useState("home");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => ({ ...state }));
  const auth = getAuth();

  const handleClick = (e) => {
    setCurrent(e.key);
  };

  const logout = () => {
    signOut(auth)
      .then(() => {
        dispatch({
          type: "LOGOUT",
          payload: null,
        });
        navigate("/login");
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  const menuItems = [
    {
      label: (<Link to="/">Home</Link>),
      key: "home",
      icon: <AppstoreOutlined />,
    },
    {
      label: (<a href="https://ant.design" target="_blank" rel="noopener noreferrer">Cart</a>),
      key: "cart",
      icon: <AppstoreOutlined />,
    },
    {
      label: (<span><Search/></span>),
      key: "search",
    },
    // Define other menu items based on if the user is logged in or not.
    ...(!user ? [
      {
        label: (<Link to="/register">Register</Link>),
        key: "register",
        icon: <UserAddOutlined />,
        style: { float: 'right' },
      },
      {
        label: (<Link to="/login">Login</Link>),
        key: "login",
        icon: <UserOutlined />,
        style: { float: 'right' },
      },
    ] : []),
    ...(user ? [
      {
        label: user.email && user.email.split("@")[0],
        key: "SubMenu",
        icon: <SettingOutlined />,
        children: [
          ...(user.role === 'user' ? 
          [{ label: <Link to="/user/history">History</Link>, key: "history" }] : 
          []),

          ...(user.role === 'admin' ? 
          [{ label: <Link to="/admin/dashboard">Dashboard</Link>, 
          key: "dashboard" }] : 
          []),
          
          { label: 'Logout', 
          key: 'logout', 
          icon: <LogoutOutlined />, 
          onClick: logout 
          },
        ],
      },
    ] : []),
  ];

  return (
    <Menu 
    className="float-left" 
    onClick={handleClick} 
    selectedKeys={[current]} 
    mode="horizontal" 
    items={menuItems}/>
  );
};

export default Header;

