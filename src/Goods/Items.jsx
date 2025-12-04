import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // <<<--- BƯỚC 3: IMPORT useParams
import { Star, Shield, Truck, MessageSquare, ShoppingCart, Share2 } from 'lucide-react';

// Dữ liệu sản phẩm giả lập
const mockProducts = {
    '1': { name: "Áo Hoodie Form Rộng", price: 289000, description: "Áo Hoodie Local Brand với chất liệu nỉ cotton dày dặn, form dáng oversize thời thượng.", rating: 4.8, sold: 1200, stock: 50, shop: "Official Brand Store" },
    '101': { name: "Quần Jean Nam Ống Rộng", price: 199000, description: "Quần jean ống rộng phong cách đường phố, chất liệu denim cao cấp, không phai màu.", rating: 4.5, sold: 1500, stock: 80, shop: "Trendy Streetwear" },
    // Thêm các sản phẩm mock khác tương ứng với ID trong Home.jsx (1, 2, ..., 101, 102, ...)
};

const Items = () => {
    // BƯỚC 4: LẤY ITEM ID TỪ URL
    const { itemId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        setLoading(true);
        // GIẢ LẬP GỌI DATABASE (API)
        setTimeout(() => {
            const fetchedProduct = mockProducts[itemId] || { 
                name: "Sản phẩm không tìm thấy", 
                price: 0, 
                description: "Vui lòng kiểm tra lại đường dẫn sản phẩm.", 
                rating: 0, 
                sold: 0, 
                stock: 0,
                shop: "Shopee Fake"
            };
            setProduct(fetchedProduct);
            setLoading(false);
        }, 300); // Giả lập độ trễ tải dữ liệu
    }, [itemId]);

    const formatCurrency = (number) => new Intl.NumberFormat('vi-VN').format(number) + '₫';

    if (loading) {
        return <div className="p-10 text-center text-lg text-gray-500">Đang tải chi tiết sản phẩm...</div>;
    }

    return (
        <div className="container mx-auto p-4 md:p-6 bg-white shadow-md rounded-lg my-6">
            <h1 className="text-xl font-light text-gray-500 mb-4">Chi tiết Sản phẩm ID: {itemId}</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
                {/* 1. Khu vực Hình ảnh (4/10) */}
                <div className="lg:col-span-4">
                    <img 
                        src={`https://placehold.co/500x500/EE4D2D/FFFFFF?text=Item+${itemId}`} 
                        alt={product.name} 
                        className="w-full h-auto object-cover rounded-lg border shadow-sm"
                        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/500x500/CCCCCC/333333?text=Image+Error" }}
                    />
                    <div className="flex items-center justify-between mt-4 text-sm text-gray-500 border-t pt-4">
                        <div className="flex items-center space-x-2">
                            <Share2 className="w-4 h-4 text-shopee-primary" /> <span>Chia sẻ</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Shield className="w-4 h-4 text-green-500" /> <span>Shopee Đảm Bảo</span>
                        </div>
                    </div>
                </div>

                {/* 2. Khu vực Thông tin (6/10) */}
                <div className="lg:col-span-6 space-y-4">
                    <h2 className="text-3xl font-semibold text-gray-900">{product.name}</h2>
                    
                    {/* Đánh giá & Bán */}
                    <div className="flex items-center space-x-4 pb-2 border-b">
                        <div className="flex items-center text-shopee-primary">
                            <span className="font-bold text-xl mr-1">{product.rating.toFixed(1)}</span>
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 fill-shopee-primary ${i < Math.floor(product.rating) ? 'text-shopee-primary' : 'text-gray-300'}`} />
                            ))}
                        </div>
                        <span className="text-gray-500 border-l pl-4">{product.sold} Đã bán</span>
                    </div>

                    {/* Giá */}
                    <div className="bg-red-50 p-4 rounded-md flex items-baseline space-x-4">
                        <span className="text-2xl text-shopee-primary font-bold">{formatCurrency(product.price)}</span>
                    </div>

                    {/* Vận chuyển */}
                    <div className="flex items-start space-x-8 text-sm">
                        <span className="text-gray-500 w-24 flex-shrink-0">Vận Chuyển</span>
                        <div className="flex-grow">
                            <div className="flex items-center space-x-2">
                                <Truck className="w-4 h-4 text-shopee-primary" />
                                <span className="text-gray-700">Miễn phí vận chuyển</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Đến: TP. Hồ Chí Minh</p>
                        </div>
                    </div>

                    {/* Số lượng */}
                    <div className="flex items-center space-x-8 text-sm">
                        <span className="text-gray-500 w-24 flex-shrink-0">Số lượng</span>
                        <div className="flex items-center border border-gray-300 rounded-sm">
                            <button 
                                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                className="p-1 hover:bg-gray-50 transition"
                            >-</button>
                            <input 
                                type="text" 
                                value={quantity} 
                                readOnly
                                className="w-10 text-center outline-none text-sm border-x border-gray-300" 
                            />
                            <button 
                                onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                                className="p-1 hover:bg-gray-50 transition"
                            >+</button>
                        </div>
                        <span className="text-gray-500">{product.stock} sản phẩm có sẵn</span>
                    </div>

                    {/* Nút Hành động */}
                    <div className="pt-6 flex space-x-4">
                        <button className="flex items-center shopee-primary text-white py-3 px-8 rounded-sm text-lg font-semibold hover:opacity-90 transition">
                            <ShoppingCart className="w-5 h-5 mr-2" /> Thêm vào Giỏ hàng
                        </button>
                        <button className="bg-red-600 text-white py-3 px-8 rounded-sm text-lg font-semibold hover:bg-red-700 transition">
                            Mua Ngay
                        </button>
                    </div>

                </div>
            </div>

            {/* 3. Mô tả Sản phẩm & Đánh giá */}
            <div className="mt-10 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Mô tả Sản phẩm</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
            </div>
            
            {/* Thông tin Shop */}
            <div className="mt-6 p-6 border rounded-lg flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <img src="https://placehold.co/60x60/EE4D2D/FFFFFF?text=SHOP" alt="Shop Avatar" className="rounded-full border-2 border-shopee-primary" />
                    <div>
                        <p className="text-lg font-semibold text-shopee-primary">{product.shop}</p>
                        <p className="text-sm text-gray-500">Hoạt động 5 giờ trước</p>
                    </div>
                </div>
                <button className="border border-shopee-primary text-shopee-primary py-2 px-4 rounded-sm hover:bg-red-50 transition flex items-center">
                    <MessageSquare className="w-4 h-4 mr-1" /> Chat
                </button>
            </div>

        </div>
    );
};

export default Items;