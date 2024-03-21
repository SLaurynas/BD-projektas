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

  return (
    <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
      <Menu.Item key="home" icon={<AppstoreOutlined />}>
        <Link to="/">Home</Link>
      </Menu.Item>

      {!user && (
        <Menu.Item key="register" icon={<UserAddOutlined />} style={{ float: 'right' }}>
          <Link to="/register">Register</Link>
        </Menu.Item>
      )}

      {!user && (
        <Menu.Item key="login" icon={<UserOutlined />} style={{ float: 'right' }}>
          <Link to="/login">Login</Link>
        </Menu.Item>
      )}

      {user && (
        <Menu.SubMenu
          key="SubMenu"
          icon={<SettingOutlined />}
          title={user.email && user.email.split("@")[0]}
          style={{ float: 'right' }}
        >
          {
          (user) && 
          (user.role === 'user') && 
          (<Menu.Item key="setting:1"><Link to="/user/history"></Link>History</Menu.Item>)
          }
          {
          (user) && 
          (user.role === 'admin') && 
          (<Menu.Item key="setting:1"><Link to="/admin/dashboard"></Link>Dashboard</Menu.Item>)
          }
          <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout}>
            Logout
          </Menu.Item>
        </Menu.SubMenu>
      )}

      <Menu.Item key="cart" icon={<AppstoreOutlined />} style={{ float: 'right' }}>
        <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
          Cart
        </a>
      </Menu.Item>
    </Menu>
  );
};

export default Header;

