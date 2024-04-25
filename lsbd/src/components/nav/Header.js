import React, { useState } from 'react';
import {Badge} from 'antd'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signOut, getAuth } from 'firebase/auth';
import { Navbar, Nav, NavDropdown, Container, InputGroup, FormControl, Button } from 'react-bootstrap';
import { ShoppingOutlined, AppstoreOutlined, UserOutlined, UserAddOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import Search from '../forms/Search'; // Make sure this path is correct

const Header = () => {
  const [current, setCurrent] = useState("home");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, cart } = useSelector((state) => ({ ...state }));
  const auth = getAuth();

  const logout = () => {
    signOut(auth).then(() => {
      dispatch({
        type: "LOGOUT",
        payload: null,
      });
      navigate("/login");
    }).catch((err) => {
      console.error("Logout Error", err);
    });
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <Navbar.Brand as={Link} to="/"> <AppstoreOutlined/> Home</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="">
            <Nav.Link as={Link} to="/shop"><ShoppingOutlined/> Shop</Nav.Link>
          </Nav>
          <Nav className="">
            <Nav.Link as={Link} to="/cart"><ShoppingCartOutlined/>
              <Badge count={cart.length} offset={[9, 0]}>
                Cart 
              </Badge>
            </Nav.Link>
          </Nav>
          <Nav className="ms-auto">
          <Search />
            {!user && (
              <>
                <Nav.Link as={Link} to="/register"><UserAddOutlined /> Register</Nav.Link>
                <Nav.Link as={Link} to="/login"><UserOutlined /> Login</Nav.Link>
              </>
            )}
            {user && (
              <NavDropdown title={user.email && user.email.split("@")[0]} id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/user/history">History</NavDropdown.Item>
                {user.role === 'admin' && (
                  <NavDropdown.Item as={Link} to="/admin/dashboard">Dashboard</NavDropdown.Item>
                )}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;

