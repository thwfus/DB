import React, { useState } from 'react';
// Bổ sung Link
import { Link } from 'react-router-dom';
import { ShoppingBag, Store, Eye, EyeOff, Facebook, X } from 'lucide-react';

// Thay thế alert() bằng một Modal/Message
const CustomAlert = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
            <div className="bg-white p-6 rounded-lg shadow-2xl max-w-sm w-full relative">
                <button 
                    onClick={onClose} 
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 transition"
                >
                    <X className="w-5 h-5" />
                </button>
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

const Register = () => {
    const [contact, setContact] = useState('');
    const [password, setPassword] = useState('');
    const [storeName, setStoreName] = useState('');
    const [accountRole, setAccountRole] = useState('buyer'); 
    const [showPassword, setShowPassword] = useState(false);
    const [alertMessage, setAlertMessage] = useState(''); 

    // Xử lý ẩn/hiện mật khẩu
    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    // Xử lý thay đổi vai trò
    const handleRoleChange = (role) => {
        setAccountRole(role);
        if (role === 'buyer') {
            setStoreName('');
        }
    };

    // Xử lý gửi form
    const handleSubmit = (event) => {
        event.preventDefault();

        if (accountRole === 'seller' && !storeName.trim()) {
            setAlertMessage("Vui lòng nhập Tên cửa hàng.");
            return;
        }
        
        setAlertMessage("Đăng ký thành công! Chào mừng đến với Shopee.");
    };

    // Component con cho Label Vai trò
    const RoleLabel = ({ role, icon: Icon, label }) => (
        <label 
            className={`flex items-center space-x-2 border p-3 rounded-md cursor-pointer transition hover:border-shopee-primary 
                ${accountRole === role ? 'border-2 border-shopee-primary bg-red-50' : 'border-gray-300 bg-white'}`}
            onClick={() => handleRoleChange(role)}
        >
            <input 
                type="radio" 
                name="account_role" 
                value={role} 
                checked={accountRole === role}
                onChange={() => handleRoleChange(role)} 
                className="hidden" 
            />
            <Icon className="w-5 h-5 text-shopee-primary" />
            <span className="text-sm font-medium text-gray-700">{label}</span>
        </label>
    );

    return (
        <>
            {/* Custom Alert */}
            <CustomAlert message={alertMessage} onClose={() => setAlertMessage('')} />

            {/* VÌ COMPONENT NÀY LÀ CON CỦA LAYOUT, CHỈ CẦN CODE PHẦN NỘI DUNG FORM */}
            <div className="flex-grow flex items-center justify-center py-10 min-h-[calc(100vh-100px)]" style={{backgroundColor: '#fba98e3b'}}> 
                <div className="container mx-auto max-w-4xl flex bg-white rounded-lg shadow-2xl overflow-hidden transform transition duration-500 hover:shadow-3xl">
                    
                    {/* Banner Trái */}
                    <div className="hidden lg:flex w-1/2 p-12 flex-shrink-0 relative bg-shopee-primary items-center justify-center text-white">
                        <div className="z-10 relative space-y-4">
                            <h2 className="text-3xl font-bold">
                                Gia nhập cộng đồng mua bán lớn nhất Đông Nam Á
                            </h2>
                            <p className="text-lg opacity-90">
                                Đăng ký nhanh chóng và bắt đầu hành trình mua sắm hoặc kinh doanh của bạn.
                            </p>
                        </div>
                        <div className="absolute inset-0 bg-red-700 opacity-10"></div>
                    </div>

                    {/* Form Đăng Ký Phải */}
                    <div className="w-full lg:w-1/2 p-8 md:p-12">
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2">Đăng Ký Tài Khoản</h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* Lựa chọn loại tài khoản */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Bạn muốn đăng ký với vai trò gì?</label>
                                <div className="flex space-x-4">
                                    <RoleLabel role="buyer" icon={ShoppingBag} label="Người Mua" />
                                    <RoleLabel role="seller" icon={Store} label="Người Bán" />
                                </div>
                            </div>
                            
                            {/* Trường Email/Số điện thoại */}
                            <div>
                                <input
                                    type="text"
                                    placeholder="Số điện thoại hoặc Email"
                                    id="contact"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-shopee-primary text-sm transition"
                                    required
                                    value={contact}
                                    onChange={(e) => setContact(e.target.value)}
                                />
                            </div>
                            
                            {/* Trường Mật khẩu */}
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Mật khẩu (tối thiểu 8 ký tự)"
                                    id="password"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-shopee-primary text-sm pr-10 transition"
                                    required
                                    minLength="8"
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

                            {/* Trường Tên cửa hàng (Hiển thị có điều kiện) */}
                            <div id="store-name-field" className={accountRole === 'seller' ? '' : 'hidden'}>
                                <input
                                    type="text"
                                    placeholder="Tên cửa hàng (Bắt buộc cho Người Bán)"
                                    id="store-name"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-shopee-primary text-sm transition"
                                    required={accountRole === 'seller'} 
                                    value={storeName}
                                    onChange={(e) => setStoreName(e.target.value)}
                                />
                            </div>

                            {/* Nút Đăng ký */}
                            <button
                                type="submit"
                                className="shopee-primary w-full text-white font-semibold py-3 rounded-sm hover:opacity-90 transition shadow-md mt-6"
                            >
                                ĐĂNG KÝ
                            </button>
                        </form>

                        {/* Chính sách & Điều khoản */}
                        <p className="text-xs text-center text-gray-500 mt-4">
                            Bằng việc đăng ký, bạn đã đồng ý với 
                            <a href="#" className="text-shopee-primary hover:underline font-medium"> Điều khoản dịch vụ</a> & 
                            <a href="#" className="text-shopee-primary hover:underline font-medium"> Chính sách bảo mật</a> của Shopee.
                        </p>

                        {/* Divider */}
                        <div className="flex items-center my-6">
                            <div className="flex-grow border-t border-gray-200"></div>
                            <span className="flex-shrink mx-4 text-gray-400 text-xs">HOẶC ĐĂNG KÝ VỚI</span>
                            <div className="flex-grow border-t border-gray-200"></div>
                        </div>

                        {/* Đăng ký Mạng Xã hội */}
                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-center border border-gray-300 bg-white py-2.5 rounded-sm hover:bg-gray-50 transition text-sm font-semibold">
                                <Facebook className="w-5 h-5 text-blue-600 mr-2" />
                                Facebook
                            </button>
                            <button className="w-full flex items-center justify-center border border-gray-300 bg-white py-2.5 rounded-sm hover:bg-gray-50 transition text-sm font-semibold">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/48px-Google_%22G%22_logo.svg.png" 
                                    alt="Google" className="w-5 h-5 mr-2" 
                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/20x20/CCCCCC/000000?text=G" }}
                                />
                                Google
                            </button>
                        </div>

                        {/* Footer Form: Sử dụng Link để điều hướng đến route /login */}
                        <div className="text-center text-sm mt-8">
                            <span className="text-gray-500">Bạn đã có tài khoản?</span>
                            <Link to="/login" className="text-shopee-primary font-semibold ml-1 hover:underline">
                                Đăng Nhập
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;