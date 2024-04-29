import React, { useEffect, lazy, Suspense } from 'react';
import './firebase';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from 'react-toastify';

import { getAuth } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { currentUser } from './functions/auth';
import { LoadingOutlined } from '@ant-design/icons';

const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Home = lazy(() => import("./pages/Home"));
const Header = lazy(() => import("./components/nav/Header"));
const SideDrawer = lazy(() => import("./components/drawer/SideDrawer"));

const RegisterVerification = lazy(() => import("./pages/auth/RegisterVerification"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const History = lazy(() => import("./pages/user/History"));
const UserRoute = lazy(() => import("./components/routes/UserRoute"));
const AdminRoute = lazy(() => import("./components/routes/AdminRoute"));
const Password = lazy(() => import("./pages/user/Password"));
const Wishlist = lazy(() => import("./pages/user/Wishlist"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const CategoryCreate = lazy(() =>
  import("./pages/admin/category/CategoryCreate")
);
const CategoryUpdate = lazy(() =>
  import("./pages/admin/category/CategoryUpdate")
);
const SubCreate = lazy(() => import("./pages/admin/sub/SubCreate"));
const SubUpdate = lazy(() => import("./pages/admin/sub/SubUpdate"));
const ProductCreate = lazy(() => import("./pages/admin/product/ProductCreate"));
const AllProducts = lazy(() => import("./pages/admin/product/AllProducts"));
const ProductUpdate = lazy(() => import("./pages/admin/product/ProductUpdate"));
const Product = lazy(() => import("./pages/Product"));
const CategoryHome = lazy(() => import("./pages/category/CategoryHome"));
const SubHome = lazy(() => import("./pages/sub/SubHome"));
const Shop = lazy(() => import("./pages/Shop"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const CreateCouponPage = lazy(() =>
  import("./pages/admin/coupon/CreateCouponPage")
);
const Payment = lazy(() => import("./pages/Payment"));

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
    <Suspense
    fallback ={
      <div className='col text-center p-5'>
        __ React Redux EC
        <LoadingOutlined/>
        MMERCE ___
      </div>
    }
    >
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
        <Route path="/checkout" element={
        <UserRoute>
          <Checkout />
        </UserRoute>
        }/>
        <Route path="/admin/coupon" element={
        <AdminRoute>
          <CreateCouponPage />
        </AdminRoute>
        }/>
        <Route path="/payment" element={
          <UserRoute>
            <Payment />
          </UserRoute>
        }/>
      </Routes>
    </Suspense>
  );
};

export default App;

