import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Star, Shield, Truck, MessageSquare, ShoppingCart, Share2, CornerDownLeft } from 'lucide-react';

// Bỏ mockProducts đi để code không bị phụ thuộc vào nó khi dùng Link state
const mockProducts = {
    '100': { name: "Áo Hoodie Form Rộng", price: 289000, description: "Áo Hoodie Local Brand với chất liệu nỉ cotton dày dặn, form dáng oversize thời thượng.", rating: 4.8, sold: 1200, stock: 50, shop: "Official Brand Store" },
    '101': { name: "Quần Jean Nam Ống Rộng", price: 199000, description: "Quần jean ống rộng phong cách đường phố, chất liệu denim cao cấp, không phai màu.", rating: 4.5, sold: 1500, stock: 80, shop: "Trendy Streetwear" },
    '102': { name: "Giày Sneaker Unisex DG02", price: 129000, description: "Giày Sneaker vải tweed chất lượng cao, nhẹ và bền. Phù hợp cho mọi hoạt động.", rating: 4.9, sold: 2300, stock: 0, shop: "Giày Xinh" },
};
// Giữ mockProducts ở đây cho mục đích phát triển, nhưng chúng ta sẽ không dùng nó trong logic dưới đây nữa

const Items = () => {
    const {itemId } = useParams();
    const location = useLocation();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1); 
    
    // Lấy dữ liệu sản phẩm truyền từ Link (nếu có)
    const productDB = location.state?.productDB; 

    // Hàm ánh xạ từ cấu trúc Database sang cấu trúc Component Items cần
    const mapDBDataToItem = (dbData) => ({
        // Ánh xạ các trường DB sang tên biến Component đang sử dụng
        name: dbData.TenSanPham || dbData.Ten || 'Sản phẩm không tên',
        price: dbData.GiaBan || 0,
        stock: dbData.SoLuong || 0,
        description: dbData.MoTa || "Không có mô tả chi tiết được cung cấp.",
        rating: dbData.Rating || 4.5, // Giả định rating mặc định nếu không có
        sold: dbData.DaBan || 0,
        shop: dbData.TenShop || "Shop ID " + dbData.MaShop,
    });

    useEffect(() => {
        if (!itemId) return;

        // BƯỚC 1: ƯU TIÊN SỬ DỤNG DỮ LIỆU ĐƯỢC TRUYỀN QUA LINK STATE
        if (productDB) {
            const mappedProduct = mapDBDataToItem(productDB);
            setProduct(mappedProduct);
            setQuantity(mappedProduct.stock > 0 ? 1 : 0);
            setLoading(false);
            return; // Dừng useEffect nếu đã có dữ liệu
        }

        // BƯỚC 2: FALLBACK - TẢI DỮ LIỆU MỚI NẾU KHÔNG CÓ DỮ LIỆU TỪ STATE
        // (Điều này xảy ra khi người dùng truy cập trực tiếp bằng URL hoặc F5)
        setLoading(true);
        // Đây là nơi bạn sẽ gọi API thực tế:
        // fetch(`http://localhost:3001/api/product-detail/${itemId}`).then(...)
        
        // Tạm thời, để có thể kiểm tra URL trực tiếp:
        // Chúng ta sẽ giả lập rằng không tìm thấy sản phẩm nếu không có state và không có trong mock data
        
        const fetchedProductRaw = mockProducts[itemId];
        
        setTimeout(() => {
            if (fetchedProductRaw) {
                // Nếu tìm thấy trong mock (chỉ để kiểm tra F5)
                setProduct(fetchedProductRaw);
                setQuantity(fetchedProductRaw.stock > 0 ? 1 : 0);
            } else {
                // Nếu không có state và không tìm thấy trong mock (hiển thị lỗi)
                setProduct({ 
                    name: "Sản phẩm không tìm thấy", 
                    price: 0, 
                    description: "Không thể tải chi tiết sản phẩm.", 
                    rating: 0, 
                    sold: 0, 
                    stock: 0,
                    shop: "Lỗi tải dữ liệu"
                }); 
            }
            setLoading(false);
        }, 300); 

    }, [itemId, productDB]);


    const formatCurrency = (number) => new Intl.NumberFormat('vi-VN').format(number) + '₫';
    
    // ... (Hàm handleQuantityInputChange, handleDecrement, handleIncrement)
    const handleQuantityInputChange = (e) => {
        const value = parseInt(e.target.value);
        const maxStock = product.stock || 0;
        
        if (isNaN(value) || value < 1) {
            setQuantity(1);
        } else if (value > maxStock) {
            setQuantity(maxStock);
        } else {
            setQuantity(value);
        }
    };
    
    const handleDecrement = () => {
        setQuantity(prev => Math.max(1, prev - 1));
    };

    const handleIncrement = () => {
        setQuantity(prev => Math.min(product.stock, prev + 1));
    };


    if (loading) {
        return <div className="p-10 text-center text-lg text-gray-500">Đang tải chi tiết sản phẩm...</div>;
    }
    
    const isOutOfStock = product.stock <= 0;
    
    // Kiểm tra trường hợp không tìm thấy sản phẩm
    if (!product || product.price === 0 && product.name === "Sản phẩm không tìm thấy") {
         return (
             <div className="container mx-auto p-10 text-center my-6 bg-white rounded-lg shadow-lg">
                 <p className="text-2xl font-bold text-red-600 mb-4">⚠️ Lỗi: Không thể tải chi tiết sản phẩm ID: {itemId}</p>
                 <p className="text-gray-600">Vui lòng quay lại danh sách hoặc thử lại sau khi API backend đã được cấu hình.</p>
                 <a href="/" className="mt-4 inline-flex items-center text-shopee-primary hover:underline transition">
                    <CornerDownLeft className="w-4 h-4 mr-1"/> Quay lại trang chủ
                 </a>
             </div>
         );
    }

    // ... (Phần return JSX còn lại)
    return (
        <div className="container mx-auto p-4 md:p-6 bg-white shadow-md rounded-lg my-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
                
                {/* 1. Khu vực Hình ảnh & Chia sẻ (4/10) */}
                <div className="lg:col-span-4">
                    <img 
                        src={`https://placehold.co/500x500/EE4D2D/FFFFFF?text=Item+${itemId}`} 
                        alt={product.name} 
                        className="w-full h-auto object-cover rounded-lg border shadow-md"
                        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/500x500/CCCCCC/333333?text=Image+Error" }}
                    />
                    <div className="flex items-center justify-between mt-4 text-sm text-gray-500 border-t pt-4">
                        <div className="flex items-center space-x-2">
                            <Share2 className="w-4 h-4 text-gray-500" /> <span>Chia sẻ</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Shield className="w-4 h-4 text-green-500" /> <span>Shopee Đảm Bảo</span>
                        </div>
                    </div>
                </div>

                {/* 2. Khu vực Thông tin & Mua hàng (6/10) */}
                <div className="lg:col-span-6 space-y-5">
                    
                    {/* TÊN SẢN PHẨM & ĐÁNH GIÁ (Nổi bật nhất) */}
                    <h1 className="text-4xl font-extrabold text-gray-900 leading-tight border-b pb-2">
                        {product.name}
                    </h1>
                    
                    <div className="flex items-center space-x-4">
                        {/* Đánh giá */}
                        <div className="flex items-center text-shopee-primary cursor-default">
                            <span className="font-bold text-xl mr-1">{product.rating.toFixed(1)}</span>
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 fill-shopee-primary ${i < Math.floor(product.rating) ? 'text-shopee-primary' : 'text-gray-300'}`} />
                            ))}
                        </div>
                        <span className="text-gray-500 border-l pl-4">{product.sold} Đã bán</span>
                    </div>

                    {/* GIÁ CẢ */}
                    <div className="bg-red-50 p-6 rounded-lg flex items-baseline space-x-4">
                        <span className="text-4xl text-shopee-primary font-extrabold">{formatCurrency(product.price)}</span>
                    </div>

                    {/* Vận chuyển */}
                    <div className="flex items-start space-x-8 text-sm pt-2">
                        <span className="text-gray-500 w-24 flex-shrink-0">Vận Chuyển</span>
                        <div className="flex-grow">
                            <div className="flex items-center space-x-2 mb-1">
                                <Truck className="w-4 h-4 text-shopee-primary" />
                                <span className="text-gray-700 font-semibold">Miễn phí vận chuyển</span>
                            </div>
                            <p className="text-xs text-gray-500">Đến: TP. Hồ Chí Minh</p>
                        </div>
                    </div>

                    {/* Số lượng */}
                    <div className="flex items-center space-x-8 text-sm">
                        <span className="text-gray-500 w-24 flex-shrink-0">Số lượng</span>
                        <div className="flex items-center border border-gray-300 rounded-sm">
                            <button 
                                onClick={handleDecrement}
                                disabled={isOutOfStock || quantity <= 1}
                                className="p-2 w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >-</button>
                            <input 
                                type="text" 
                                value={quantity} 
                                onChange={handleQuantityInputChange}
                                className="w-10 text-center outline-none text-sm border-x border-gray-300 h-8" 
                            />
                            <button 
                                onClick={handleIncrement}
                                disabled={isOutOfStock || quantity >= product.stock}
                                className="p-2 w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >+</button>
                        </div>
                        <span className={`text-gray-500 ${isOutOfStock ? 'text-red-500 font-semibold' : ''}`}>
                            {isOutOfStock ? 'Hết hàng!' : `${product.stock} sản phẩm có sẵn`}
                        </span>
                    </div>

                    {/* Nút Hành động */}
                    <div className="pt-8 flex space-x-4">
                        <button 
                            className="flex items-center bg-orange-100 border border-shopee-primary text-shopee-primary py-3 px-8 rounded-sm text-lg font-semibold hover:bg-red-200 transition disabled:opacity-50"
                            disabled={isOutOfStock || quantity < 1}
                        >
                            <ShoppingCart className="w-5 h-5 mr-2" /> Thêm vào Giỏ hàng
                        </button>
                        <button 
                            className="bg-shopee-primary text-white py-3 px-8 rounded-sm text-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
                            disabled={isOutOfStock || quantity < 1}
                        >
                            Mua Ngay
                        </button>
                    </div>
                </div>
            </div>

            {/* 3. Mô tả Sản phẩm & Đánh giá */}
            <div className="mt-10 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Mô tả Sản phẩm</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
            </div>
            
            {/* Thông tin Shop */}
            <div className="mt-6 p-6 border rounded-lg flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <img src="https://placehold.co/60x60/EE4D2D/FFFFFF?text=SHOP" alt="Shop Avatar" className="rounded-full border-2 border-shopee-primary" />
                    <div>
                        <p className="text-xl font-semibold text-shopee-primary">{product.shop}</p>
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