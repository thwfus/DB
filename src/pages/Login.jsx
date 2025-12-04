import React, { useState } from 'react';
// Bổ sung Link
import { Link } from 'react-router-dom'; 
import { Eye, EyeOff, Facebook } from 'lucide-react'; 

// Cảnh báo: Sử dụng alert() bị cấm. Thay thế bằng modal/message box
const CustomAlert = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
            <div className="bg-white p-6 rounded-lg shadow-2xl max-w-sm w-full relative">
                <h3 className="text-xl font-semibold text-shopee-primary mb-4">Thông báo</h3>
                <p className="text-gray-700">{message}</p>
                <button 
                    onClick={onClose} 
                    className="shopee-primary mt-4 w-full text-white font-semibold py-2 rounded-sm hover:shopee-hover transition"
                >
                    Đóng
                </button>
            </div>
        </div>
    );
};

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [alertMessage, setAlertMessage] = useState(''); // State cho thông báo
    
    // Xử lý ẩn/hiện mật khẩu
    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    // Xử lý gửi form
    const handleSubmit = (event) => {
        event.preventDefault();
        // Giả lập logic đăng nhập thành công
        setAlertMessage(`Đăng nhập thành công với tài khoản: ${username}`);
    };
    
    // Component Login này chỉ cần trả về nội dung chính (main content)
    // vì Layout.jsx đã bọc nó trong Header, Footer và thẻ <main>
    return (
        <>
            <CustomAlert message={alertMessage} onClose={() => setAlertMessage('')} />
            
            {/* VÌ COMPONENT NÀY LÀ CON CỦA LAYOUT, CHỈ CẦN CODE PHẦN NỘI DUNG FORM */}
            <div className="flex items-center justify-center py-10 login-bg-gradient min-h-[calc(100vh-100px)]">
                <div className="container mx-auto max-w-4xl flex bg-white rounded-lg shadow-2xl overflow-hidden">
                    
                    {/* Banner Trái (Chỉ hiển thị trên Desktop) */}
                    <div className="hidden lg:block w-1/2 p-12 flex-shrink-0 relative bg-shopee-primary text-white">
                        <h2 className="text-3xl font-bold z-10 relative">
                            Nền tảng thương mại điện tử yêu thích ở Đông Nam Á & Đài Loan
                        </h2>
                        <img src="https://placehold.co/400x400/EE4D2D/FFFFFF?text=Login+Banner" 
                            alt="Shopee Banner" 
                            className="absolute inset-0 w-full h-full object-cover opacity-20" 
                        />
                    </div>

                    {/* Form Đăng Nhập Phải */}
                    <div className="w-full lg:w-1/2 p-8 md:p-12">
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Đăng Nhập</h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            
                            {/* Trường Tên đăng nhập/Email/Số điện thoại */}
                            <div>
                                <input
                                    type="text"
                                    placeholder="Email / Số điện thoại / Tên đăng nhập"
                                    id="username"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-shopee-primary text-sm transition"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            
                            {/* Trường Mật khẩu */}
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Mật khẩu"
                                    id="password"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-shopee-primary text-sm pr-10 transition"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <span 
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-shopee-primary" 
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </span>
                            </div>

                            {/* Nút Đăng nhập */}
                            <button
                                type="submit"
                                className="shopee-primary w-full text-white font-semibold py-3 rounded-sm hover:opacity-90 transition shadow-md"
                            >
                                ĐĂNG NHẬP
                            </button>
                        </form>

                        {/* Quên mật khẩu & Đăng nhập bằng SMS */}
                        <div className="flex justify-between text-sm mt-4">
                            <a href="#" className="text-blue-500 hover:text-shopee-primary transition">Quên mật khẩu</a>
                            <a href="#" className="text-gray-500 hover:text-shopee-primary transition">Đăng nhập với SMS</a>
                        </div>

                        {/* Divider */}
                        <div className="flex items-center my-6">
                            <div className="flex-grow border-t border-gray-200"></div>
                            <span className="flex-shrink mx-4 text-gray-400 text-xs">HOẶC</span>
                            <div className="flex-grow border-t border-gray-200"></div>
                        </div>

                        {/* Đăng nhập Mạng Xã hội */}
                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-center border border-gray-300 bg-white py-2.5 rounded-sm hover:bg-gray-50 transition text-sm font-semibold">
                                <Facebook className="w-5 h-5 text-blue-600 mr-2" />
                                Facebook
                            </button>
                            <button className="w-full flex items-center justify-center border border-gray-300 bg-white py-2.5 rounded-sm hover:bg-gray-50 transition text-sm font-semibold">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/48px-Google_%22G%22_logo.svg.png" 
                                    alt="Google" 
                                    className="w-5 h-5 mr-2" 
                                />
                                Google
                            </button>
                        </div>

                        {/* Footer Form: Sử dụng Link để điều hướng đến route /register */}
                        <div className="text-center text-sm mt-8">
                            <span className="text-gray-500">Bạn chưa có tài khoản?</span>
                            <Link to="/register" className="text-shopee-primary font-semibold ml-1 hover:underline">
                                Đăng Ký
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;