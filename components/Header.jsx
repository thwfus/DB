// Header.jsx
import React from "react";
import { Link } from "react-router-dom"; // Chỉ dùng nếu dùng React Router
import { ShoppingCart, Search } from "lucide-react"; // lucide-react

const Header = () => {
  return (
    <header className="shopee-primary sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-2">
        {/* Top Links */}
        <div className="flex justify-end items-center text-sm text-white mb-2 space-x-4">
          <Link to="/profile" className="hover:opacity-80 transition">Kênh Người Bán</Link>
          <a href="#" className="hover:opacity-80 transition">Kết Nối</a>
          <a href="#" className="hover:opacity-80 transition">Thông Báo</a>
          <a href="#" className="hover:opacity-80 transition">Hỗ Trợ</a>

          <Link to="/register" className="hover:opacity-80 transition font-bold">Đăng Ký</Link>
          <Link to="/login" className="hover:opacity-80 transition font-bold">Đăng Nhập</Link>
        </div>

        {/* Main Header */}
        <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
            <Link to="/home"
             className="text-4xl font-extrabold text-white tracking-wider cursor-pointer">
              AMAZIN
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-grow max-w-2xl">
            <div className="bg-white rounded-sm p-1 flex items-center shadow-md">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm, thương hiệu..."
                className="flex-1 px-3 py-1 text-sm text-gray-700 outline-none bg-transparent"
              />
              <button className="shopee-primary shopee-hover text-white rounded-sm px-4 py-1.5 transition">
                <Search className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-white mt-1 space-x-2 opacity-90">
              <span className="hover:underline cursor-pointer">Sandal</span>
              <span className="hover:underline cursor-pointer">Áo Khoác</span>
              <span className="hover:underline cursor-pointer">Tai Nghe</span>
              <span className="hover:underline cursor-pointer">Giày Thể Thao</span>
            </div>
          </div>

          {/* Cart */}
          <div className="flex-shrink-0">
            <Link
              to="/giohang"
              className="text-white relative p-1 shopee-hover rounded-full transition"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute top-[20px] left-[6px] inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-white text-shopee-primary rounded-full">
                3
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
