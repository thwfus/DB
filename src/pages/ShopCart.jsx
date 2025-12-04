import React, { useState, useEffect, useMemo } from 'react';
// Import Link từ React Router
import { Link } from 'react-router-dom'; 
import { Search, Store, Minus, Plus, Ticket, X, AlertTriangle } from 'lucide-react';

// Hàm định dạng tiền tệ
const formatCurrency = (number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
        .format(number)
        .replace('₫', '')
        .trim() + '₫';
};

// Dữ liệu Giỏ hàng giả lập
const initialCartItems = [
    // Shop 1
    {
        shopName: "Official Local Brand Store",
        shopId: 1,
        items: [
            {
                id: 1,
                name: "Áo Hoodie Local Brand Form Rộng, Vải Nỉ Cotton Dày Dặn",
                variant: "Đen, Size L",
                price: 289000,
                quantity: 1,
                maxStock: 5,
                isChecked: true,
                imgSrc: "https://placehold.co/80x80/EE4D2D/FFFFFF?text=HOODIE"
            },
            {
                id: 2,
                name: "Áo Thun Nữ Cổ Tròn Form Rộng In Hình Dễ Thương",
                variant: "Trắng, Size M",
                price: 59000,
                quantity: 2,
                maxStock: 10,
                isChecked: true,
                imgSrc: "https://placehold.co/80x80/FEECE8/EE4D2D?text=AOTHUN"
            }
        ]
    },
    // Shop 2
    {
        shopName: "Điện Tử Chính Hãng",
        shopId: 2,
        items: [
            {
                id: 3,
                name: "Tai Nghe Bluetooth TWS Chất Lượng Cao Chống Nước",
                variant: "Đen, 600 mAp",
                price: 450000,
                quantity: 1,
                maxStock: 5,
                isChecked: true,
                imgSrc: "https://placehold.co/80x80/1A1A1A/FFFFFF?text=TWS"
            },
            {
                id: 4,
                name: "Loa JBL Plip6 bluetooth 5.3",
                variant: "Đen, 600 mAp",
                price: 2000000,
                quantity: 1,
                maxStock: 10,
                isChecked: true,
                imgSrc: "https://placehold.co/80x80/000000/FFFFFF?text=JBL"
            }
        ]
    }
];

// Component Modal Xác nhận Xóa (Đã thêm prop message để dùng chung)
const DeleteConfirmModal = ({ isOpen, onConfirm, onCancel, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
            <div className="bg-white p-6 rounded-lg shadow-2xl max-w-sm w-full relative">
                <div className="flex items-center mb-4">
                    <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                    <h3 className="text-xl font-semibold text-gray-800">Xác nhận xóa</h3>
                </div>
                <p className="text-gray-700 mb-6">{message}</p>
                
                <div className="flex justify-end space-x-3">
                    <button 
                        onClick={onCancel} 
                        className="bg-gray-200 text-gray-800 py-2 px-4 rounded-sm hover:bg-gray-300 transition font-medium"
                    >
                        Hủy
                    </button>
                    <button 
                        onClick={onConfirm} 
                        className="shopee-primary text-white py-2 px-4 rounded-sm hover:opacity-90 transition font-medium"
                    >
                        Xóa
                    </button>
                </div>
            </div>
        </div>
    );
};

// Component con cho một Sản phẩm trong giỏ hàng
const CartItem = ({ item, shopId, onQuantityChange, onItemCheck, onInitiateDelete }) => {
    const itemTotal = item.price * item.quantity;
    
    return (
        <div className="grid grid-cols-12 p-4 border-b items-center product-item bg-white hover:bg-gray-50 transition">
            {/* Sản phẩm (5 cột) */}
            <div className="col-span-5 flex items-center">
                <input 
                    type="checkbox" 
                    className="w-4 h-4 text-shopee-primary rounded border-gray-300 focus:ring-shopee-primary mr-3 product-checkbox" 
                    checked={item.isChecked}
                    onChange={() => onItemCheck(shopId, item.id)}
                />
                {/* Sử dụng Link để điều hướng đến trang chi tiết sản phẩm */}
                <Link to={`/product/${item.id}`} className="flex items-center space-x-3 hover:text-shopee-primary transition">
                    <img 
                        src={item.imgSrc} 
                        alt={item.name} 
                        className="w-20 h-20 object-cover rounded-md border" 
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/80x80/CCCCCC/333333?text=Product" }}
                    />
                    <div className="text-sm">
                        <p className="text-gray-800 line-clamp-2">{item.name}</p>
                        <p className="text-xs text-gray-500 mt-1">Phân loại: {item.variant}</p>
                    </div>
                </Link>
            </div>
            
            {/* Đơn giá (2 cột) */}
            <div className="col-span-2 text-center text-sm text-gray-800">{formatCurrency(item.price)}</div>
            
            {/* Số lượng (2 cột) */}
            <div className="col-span-2 flex justify-center">
                <div className="flex items-center border border-gray-300 rounded-sm">
                    <button 
                        className={`qty-minus p-1 transition ${item.quantity <= 1 ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                        onClick={() => item.quantity > 1 && onQuantityChange(shopId, item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                    >
                        <Minus className="w-4 h-4" />
                    </button>
                    <input 
                        type="text" 
                        value={item.quantity} 
                        className="qty-input w-10 text-center outline-none text-sm border-x border-gray-300" 
                        readOnly 
                    />
                    <button 
                        className={`qty-plus p-1 transition ${item.quantity >= item.maxStock ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                        onClick={() => item.quantity < item.maxStock && onQuantityChange(shopId, item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.maxStock}
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Thành tiền (2 cột) */}
            <div className="col-span-2 text-right font-bold text-shopee-primary text-sm total-price-item">
                {formatCurrency(itemTotal)}
            </div>

            {/* Thao tác (1 cột) */}
            <div className="col-span-1 flex justify-center">
                <button 
                    className="text-gray-400 hover:text-shopee-primary transition delete-item text-sm"
                    onClick={() => onInitiateDelete(shopId, item.id)}
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

// Component chính
const ShopCart = () => {
    const [cartData, setCartData] = useState(initialCartItems);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null); // { shopId, itemId } or 'checked'

    // --- Handlers cho Logic Giỏ Hàng ---

    // Hàm chung để cập nhật trạng thái giỏ hàng
    const updateCart = (newCart) => {
        // Loại bỏ các shop không còn item nào
        const filteredCart = newCart.filter(shop => shop.items.length > 0);
        setCartData(filteredCart);
    };

    // 1. Cập nhật số lượng sản phẩm
    const handleQuantityChange = (shopId, itemId, newQuantity) => {
        const newCart = cartData.map(shop => ({
            ...shop,
            items: shop.items.map(item => 
                shop.shopId === shopId && item.id === itemId ? { ...item, quantity: newQuantity } : item
            )
        }));
        updateCart(newCart);
    };

    // 2. Chọn/Bỏ chọn sản phẩm
    const handleItemCheck = (shopId, itemId) => {
        const newCart = cartData.map(shop => ({
            ...shop,
            items: shop.items.map(item => 
                shop.shopId === shopId && item.id === itemId ? { ...item, isChecked: !item.isChecked } : item
            )
        }));
        updateCart(newCart);
    };

    // 3. Chọn/Bỏ chọn tất cả sản phẩm của một shop
    const handleShopCheck = (shopId) => {
        const currentShop = cartData.find(s => s.shopId === shopId);
        if (!currentShop) return;
        
        const allChecked = currentShop.items.every(item => item.isChecked);
        const newCheckState = !allChecked;

        const newCart = cartData.map(shop => 
            shop.shopId === shopId ? { 
                ...shop,
                items: shop.items.map(item => ({ ...item, isChecked: newCheckState }))
            } : shop
        );
        updateCart(newCart);
    };
    
    // 4. Chọn/Bỏ chọn TẤT CẢ sản phẩm trong giỏ hàng
    const handleSelectAll = () => {
        const allItems = cartData.flatMap(shop => shop.items);
        const allChecked = allItems.every(item => item.isChecked);
        const newCheckState = !allChecked;

        const newCart = cartData.map(shop => ({
            ...shop,
            items: shop.items.map(item => ({ ...item, isChecked: newCheckState }))
        }));
        updateCart(newCart);
    };

    // 5. Mở modal xác nhận xóa
    const handleInitiateDelete = (shopId, itemId) => {
        setItemToDelete({ shopId, itemId });
        setIsModalOpen(true);
    };
    
    // 6. Xử lý xóa (cả xóa 1 item và xóa nhiều item đã chọn)
    const handleConfirmDelete = () => {
        if (!itemToDelete) return;
        
        if (itemToDelete === 'checked') {
            // Xóa tất cả sản phẩm đã chọn
            const newCart = cartData.map(shop => ({
                ...shop,
                items: shop.items.filter(item => !item.isChecked)
            }));
            updateCart(newCart);
        } else {
            // Xóa một sản phẩm duy nhất
            const { shopId, itemId } = itemToDelete;
            const newCart = cartData.map(shop => ({
                ...shop,
                items: shop.items.filter(item => !(shop.shopId === shopId && item.id === itemId))
            }));
            updateCart(newCart);
        }

        setIsModalOpen(false);
        setItemToDelete(null);
    };

    // 7. Hủy xóa
    const handleCancelDelete = () => {
        setIsModalOpen(false);
        setItemToDelete(null);
    };

    // 8. Tính tổng tiền & số lượng sản phẩm được chọn (Sử dụng useMemo để tối ưu hóa)
    const { grandTotal, checkedItemCount, totalItemCount } = useMemo(() => {
        let total = 0;
        let count = 0;
        let totalItems = 0;
        
        cartData.forEach(shop => {
            shop.items.forEach(item => {
                totalItems += 1;
                if (item.isChecked) {
                    total += item.price * item.quantity;
                    count += item.quantity;
                }
            });
        });

        return { grandTotal: total, checkedItemCount: count, totalItemCount: totalItems };
    }, [cartData]);

    // Kiểm tra trạng thái "Chọn tất cả" cho footer
    const isSelectAllChecked = cartData.length > 0 && cartData.every(shop => 
        shop.items.length > 0 && shop.items.every(item => item.isChecked)
    );
    
    // Xác định nội dung modal
    const modalMessage = itemToDelete === 'checked' 
        ? `Bạn có chắc chắn muốn xóa ${checkedItemCount} sản phẩm đã chọn khỏi giỏ hàng?`
        : "Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?";

    // Handler cho nút xóa tất cả đã chọn ở footer
    const handleDeleteChecked = () => {
        if (checkedItemCount > 0) {
            setItemToDelete('checked');
            setIsModalOpen(true);
        }
    };


    return (
        <>
            {/* Modal Xác nhận Xóa */}
            <DeleteConfirmModal 
                isOpen={isModalOpen} 
                onConfirm={handleConfirmDelete} 
                onCancel={handleCancelDelete} 
                message={modalMessage}
            />

            {/* LOẠI BỎ CÁC THẺ LAYOUT THỪA */}
            <div className="container mx-auto p-4 md:p-6 bg-gray-50 min-h-[calc(100vh-100px)]">
                
                {/* Thanh tìm kiếm nhỏ cho giỏ hàng */}
                <div className="flex items-center justify-between mb-6 p-3 bg-white rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-800">Giỏ hàng của bạn</h2>
                    <div className="w-1/3 max-w-sm hidden md:block">
                        <div className="bg-white rounded-sm p-1 flex items-center shadow-inner border border-gray-200">
                            <input type="text" placeholder="Tìm kiếm trong Giỏ hàng" className="flex-1 px-3 py-1 text-sm text-gray-700 outline-none bg-transparent"/>
                            <button className="shopee-primary text-white rounded-sm px-4 py-1.5 hover:opacity-90 transition"><Search className="w-4 h-4" /></button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    <div className="lg:col-span-12 space-y-4">
                        
                        {/* Thanh Tiêu đề */}
                        <div className="hidden lg:grid grid-cols-12 bg-white rounded-t-lg shadow-sm p-4 text-sm font-semibold text-gray-600 border-b">
                            <div className="col-span-5 flex items-center">
                                <input 
                                    type="checkbox" 
                                    className="w-4 h-4 text-shopee-primary rounded border-gray-300 focus:ring-shopee-primary mr-3" 
                                    checked={isSelectAllChecked}
                                    onChange={handleSelectAll}
                                />
                                <span>Sản phẩm ({totalItemCount})</span>
                            </div>
                            <span className="col-span-2 text-center">Đơn giá</span>
                            <span className="col-span-2 text-center">Số lượng</span>
                            <span className="col-span-2 text-right">Thành tiền</span>
                            <span className="col-span-1 text-center">Thao tác</span>
                        </div>

                        {/* RENDER SẢN PHẨM THEO SHOP */}
                        {cartData.map(shop => (
                            <div key={shop.shopId} className="bg-white rounded-lg shadow-md overflow-hidden">
                                {/* Tên Shop Header */}
                                <div className="flex items-center p-4 border-b">
                                    <input 
                                        type="checkbox" 
                                        className="w-4 h-4 text-shopee-primary rounded border-gray-300 focus:ring-shopee-primary mr-3" 
                                        checked={shop.items.every(item => item.isChecked)}
                                        onChange={() => handleShopCheck(shop.shopId)}
                                    />
                                    <Store className="w-5 h-5 text-shopee-primary mr-2" />
                                    <span className="font-semibold text-gray-800">{shop.shopName}</span>
                                    <Link to="/chat">
                                        <button className="ml-4 border border-gray-300 text-gray-600 text-xs px-3 py-1 rounded-sm hover:bg-gray-50 transition">Chat ngay</button>
                                    </Link>
                                </div>
                                
                                {/* Danh sách Sản phẩm */}
                                {shop.items.map(item => (
                                    <CartItem
                                        key={item.id}
                                        item={item}
                                        shopId={shop.shopId}
                                        onQuantityChange={handleQuantityChange}
                                        onItemCheck={handleItemCheck}
                                        onInitiateDelete={handleInitiateDelete}
                                    />
                                ))}
                            </div>
                        ))}
                        
                        {cartData.length === 0 && (
                            <div className="text-center p-10 bg-white rounded-lg shadow-md text-gray-500">
                                <X className='w-12 h-12 mx-auto mb-4 text-gray-300'/>
                                Giỏ hàng của bạn đang trống. <Link to="/" className="text-shopee-primary hover:underline">Tiếp tục mua sắm!</Link>
                            </div>
                        )}
                        
                        {/* Thanh tổng kết cuối trang (Sticky Footer) */}
                        <div className={`sticky bottom-0 bg-white p-4 shadow-2xl rounded-lg border-t mt-6 ${cartData.length === 0 ? 'hidden' : ''}`}>
                            <div className="flex justify-between items-center text-sm mb-4">
                                <button className="flex items-center text-shopee-primary hover:opacity-90 font-medium">
                                    <Ticket className="w-4 h-4 mr-1" />
                                    Mã giảm giá Shopee
                                </button>
                                <div className="text-gray-700">
                                    Phí vận chuyển: <span className="text-shopee-primary font-bold">MIỄN PHÍ</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                {/* Chọn tất cả & Xóa */}
                                <div className="flex items-center space-x-4">
                                    <input 
                                        type="checkbox" 
                                        id="select-all" 
                                        className="w-4 h-4 text-shopee-primary rounded border-gray-300 focus:ring-shopee-primary" 
                                        checked={isSelectAllChecked}
                                        onChange={handleSelectAll}
                                    />
                                    <label htmlFor="select-all" className="text-sm cursor-pointer">Chọn tất cả ({totalItemCount})</label>
                                    <button 
                                        className="text-gray-500 hover:text-shopee-primary transition text-sm"
                                        onClick={handleDeleteChecked}
                                        disabled={checkedItemCount === 0}
                                    >
                                        Xóa ({checkedItemCount > 0 ? checkedItemCount : ''})
                                    </button>
                                </div>

                                {/* Tổng cộng & Thanh toán */}
                                <div className="flex items-center space-x-4">
                                    <span className="text-gray-700">Tổng thanh toán ({checkedItemCount} Sản phẩm):</span>
                                    <span id="grand-total" className="text-shopee-primary text-3xl font-bold">
                                        {formatCurrency(grandTotal)}
                                    </span>
                                    {/* Sử dụng Link để điều hướng đến route /payment */}
                                    <Link to="/payment"
                                        className={`text-white py-3 px-8 rounded-sm text-lg font-semibold transition flex items-center justify-center ${checkedItemCount > 0 ? 'shopee-primary hover:opacity-90' : 'bg-gray-400 cursor-not-allowed pointer-events-none'}`}
                                        onClick={(e) => checkedItemCount === 0 && e.preventDefault()}
                                    >
                                        MUA HÀNG
                                    </Link>
                                </div>
                            </div>
                        </div>

                    </div>
                    
                </div>
            </div>
        </>
    );
};
export default ShopCart;