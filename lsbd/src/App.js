import React, { useEffect } from 'react';
import './firebase';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from 'react-toastify';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/Home';
import SideDrawer from './components/drawer/SideDrawer';
import Header from './components/nav/Header';
import RegisterVerification from './pages/auth/RegisterVerification';
import ForgotPassword from './pages/auth/ForgotPassword';
import History from './pages/user/History';
import Password from './pages/user/Password';
import Wishlist from './pages/user/Wishlist';
import UserRoute from './components/routes/UserRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRoute from './components/routes/AdminRoute';
import CategoryCreate from './pages/admin/category/CategoryCreate';
import CategoryUpdate from './pages/admin/category/CategoryUpdate';
import SubCreate from './pages/admin/sub/SubCreate';
import SubUpdate from './pages/admin/sub/SubUpdate';
import ProductCreate from './pages/admin/product/ProductCreate';
import AllProducts from './pages/admin/product/AllProducts';
import ProductUpdate from './pages/admin/product/ProductUpdate';
import Product from './pages/Product';
import CategoryHome from './pages/category/CategoryHome';
import SubHome from './pages/sub/SubHome';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

import { getAuth } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { currentUser } from "./functions/auth";

const App = () => {
  let dispatch = useDispatch();
  const auth = getAuth();

  // to check firebase auth state
  useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged(async (user) => {
    if (user) {
      try {
        const idTokenResult = await user.getIdTokenResult();
        console.log("user", user);

        // Assuming currentUser is a function that returns a promise
        if (typeof currentUser === "function") {
          const res = await currentUser(idTokenResult.token);
          dispatch({
            type: "LOGGED_IN_USER",
            payload: {
              name: res.data.name,
              email: res.data.email,
              token: idTokenResult.token,
              role: res.data.role,
              _id: res.data._id,
            },
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Optionally, handle the error in a more user-friendly way
        toast.error("An error occurred while fetching user data.");
      }
    }
  });

  // Cleanup function to unsubscribe from the auth listener on component unmount
  return () => unsubscribe();
}, [dispatch]);

  return (
    <>
      <Header />
      <SideDrawer/>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/verification" element={<RegisterVerification />} />
        <Route path="/forgot/password" element={<ForgotPassword />} />
        <Route path="/user/history" element={
        <UserRoute>
          <History />
        </UserRoute>
        }/>
        <Route path="/user/password" element={
        <UserRoute>
          <Password />
        </UserRoute>
        }/>
        <Route path="/user/wishlist" element={
        <UserRoute>
          <Wishlist />
        </UserRoute>
        }/>
        <Route path="/admin/dashboard" element={
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
        }/>
        <Route path="/admin/category" element={
        <AdminRoute>
          <CategoryCreate />
        </AdminRoute>
        }/>
        <Route path="/admin/category/:slug" element={
        <AdminRoute>
          <CategoryUpdate />
        </AdminRoute>
        }/>
        <Route path="/admin/sub" element={
        <AdminRoute>
          <SubCreate />
        </AdminRoute>
        }/>
        <Route path="/admin/sub/:slug" element={
        <AdminRoute>
          <SubUpdate />
        </AdminRoute>
        }/>
        <Route path="/admin/product" element={
        <AdminRoute>
          <ProductCreate />
        </AdminRoute>
        }/>
        <Route path="/admin/products" element={
        <AdminRoute>
          <AllProducts />
        </AdminRoute>
        }/>
        <Route path="/admin/product/:slug" element={
        <AdminRoute>
          <ProductUpdate />
        </AdminRoute>
        }/>
        <Route path="/product/:slug" element={<Product />} />
        <Route path="/category/:slug" element={<CategoryHome />} />
        <Route path="/sub/:slug" element={<SubHome />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </>
  );
};

export default App;

