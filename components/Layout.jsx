import React from "react";
// Import Outlet từ react-router-dom (bắt buộc)
import { Outlet } from "react-router-dom"; 
// Đã sửa đường dẫn, thêm đuôi file .jsx
import Header from "./Header.jsx"; 
import Footer from "./Footer.jsx"; 

/**
 * Component Layout chính của ứng dụng.
 * Bao gồm Header, Footer cố định và sử dụng <Outlet /> để render nội dung
 * của trang con được chọn bởi React Router.
 */
export default function MainLayout() {
    return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50">

    {/* Header sẽ luôn hiển thị trên mọi trang */}
        <Header />
    {/* Khu vực nội dung chính được cung cấp bởi route con */}
    <main className="flex-grow">
        {/* Outlet render nội dung của trang tương ứng với đường dẫn hiện tại */}
        <Outlet /> 
    </main>
{/* Footer sẽ luôn hiển thị */}
    <Footer />
    </div>
);
}