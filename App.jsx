import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// --- Layout & Goods ---
import MainLayout from './components/Layout';
import Items from './src/Goods/Items'; 

// --- Pages Imports ---
import Home from './src/pages/Home'; // Trang chủ
import Login from './src/pages/Login'; // Login.jsx
import Register from './src/pages/Register'; // Register.jsx
import ShopCart from './src/pages/ShopCart'; // Giỏ hàng
import Profile from './src/pages/Profile'; // Hồ sơ người dùng
import ChatPage from './src/pages/Chat'; // Chat
import CheckoutPage from './src/pages/Payment'; // Thanh toán (Component từ Payment.jsx)
import OrderDetailPage from './src/pages/Information'; // Chi tiết đơn hàng (Component từ Information.jsx)
import VoucherPage from './src/pages/Voucher'; // Voucher page


const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />, // Layout cha chứa Header và Footer
        children: [
            {
                index: true, 
                element: <Login />, // Trang mặc định là Login
            },
            {
                path: 'home',
                element: <Home />, // Trang chủ (/home)
            },
            
            // --- CÁC ROUTE CHỨC NĂNG ---
            {
                path: 'login',
                element: <Login />,
            },
            {
                path: 'register',
                element: <Register />,
            },
            {
                path: 'giohang', 
                element: <ShopCart />, // Giỏ hàng
            },
            {
                path: 'payment', 
                element: <CheckoutPage />, // Thanh toán
            },
            {
                path: 'vouchers',
                element: <VoucherPage />, // Danh sách voucher (/vouchers)
            },
            
            // --- ROUTE HỒ SƠ VÀ THÔNG TIN ---
            {
                path: 'profile', 
                element: <Profile />, // Hồ sơ người dùng (chứa Orders, Address...)
            },
            {
                path: 'chat', 
                element: <ChatPage />, // Chat với Shop
            },
            {
                path: 'information', 
                element: <OrderDetailPage />, // Chi tiết đơn hàng
            },
            
            // --- ROUTE CHI TIẾT SẢN PHẨM ---
            {
                path: 'product/:itemId', // Đường dẫn chứa tham số itemId
                element: <Items />, // Component chi tiết sản phẩm
            },
        ],
    },
]);

function App() {
    return (
        <RouterProvider router={router} />
    );
}

export default App;
