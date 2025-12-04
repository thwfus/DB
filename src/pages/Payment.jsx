import React, { useState } from 'react';
// Bổ sung Link
import { Link, useNavigate } from 'react-router-dom'; 
import { MapPin, Ticket, Store, Truck, Wallet, Smartphone, CreditCard, ChevronRight, CheckCircle } from 'lucide-react';

// Dữ liệu giả lập cho trang thanh toán
const checkoutData = {
    address: {
        name: "Nguyễn Văn A",
        phone: "(+84) 901 234 567",
        detail: "999 Đường Cách Mạng Tháng 8, Phường 11, Quận 3, TP. Hồ Chí Minh",
        isDefault: true
    },
    voucher: {
        status: "Đã áp dụng 1 mã",
        discount: 10000
    },
    orderSummary: {
        subTotal: 407000,
        shippingFee: 0,
        discount: 10000,
    },
    shops: [
        {
            name: "Official Local Brand Store",
            id: 1,
            shipping: {
                method: "Giao Hàng Nhanh",
                duration: "2-4 ngày",
                deliveryDate: "5 Th12 - 7 Th12",
                fee: 0
            },
            items: [
                { name: "Áo Hoodie Local Brand Form Rộng", variant: "Đen, Size L", qty: 1, price: 289000, imgSrc: "https://placehold.co/50x50/2C3E50/FFFFFF?text=SP1" },
                { name: "Áo Thun Nữ Cổ Tròn", variant: "Trắng, Size M", qty: 2, price: 59000, imgSrc: "https://placehold.co/50x50/B2EBF2/333333?text=SP2" }
            ]
        }
    ]
};

// Hàm định dạng tiền tệ
const formatCurrency = (number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number).replace('₫', '').trim() + '₫';
};

// Component Modal Thông báo
const CustomAlert = ({ message, onClose }) => {
    if (!message) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
            <div className="bg-white p-6 rounded-lg shadow-2xl max-w-sm w-full relative">
                <div className="flex items-center mb-4">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
                    <h3 className="text-xl font-semibold text-gray-800">Đặt hàng thành công</h3>
                </div>
                <p className="text-gray-700 mb-6">{message}</p>
                <button 
                    onClick={onClose} 
                    className="shopee-primary mt-4 w-full text-white font-semibold py-2 rounded-sm hover:opacity-90 transition"
                >
                    Xem chi tiết đơn hàng
                </button>
            </div>
        </div>
    );
};

// Component cho một sản phẩm trong tóm tắt đơn hàng
const OrderItem = ({ item }) => {
    const itemTotal = item.qty * item.price;
    return (
        <div className="grid grid-cols-12 items-center text-sm text-gray-700 py-2">
            <div className="col-span-6 flex items-center space-x-3">
                <img src={item.imgSrc} alt={item.name} className="w-12 h-12 object-cover rounded-sm border" />
                <div>
                    <p className="line-clamp-1">{item.name}</p>
                    <p className="text-xs text-gray-500">Phân loại: {item.variant}</p>
                </div>
            </div>
            <span className="col-span-2 text-center">x{item.qty}</span>
            <span className="col-span-4 text-right">{formatCurrency(itemTotal)}</span>
        </div>
    );
};


const CheckoutPage = () => {
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [alertMessage, setAlertMessage] = useState(null);
    const navigate = useNavigate(); // Sử dụng hook để điều hướng

    // Tính toán tổng tiền cuối cùng
    const finalGrandTotal = checkoutData.orderSummary.subTotal - checkoutData.orderSummary.discount + checkoutData.orderSummary.shippingFee;
    
    // Giả lập logic xử lý sự kiện
    const handleChangeAddress = () => {
        setAlertMessage("Chức năng thay đổi địa chỉ (Chưa triển khai logic)");
    };

    const handlePlaceOrder = (event) => {
        event.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ a
        
        console.log("--- XÁC NHẬN ĐẶT HÀNG ---");
        console.log("Tổng thanh toán:", formatCurrency(finalGrandTotal));
        console.log("Phương thức thanh toán:", paymentMethod);
        
        // Hiển thị modal thông báo thành công
        setAlertMessage(`Đơn hàng đã được đặt thành công! Phương thức: ${paymentMethod}.`);
        
        // Sau khi người dùng đóng modal, chuyển hướng họ đến trang chi tiết đơn hàng (Information.jsx)
        // Lưu ý: Thông thường, bạn sẽ chuyển hướng sau khi gọi API thành công.
    };
    
    const handleAlertClose = () => {
        setAlertMessage(null);
        // Chuyển hướng người dùng đến trang chi tiết đơn hàng (giả sử ID đơn hàng là 1)
        navigate('/information');
    };

    return (
        <>
            {/* Modal Thông báo Đặt hàng thành công */}
            <CustomAlert message={alertMessage} onClose={handleAlertClose} />

            {/* LOẠI BỎ DIV CHUNG VÀ HEADER/FOOTER VÌ ĐÃ CÓ LAYOUT.JSX XỬ LÝ */}
            <div className="container mx-auto p-4 md:p-6">

                {/* Địa chỉ Nhận hàng */}
                <section className="bg-white rounded-lg shadow-md p-6 mb-4">
                    <h2 className="text-xl font-semibold text-shopee-primary mb-4 flex items-center space-x-2">
                        <MapPin className="w-6 h-6 fill-shopee-primary text-shopee-primary" />
                        <span>Địa Chỉ Nhận Hàng</span>
                    </h2>
                    <div className="flex items-start justify-between border-t pt-4">
                        <div className="text-gray-700 space-y-1">
                            <p className="font-bold">{checkoutData.address.name} {checkoutData.address.phone}</p>
                            <p className="text-sm">{checkoutData.address.detail}</p>
                            {checkoutData.address.isDefault && (
                                <span className="text-xs border border-green-500 text-green-500 px-2 py-0.5 rounded-sm">Mặc Định</span>
                            )}
                        </div>
                        <button onClick={handleChangeAddress} className="text-blue-500 text-sm hover:underline font-semibold">THAY ĐỔI</button>
                    </div>
                </section>

                {/* KHU VỰC MÃ GIẢM GIÁ */}
                <section className="bg-white rounded-lg shadow-md p-4 mb-6">
                    {/* Sử dụng Link */}
                    <Link to="/vouchers" className="block hover:bg-red-50/50 p-2 -m-2 rounded-md transition cursor-pointer">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2 text-gray-800">
                                <Ticket className="w-5 h-5 text-shopee-primary" />
                                <span className="text-lg font-semibold">Mã Giảm Giá Shopee</span>
                            </div>
                            
                            <div className="flex items-center space-x-2 text-shopee-primary font-semibold text-sm">
                                <span id="selected-voucher-status">{checkoutData.voucher.status}</span>
                                <ChevronRight className="w-4 h-4" />
                            </div>
                        </div>
                    </Link>
                    <div className="text-sm text-gray-500 mt-2 border-t pt-2">
                        Giảm giá: <span className="text-shopee-primary font-bold">-{formatCurrency(checkoutData.voucher.discount)}</span>
                    </div>
                </section>

                {/* Thông tin Sản phẩm và Phương thức Vận chuyển */}
                <section className="bg-white rounded-lg shadow-md mb-6 p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Sản Phẩm Đặt Hàng</h2>
                    
                    {checkoutData.shops.map(shop => (
                        <div key={shop.id} className="border-b pb-4 mb-4">
                            <div className="flex items-center space-x-2 font-semibold text-gray-800 mb-3">
                                <Store className="w-5 h-5 text-shopee-primary" />
                                <span>{shop.name}</span>
                            </div>
                            
                            {shop.items.map((item, index) => (
                                <OrderItem key={index} item={item} />
                            ))}

                            {/* Phương thức Vận chuyển */}
                            <div className="mt-4 pt-4 border-t">
                                <h3 className="font-semibold text-gray-800 mb-2">Phương Thức Vận Chuyển</h3>
                                <div className="flex justify-between items-center bg-red-50 p-3 rounded-md border border-shopee-primary/50">
                                    <div className="flex items-center space-x-3">
                                        <Truck className="w-5 h-5 text-shopee-primary" />
                                        <div>
                                            <p className="font-bold text-gray-800 text-sm">{shop.shipping.method} (Giao trong {shop.shipping.duration})</p>
                                            <p className="text-xs text-gray-500">Nhận hàng vào {shop.shipping.deliveryDate}</p>
                                        </div>
                                    </div>
                                    <span className="text-shopee-primary font-bold">{formatCurrency(shop.shipping.fee)}</span>
                                    <button onClick={() => setAlertMessage("Thay đổi vận chuyển (Chưa triển khai logic)")} className="text-blue-500 text-sm hover:underline font-semibold">THAY ĐỔI</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </section>

                {/* Phương thức Thanh toán */}
                <section className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Phương Thức Thanh Toán</h2>
                    <div className="flex flex-wrap gap-4 text-sm">
                        
                        {/* Thanh toán khi nhận hàng (COD) */}
                        <label 
                            className={`payment-option border-2 p-3 rounded-md cursor-pointer transition flex items-center space-x-2 
                                ${paymentMethod === 'COD' ? 'border-shopee-primary' : 'border-shopee-primary/20 hover:border-shopee-primary/50'}`}
                            onClick={() => setPaymentMethod('COD')}
                        >
                            <input 
                                type="radio" 
                                name="payment_method" 
                                value="COD" 
                                checked={paymentMethod === 'COD'}
                                onChange={() => setPaymentMethod('COD')} 
                                className="text-shopee-primary focus:ring-shopee-primary" 
                            />
                            <Wallet className="w-5 h-5 text-gray-600" />
                            <span className="font-medium">Thanh toán khi nhận hàng (COD)</span>
                        </label>
                        
                        {/* Ví ShopeePay */}
                        <label 
                            className={`payment-option border-2 p-3 rounded-md cursor-pointer transition flex items-center space-x-2 
                                ${paymentMethod === 'ShopeePay' ? 'border-shopee-primary' : 'border-shopee-primary/20 hover:border-shopee-primary/50'}`}
                            onClick={() => setPaymentMethod('ShopeePay')}
                        >
                            <input 
                                type="radio" 
                                name="payment_method" 
                                value="ShopeePay" 
                                checked={paymentMethod === 'ShopeePay'}
                                onChange={() => setPaymentMethod('ShopeePay')} 
                                className="text-shopee-primary focus:ring-shopee-primary" 
                            />
                            <Smartphone className="w-5 h-5 text-green-500" />
                            <span className="font-medium">Ví ShopeePay</span>
                        </label>
                        
                        {/* Thẻ Tín dụng/Ghi nợ */}
                        <label 
                            className={`payment-option border-2 p-3 rounded-md cursor-pointer transition flex items-center space-x-2 
                                ${paymentMethod === 'Card' ? 'border-shopee-primary' : 'border-shopee-primary/20 hover:border-shopee-primary/50'}`}
                            onClick={() => setPaymentMethod('Card')}
                        >
                            <input 
                                type="radio" 
                                name="payment_method" 
                                value="Card" 
                                checked={paymentMethod === 'Card'}
                                onChange={() => setPaymentMethod('Card')} 
                                className="text-shopee-primary focus:ring-shopee-primary" 
                            />
                            <CreditCard className="w-5 h-5 text-blue-500" />
                            <span className="font-medium">Thẻ Tín dụng/Ghi nợ</span>
                        </label>
                    </div>
                </section>

                {/* Tổng kết đơn hàng (Sticky Footer) */}
                <section className="sticky bottom-0 bg-white p-6 shadow-2xl rounded-lg border-t-4 border-shopee-primary z-10">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Tóm Tắt Thanh Toán</h2>

                    <div className="space-y-2 text-sm text-gray-700">
                        <div className="flex justify-between">
                            <span>Tổng tiền hàng ({checkoutData.shops.flatMap(s => s.items).length} sản phẩm)</span>
                            <span>{formatCurrency(checkoutData.orderSummary.subTotal)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Phí vận chuyển</span>
                            <span className="text-green-600">{formatCurrency(checkoutData.orderSummary.shippingFee)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Mã giảm giá Shopee</span>
                            <span className="text-shopee-primary">-{formatCurrency(checkoutData.orderSummary.discount)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-200">
                            <span>Tổng thanh toán</span>
                            <span id="final-grand-total" className="text-shopee-primary text-3xl">{formatCurrency(finalGrandTotal)}</span>
                        </div>
                    </div>

                    {/* Nút Đặt hàng */}
                    <div className="mt-6 text-right">
                        {/* Sử dụng button và gọi handlePlaceOrder */}
                        <button
                            id="place-order-button"
                            className="shopee-primary text-white py-4 px-12 rounded-sm text-lg font-semibold hover:opacity-90 transition shadow-lg"
                            onClick={handlePlaceOrder}
                        >
                            ĐẶT HÀNG
                        </button>
                    </div>
                </section>

            </div>
        </>
    );
};

export default CheckoutPage;