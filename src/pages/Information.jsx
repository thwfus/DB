import React from 'react';
// Bổ sung Link
import { Link } from 'react-router-dom'; 
import { PackageCheck, Box, Truck, Home, MapPin, Store, Package } from 'lucide-react';

// Dữ liệu giả lập cho Chi tiết đơn hàng
const orderDetails = {
    id: "251025-ABCD",
    date: "01/12/2025",
    time: "10:30",
    status: "Chờ lấy hàng", // Trạng thái hiện tại
    deliveryEstimate: "05 - 07 Th12",
    address: {
        name: "Nguyễn Văn A",
        phone: "(+84) 901 234 567",
        detail: "999 Đường Cách Mạng Tháng 8, Phường 11, Quận 3, TP. Hồ Chí Minh",
    },
    shipping: {
        carrier: "Giao Hàng Nhanh",
        trackingId: "GHN-123456789",
        timeline: [
            { time: "01/12/2025, 12:00", text: "Đơn hàng đã được Shop đóng gói xong.", active: true },
            { time: "01/12/2025, 11:00", text: "Đơn hàng đang chờ đơn vị vận chuyển lấy.", active: true },
            { time: "01/12/2025, 10:30", text: "Đơn hàng đã được đặt.", active: false },
        ]
    },
    items: [
        { name: "Áo Hoodie Local Brand Form Rộng, Vải Nỉ Cotton", variant: "Đen, Size L", qty: 1, price: 289000, imgSrc: "https://placehold.co/80x80/2C3E50/FFFFFF?text=HOODIE" },
        { name: "Áo Thun Nữ Cổ Tròn Form Rộng In Hình", variant: "Trắng, Size M", qty: 2, price: 59000, imgSrc: "https://placehold.co/80x80/B2EBF2/333333?text=AOTHUN" },
    ],
    summary: {
        subTotal: 407000,
        shippingFee: 0,
        voucherDiscount: 10000,
        finalTotal: 397000,
        paymentMethod: "Thanh toán khi nhận hàng (COD)"
    }
};

// Hàm định dạng tiền tệ
const formatCurrency = (number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number).replace('₫', '').trim() + '₫';
};

// Component cho một bước trong Timeline
const TimelineStep = ({ icon: Icon, label, isActive = false }) => (
    <div className="text-center w-1/4">
        <Icon className={`w-6 h-6 mx-auto mb-1 ${isActive ? 'text-shopee-primary' : 'text-gray-500'}`} />
        <p className={`font-medium ${isActive ? 'text-shopee-primary' : 'text-gray-500'}`}>{label}</p>
    </div>
);

// Component chính
const OrderDetailPage = () => {
    
    // Logic cho Timeline
    const timelineIcons = {
        "Đặt hàng": PackageCheck,
        "Chờ lấy hàng": Box,
        "Đang giao": Truck,
        "Đã nhận": Home,
    };
    const timelineLabels = ["Đặt hàng", "Chờ lấy hàng", "Đang giao", "Đã nhận"];
    const currentStatusIndex = timelineLabels.indexOf(orderDetails.status);

    return (
        // LOẠI BỎ DIV CHUNG VÀ HEADER/FOOTER VÌ ĐÃ CÓ LAYOUT.JSX XỬ LÝ
        <div className="container mx-auto p-4 md:p-6 bg-gray-50 min-h-full">
            
            {/* Khối Tiêu đề và Trạng thái */}
            <section className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Đơn hàng #{orderDetails.id}</h2>
                        <p className="text-sm text-gray-500">Đặt ngày: {orderDetails.date} lúc {orderDetails.time}</p>
                    </div>
                    <div className="text-right">
                        <span className="text-shopee-primary text-xl font-bold">{orderDetails.status.toUpperCase()}</span>
                        <p className="text-xs text-gray-500 mt-1">Dự kiến giao: {orderDetails.deliveryEstimate}</p>
                    </div>
                </div>
                
                {/* Timeline (Tiến trình đơn hàng) */}
                <div className="pt-4 flex justify-between text-sm font-medium">
                    {timelineLabels.map((label, index) => (
                        <TimelineStep
                            key={label}
                            label={label}
                            icon={timelineIcons[label] || Package} // Fallback icon
                            isActive={index <= currentStatusIndex}
                        />
                    ))}
                </div>
                
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Cột 1 & 2 (Chi tiết) */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Địa chỉ & Vận chuyển */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">Thông tin Vận chuyển</h3>
                        
                        {/* Địa chỉ */}
                        <div className="mb-4">
                            <p className="font-bold text-sm text-gray-700 mb-1 flex items-center space-x-2">
                                <MapPin className="w-4 h-4 text-shopee-primary" />
                                <span>Địa chỉ nhận hàng:</span>
                            </p>
                            <p className="text-sm text-gray-600 pl-6">{orderDetails.address.name} | {orderDetails.address.phone}</p>
                            <p className="text-sm text-gray-600 pl-6">{orderDetails.address.detail}</p>
                        </div>

                        {/* Mã vận đơn và Lịch sử */}
                        <div>
                            <p className="font-bold text-sm text-gray-700 mb-2 flex items-center space-x-2">
                                <Truck className="w-4 h-4 text-shopee-primary" />
                                <span>Vận chuyển: {orderDetails.shipping.carrier} (Mã Vận Đơn: {orderDetails.shipping.trackingId})</span>
                            </p>
                            
                            {/* Dòng thời gian vận chuyển */}
                            <div className="pl-6 pt-2 relative">
                                {orderDetails.shipping.timeline.map((step, index) => (
                                    <div key={index} className="flex relative pb-8">
                                        {/* Đường kẻ dọc */}
                                        {index < orderDetails.shipping.timeline.length - 1 && (
                                            <div className={`absolute top-0 left-[5px] h-full w-px ${step.active ? 'bg-shopee-primary' : 'bg-gray-300'}`}></div>
                                        )}
                                        
                                        {/* Chấm tròn */}
                                        <div className={`h-3 w-3 rounded-full z-10 ${step.active ? 'bg-shopee-primary' : 'bg-gray-300'}`}></div>
                                        
                                        <div className="ml-4 -mt-1">
                                            <p className={`text-sm ${step.active ? 'font-semibold text-gray-800' : 'text-gray-500'}`}>{step.text}</p>
                                            <p className="text-xs text-gray-500">{step.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sản phẩm trong đơn hàng */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">Sản phẩm ({orderDetails.items.length})</h3>

                        <div className="space-y-4">
                            {orderDetails.items.map((item, index) => (
                                <div key={index} className="flex justify-between items-start border-b pb-4">
                                    <div className="flex items-center space-x-4">
                                        <img src={item.imgSrc} alt={item.name} className="w-16 h-16 object-cover rounded-md border" />
                                        <div>
                                            <p className="font-medium text-gray-800 line-clamp-2">{item.name}</p>
                                            <p className="text-xs text-gray-500">Phân loại: {item.variant}</p>
                                            <p className="text-xs text-gray-500 mt-1">x{item.qty}</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-shopee-primary">{formatCurrency(item.qty * item.price)}</span>
                                </div>
                            ))}
                        </div>
                        
                        <div className="text-right mt-4 pt-4 border-t">
                            <Link to="/chat" className="border border-shopee-primary text-shopee-primary text-sm px-4 py-1 rounded-sm hover:bg-red-50 transition font-semibold">
                                LIÊN HỆ SHOP
                            </Link>
                        </div>
                    </div>

                </div>

                {/* Cột 3 (Tóm tắt Thanh toán) */}
                <div className="lg:col-span-1 space-y-6">
                    
                    <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">Tóm Tắt Thanh Toán</h3>
                        
                        <div className="space-y-3 text-sm text-gray-700">
                            <div className="flex justify-between">
                                <span>Tổng tiền hàng</span>
                                <span>{formatCurrency(orderDetails.summary.subTotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Phí vận chuyển</span>
                                <span>{formatCurrency(orderDetails.summary.shippingFee)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Mã giảm giá</span>
                                <span className="text-shopee-primary">-{formatCurrency(orderDetails.summary.voucherDiscount)}</span>
                            </div>
                            
                            <div className="flex justify-between font-bold text-base pt-3 border-t border-gray-200">
                                <span>Thành tiền</span>
                                <span className="text-shopee-primary text-2xl">{formatCurrency(orderDetails.summary.finalTotal)}</span>
                            </div>

                            <div className="pt-2 border-t text-xs">
                                <span className="font-bold">Phương thức:</span> 
                                <span className="text-gray-600">{orderDetails.summary.paymentMethod}</span>
                            </div>
                        </div>
                    </div>

                    {/* Nút Tùy chọn */}
                    <div className="flex flex-col space-y-3">
                        <button className="w-full bg-blue-500 text-white py-3 rounded-sm font-semibold hover:bg-blue-600 transition">
                            THEO DÕI VẬN CHUYỂN
                        </button>
                        <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-sm font-semibold hover:bg-gray-100 transition">
                            YÊU CẦU HỦY ĐƠN
                        </button>
                    </div>

                </div>
                
            </div>
        </div>
    );
};

export default OrderDetailPage;