import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Bổ sung Link
import { 
    Store, 
    MapPin, 
    Wallet, 
    Ticket, 
    X, 
    CheckCircle, 
    AlertTriangle, 
    CreditCard, 
    // THÊM CÁC ICON MỚI DƯỚI ĐÂY:
    BarChart2, 
    List, 
    ShoppingBag
} from 'lucide-react';

// Dữ liệu giả lập ban đầu
const initialProfiles = [
    { id: 1, name: "Nguyễn Văn A", address: "123 ABC, Q1, HCM", phone: "0901234567" }
];

const initialOrders = [
    { 
        id: 'ORDER1', shop: 'Shop 1', status: 'completed', total: 199000, 
        items: [{ name: "Quần Jean Nam Ống Rộng", variant: "Xám, size L", qty: 1, price: 199000, oldPrice: 199000, imgSrc: "https://placehold.co/80x80/2C3E50/FFFFFF?text=QUANJEAN" }] 
    },
    { 
        id: 'ORDER2', shop: 'Shop 2', status: 'completed', total: 118220, 
        items: [{ name: "Giày Sneaker Unisex viền gót vải tweed DG02", variant: "Trắng, size 37", qty: 1, price: 129000, oldPrice: 199000, imgSrc: "https://placehold.co/80x80/2C3E50/FFFFFF?text=SNEAKER" }] 
    },
    { 
        id: 'ORDER3', shop: 'Shop 3', status: 'completed', total: 49000, 
        items: [{ name: "Bếp Gốm Hồng Ngoại ZODAN G98 Đa Năng", variant: "Đen, 600W", qty: 1, price: 49000, oldPrice: 89000, imgSrc: "https://placehold.co/80x80/2C3E50/FFFFFF?text=BEPDIEN" }] 
    },
    { id: 'ORDER4', shop: 'Shop Tạm', status: 'pending', total: 100000, items: [{ name: "Sản phẩm chờ xác nhận", variant: "Đỏ, M", qty: 1, price: 100000, imgSrc: "https://placehold.co/80x80/FF0000/FFFFFF?text=PENDING" }] },
    { id: 'ORDER5', shop: 'Shop Hủy', status: 'cancelled', total: 50000, items: [{ name: "Sản phẩm đã hủy", variant: "Xanh, S", qty: 1, price: 50000, imgSrc: "https://placehold.co/80x80/0000FF/FFFFFF?text=CANCELLED" }] },
];

const formatCurrency = (number) => {
    if (number === undefined) return 'N/A';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number).replace('₫', '').trim() + '₫';
};

// Component Modal tùy chỉnh thay thế alert/confirm
const CustomConfirmation = ({ message, type, onConfirm, onCancel }) => {
    if (!message) return null;

    const isConfirm = type === 'confirm';
    const icon = isConfirm ? <AlertTriangle className="w-6 h-6 text-yellow-500 mr-2" /> : <CheckCircle className="w-6 h-6 text-shopee-primary mr-2" />;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
            <div className="bg-white p-6 rounded-lg shadow-2xl max-w-sm w-full relative">
                <div className="flex items-center mb-3">
                    {icon}
                    <h3 className="text-xl font-semibold text-gray-800">{isConfirm ? "Xác nhận" : "Thông báo"}</h3>
                </div>
                <p className="text-gray-700">{message}</p>
                <div className="mt-4 flex justify-end space-x-3">
                    {isConfirm && (
                        <button onClick={onCancel} className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400 transition">
                            Hủy
                        </button>
                    )}
                    <button 
                        onClick={onConfirm} 
                        className={`py-2 px-4 rounded transition ${isConfirm ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-shopee-primary text-white hover:opacity-90'}`}
                    >
                        {isConfirm ? "Xác nhận xóa" : "Đóng"}
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- Component Quản lý Hồ sơ (Địa chỉ) ---
const ProfileManagement = ({ setModal }) => {
    const [profiles, setProfiles] = useState(initialProfiles);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [formData, setFormData] = useState({ name: '', address: '', phone: '' });
    const [editingId, setEditingId] = useState(null);

    const showForm = (isEdit = false, profile = { name: '', address: '', phone: '' }) => {
        setFormData(profile);
        setEditingId(isEdit ? profile.id : null);
        setIsFormVisible(true);
    };

    const hideForm = () => {
        setIsFormVisible(false);
        setEditingId(null);
        setFormData({ name: '', address: '', phone: '' });
    };

    const handleSave = () => {
        if (!formData.name || !formData.address || !formData.phone) {
            setModal({ message: "Vui lòng điền đầy đủ thông tin!", type: 'alert' });
            return;
        }

        if (editingId !== null) {
            setProfiles(profiles.map(p => p.id === editingId ? { ...formData, id: editingId } : p));
            setModal({ message: "Cập nhật hồ sơ thành công.", type: 'alert' });
        } else {
            const newId = Math.max(...profiles.map(p => p.id), 0) + 1;
            setProfiles([...profiles, { ...formData, id: newId }]);
            setModal({ message: "Thêm hồ sơ mới thành công.", type: 'alert' });
        }
        hideForm();
    };

    const handleDelete = (id) => {
        setModal({
            message: "Bạn có chắc muốn xóa hồ sơ này?",
            type: 'confirm',
            onConfirm: () => {
                setProfiles(profiles.filter(p => p.id !== id));
                setModal(null); 
            },
            onCancel: () => setModal(null)
        });
    };

    const ProfileItem = ({ profile }) => (
        <div className="border rounded-lg p-4 shadow-sm flex flex-col gap-2 bg-white">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg text-shopee-primary">Địa chỉ {profile.id === 1 ? '(Mặc định)' : ''}</h3>
                <div className='space-x-2'>
                    <button onClick={() => showForm(true, profile)} className="text-blue-600 hover:underline text-sm">Sửa</button>
                    {profile.id !== 1 && ( // Không cho xóa địa chỉ mặc định
                         <button onClick={() => handleDelete(profile.id)} className="text-red-500 hover:underline text-sm">Xóa</button>
                    )}
                </div>
            </div>
            <p><span className="font-medium">Tên:</span> {profile.name}</p>
            <p><span className="font-medium">Địa chỉ:</span> {profile.address}</p>
            <p><span className="font-medium">SĐT:</span> {profile.phone}</p>
        </div>
    );

    return (
        <div id="left-content-address" className="left-content bg-white p-6 rounded-lg shadow min-h-[400px]">
            <div className="space-y-4">
                {profiles.map(p => <ProfileItem key={p.id} profile={p} />)}
            </div>

            <button
                id="add-profile-btn"
                onClick={() => showForm(false)}
                className="shopee-primary text-white px-4 py-2 rounded-lg hover:opacity-90 mt-4 font-semibold"
            >
                + Thêm hồ sơ mới
            </button>

            {isFormVisible && (
                <div id="profile-form" className="mt-6 border p-4 rounded-lg shadow bg-gray-50">
                    <h3 id="form-title" className="font-semibold text-lg mb-3">{editingId ? "Sửa hồ sơ" : "Thêm hồ sơ mới"}</h3>
                    <div className="flex flex-col gap-3">
                        <input type="text" placeholder="Tên"
                            className="border rounded px-3 py-2 focus:ring-shopee-primary focus:border-shopee-primary outline-none"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <input type="text" placeholder="Địa chỉ"
                            className="border rounded px-3 py-2 focus:ring-shopee-primary focus:border-shopee-primary outline-none"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                        <input type="text" placeholder="Số điện thoại"
                            className="border rounded px-3 py-2 focus:ring-shopee-primary focus:border-shopee-primary outline-none"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                        <div className="flex gap-2 mt-2">
                            <button onClick={handleSave}
                                className="bg-shopee-primary text-white px-4 py-2 rounded hover:opacity-90 font-semibold">
                                Lưu
                            </button>
                            <button onClick={hideForm}
                                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 font-semibold">
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Component Đơn hàng của tôi ---
const OrderItemDetail = ({ orderId, item }) => (
    <div className="grid grid-cols-12 p-4 border-b items-center">
        <div className="col-span-8 flex items-center space-x-3">
            {/* Sử dụng Link đến route /product/:itemId */}
            <Link to={`/product/${orderId}`} className="flex items-center space-x-3 hover:text-shopee-primary transition">
                <img src={item.imgSrc} alt={item.name} className="w-16 h-16 object-cover rounded-md border" />
                <div className="text-sm">
                    <p className="text-gray-800 line-clamp-2">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-1">Phân loại hàng: {item.variant}</p>
                    <p className="text-gray-800 line-clamp-2">x{item.qty}</p>
                </div>
            </Link>
        </div>
        
        <div className="col-span-4 flex justify-end items-center space-x-3">
            {item.oldPrice && (
                <div className="text-sm text-gray-500">
                    <del>{formatCurrency(item.oldPrice)}</del>
                </div>
            )}
            <div className="font-bold text-shopee-primary text-sm">
                {formatCurrency(item.price)}
            </div>
        </div>
    </div>
);



// --- Component Đơn hàng / Sản phẩm Shop của tôi ---
const OrderManagement = () => {
    const [activeOrderTab, setActiveOrderTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // --- STATE CHO SẢN PHẨM (TỪ BACKEND) ---
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [productError, setProductError] = useState('');
    const [productMessage, setProductMessage] = useState('');

    // --- STATE CHO FORM THÊM / SỬA SẢN PHẨM ---
    const [isAdding, setIsAdding] = useState(false);
    const [savingProduct, setSavingProduct] = useState(false);
    const [editingProductId, setEditingProductId] = useState(null); // null = thêm mới
    const [newProduct, setNewProduct] = useState({
        ten: '',
        so_luong: '',
        gia_ban: '',
        ma_danh_muc: '',
        ma_thuong_hieu: ''
    });

    // --- STATE MỚI CHO CHẾ ĐỘ XEM VÀ BÁO CÁO ---
    const [productViewMode, setProductViewMode] = useState('list'); // 'list', 'category_list', 'inventory_report'
    const [reportData, setReportData] = useState([]); // Dữ liệu cho các báo cáo
    // --- ĐƠN HÀNG GIẢ LẬP (CHO CÁC TAB KHÁC) ---
    const filteredOrdersByStatus =
        activeOrderTab === 'all'
            ? initialOrders
            : initialOrders.filter((order) => order.status === activeOrderTab);

    const searchLower = searchTerm.trim().toLowerCase();

    const filteredOrders = filteredOrdersByStatus.filter((order) => {
        if (!searchLower) return true;

        const matchOrderInfo =
            order.id.toLowerCase().includes(searchLower) ||
            order.shop.toLowerCase().includes(searchLower);

        const matchItems = order.items.some((item) =>
            item.name.toLowerCase().includes(searchLower)
        );

        return matchOrderInfo || matchItems;
    });

    // ================== GỌI BACKEND LẤY SẢN PHẨM ==================
    const loadProducts = async () => {
        setLoadingProducts(true);
        setProductError('');
        setProductMessage('');

        try {
            const shopId = 1;       // fix cứng shop 1 (sau này lấy từ context / login)
            const categoryId = 1;   // fix cứng danh mục 1

            const res = await fetch(
                `http://localhost:3001/api/products?shop_id=${shopId}&category_id=${categoryId}`
            );
            const data = await res.json();

            if (!data.success) {
                throw new Error(data.message || 'Không tải được danh sách sản phẩm');
            }

            setProducts(data.data || []);
        } catch (err) {
            console.error('Lỗi gọi API /api/products:', err);
            setProductError(err.message || 'Không kết nối được tới server backend');
        } finally {
            setLoadingProducts(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    // ================== LỌC SẢN PHẨM TỪ BACKEND ==================
    const filteredProducts = products.filter((prod) => {
        if (!searchLower) return true;

        const ma = String(prod.MaSanPham || '').toLowerCase();
        const ten = String((prod.TenSanPham || prod.Ten || '')).toLowerCase();
        const dm = String((prod.TenDanhMuc || prod.MaDanhMuc || '')).toLowerCase();
        const shop = String((prod.TenShop || prod.MaShop || '')).toLowerCase();

        return (
            ma.includes(searchLower) ||
            ten.includes(searchLower) ||
            dm.includes(searchLower) ||
            shop.includes(searchLower)
        );
    });

    // ================== SUBMIT THÊM / SỬA SẢN PHẨM ==================
    const handleAddProductSubmit = async (e) => {
        e.preventDefault();
        setProductError('');
        setProductMessage('');

        const payload = {
            shop_id: 1, // tạm fix shop_id = 1
            ten: newProduct.ten.trim(),
            so_luong: Number(newProduct.so_luong),
            gia_ban: Number(newProduct.gia_ban),
            ma_danh_muc: Number(newProduct.ma_danh_muc),
            ma_thuong_hieu: Number(newProduct.ma_thuong_hieu)
        };

        if (
            !payload.ten ||
            Number.isNaN(payload.so_luong) ||
            Number.isNaN(payload.gia_ban) ||
            Number.isNaN(payload.ma_danh_muc) ||
            Number.isNaN(payload.ma_thuong_hieu)
        ) {
            setProductError('Vui lòng nhập đầy đủ và đúng định dạng các trường.');
            return;
        }

        try {
            setSavingProduct(true);

            const url =
                editingProductId === null
                    ? 'http://localhost:3001/api/products'
                    : `http://localhost:3001/api/products/${editingProductId}`;

            const method = editingProductId === null ? 'POST' : 'PUT';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!data.success) {
                throw new Error(data.message || 'Lưu sản phẩm thất bại');
            }

            setProductMessage(
                editingProductId === null
                    ? 'Thêm sản phẩm thành công.'
                    : 'Cập nhật sản phẩm thành công.'
            );

            // reset form
            setIsAdding(false);
            setEditingProductId(null);
            setNewProduct({
                ten: '',
                so_luong: '',
                gia_ban: '',
                ma_danh_muc: '',
                ma_thuong_hieu: ''
            });

            await loadProducts();
        } catch (err) {
            console.error('Lỗi lưu sản phẩm:', err);
            setProductError(err.message || 'Không thể lưu sản phẩm');
        } finally {
            setSavingProduct(false);
        }
    };

    // ================== MỞ FORM SỬA 1 SẢN PHẨM ==================
    const handleEditProductClick = (prod) => {
        setIsAdding(true);
        setProductError('');
        setProductMessage('');
        setEditingProductId(prod.MaSanPham);

        setNewProduct({
            ten: prod.TenSanPham || prod.Ten || '',
            so_luong: prod.SoLuong ?? '',
            gia_ban: prod.GiaBan ?? '',
            ma_danh_muc: prod.MaDanhMuc ?? '',
            ma_thuong_hieu: prod.MaThuongHieu ?? ''
        });
    };

    // ================== XÓA 1 SẢN PHẨM ==================
    const handleDeleteProductClick = async (prod) => {
        if (!window.confirm(`Bạn có chắc muốn xóa sản phẩm "${prod.TenSanPham || prod.Ten}"?`)) {
            return;
        }

        setProductError('');
        setProductMessage('');

        try {
            const shopId = 1; // tạm thời fix shop_id = 1
            const res = await fetch(
                `http://localhost:3001/api/products/${prod.MaSanPham}?shop_id=${shopId}`,
                { method: 'DELETE' }
            );

            const data = await res.json();
            if (!data.success) {
                throw new Error(data.message || 'Xóa sản phẩm thất bại');
            }

            setProductMessage('Xóa sản phẩm thành công.');
            await loadProducts();
        } catch (err) {
            console.error('Lỗi DELETE /api/products/:id:', err);
            setProductError(err.message || 'Không thể xóa sản phẩm.');
        }
    };

    // ================== THỐNG KÊ TỒN KHO ==================
    const handleViewInventoryReport = async () => {
        const minTotal = prompt("Nhập ngưỡng Số lượng tồn tối thiểu (MinTotal) (Ví dụ: 5):");
        if (!minTotal || isNaN(Number(minTotal))) {
            setProductError('Vui lòng nhập Số lượng tồn tối thiểu là một số hợp lệ.');
            return;
        }

        // Reset form thêm/sửa, chuyển chế độ xem
        setIsAdding(false);
        setProductError('');
        setProductMessage('');
        setProductViewMode('inventory_report');
        setLoadingProducts(true);
        setReportData([]);

        const shopId = 1; // Tạm fix shop_id = 1

        try {
            // Gọi API Thống kê tồn kho theo Danh mục
            const url = `http://localhost:3001/api/report/inventory?shop_id=${shopId}&min_total=${minTotal}`;
            const res = await fetch(url);

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || `Lỗi tải báo cáo tồn kho: HTTP ${res.status}`);
            }
            
            const data = await res.json();
            if (!data.success) {
                throw new Error(data.message || 'Không tải được báo cáo tồn kho');
            }
            
            // Lưu dữ liệu báo cáo (dạng tổng hợp)
            setReportData(data.data || []);
            setProductMessage(`Đã tải thống kê tồn kho theo danh mục với số lượng tối thiểu > ${minTotal}.`);
        } catch (err) {
            console.error('Lỗi gọi API /api/report/inventory:', err);
            setProductError(err.message || 'Không thể tải báo cáo tồn kho.');
            setReportData([]);
        } finally {
            setLoadingProducts(false);
        }
    };
    
    // ================== LIỆT KÊ THEO DANH MỤC ==================
    const handleViewCategoryProducts = async () => {
    
        // 1. Lấy và kiểm tra dữ liệu đầu vào (categoryId) trước khi reset state
        const category_Id = prompt("Nhập Mã Danh Mục (MaDanhMuc) cần liệt kê:"); 
        if (!category_Id || isNaN(Number(category_Id))) {
            setProductError('Vui lòng nhập Mã Danh Mục là một số hợp lệ.');
            return; // Dừng lại nếu người dùng không nhập hoặc nhập sai
        }
        
        // Reset form thêm/sửa, chuyển chế độ xem
        setIsAdding(false);
        setProductError('');
        setProductMessage('');
        setProductViewMode('category_list');
        setLoadingProducts(true);
        setReportData([]);

        const shopId = 1; // Tạm fix shop_id = 1
        const categoryId = Number(category_Id); // Chuyển sang số
        try {
            
            // 2. ĐỊNH NGHĨA BIẾN URL TRƯỚC KHI GỌI FETCH
            // Đảm bảo sử dụng đúng tên query parameter mà backend mong muốn (ma_shop, ma_danh_muc)
            const url = `http://localhost:3001/api/report/list?ma_shop=${shopId}&ma_danh_muc=${categoryId}`;

            // Gọi API Liệt kê sản phẩm theo Danh mục
            const res = await fetch(url);
            
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || `Lỗi tải sản phẩm theo danh mục: HTTP ${res.status}`);
            }

            const data = await res.json();

            if (!data.success) {
                throw new Error(data.message || 'Không tải được danh sách sản phẩm theo danh mục');
            }

            // Lưu dữ liệu sản phẩm vào reportData để hiển thị ở chế độ category_list
            setReportData(data.data || []);
            setProductMessage(`Đã tải ${data.data.length} sản phẩm thuộc Danh mục #${categoryId}.`);
        } catch (err) {
            console.error('Lỗi gọi API /api/products (theo DM):', err);
            setProductError(err.message || 'Không thể tải sản phẩm theo danh mục.');
            setReportData([]);
        } finally {
            setLoadingProducts(false);
        }
    };
    
    // ================== HÀM RENDER NỘI DUNG CHÍNH (THAY THẾ PHẦN LIST SẢN PHẨM) ==================
    const renderProductContent = () => {
        if (loadingProducts) {
            return <p className="text-gray-500 text-center">Đang tải dữ liệu...</p>;
        }

        if (productError && !isAdding) {
            return <p className="text-red-500 text-center">{productError}</p>;
        }
        
        // Chế độ Liệt kê theo Danh mục (dùng reportData)
        if (productViewMode === 'category_list') {
            if (reportData.length === 0) return <p className="text-gray-500 text-center">Không tìm thấy sản phẩm nào trong danh mục này.</p>;

            return (
                <div className="space-y-3">
                    <h4 className="font-semibold text-gray-700">Kết quả Liệt kê theo Danh mục</h4>
                    {reportData.map((prod) => (
                        <div key={prod.MaSanPham} className="border rounded-lg p-4 flex items-center justify-between bg-white shadow-sm hover:border-indigo-400 transition">
                            <div>
                                <p className="font-semibold text-gray-800">
                                    {prod.TenSanPham || prod.Ten || `Sản phẩm #${prod.MaSanPham}`}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Mã sản phẩm: {prod.MaSanPham} • Danh mục:{' '}
                                    <span className='font-medium text-indigo-600'>{prod.TenDanhMuc || prod.MaDanhMuc || '—'}</span>
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-600">Số lượng: <span className="font-semibold text-red-500">{prod.SoLuong}</span></p>
                                <p className="text-sm text-shopee-primary font-bold mt-1">{formatCurrency(prod.GiaBan)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        // Chế độ Thống kê Tồn kho (dùng reportData)
        if (productViewMode === 'inventory_report') {
            if (reportData.length === 0) return <p className="text-gray-500 text-center">Không có danh mục nào có số lượng tồn kho đạt ngưỡng.</p>;
            
            return (
                <div className="overflow-x-auto">
                    <h4 className="font-semibold text-gray-700 mb-2">Báo cáo Tổng hợp Tồn kho theo Danh mục</h4>
                    <table className="min-w-full divide-y divide-gray-200 shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-shopee-primary text-white">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Mã Danh Mục</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Tên Danh Mục</th>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Tổng Số Lượng Tồn</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {/* Lưu ý: API của bạn trả về rows[0], giả sử các trường là MaDanhMuc, TenDanhMuc, TongSoLuong */}
                            {reportData.map((row, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.MaDanhMuc}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.TenDanhMuc || 'Không tên'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right text-red-600">{row.TongSoLuong}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }

        // Chế độ Danh sách Sản phẩm Mặc định ('list' - sử dụng logic cũ)
        if (filteredProducts.length === 0) {
            return <p className="text-gray-500 text-center">Chưa có sản phẩm nào trong shop.</p>;
        }
        
        return (
            <div className="space-y-3">
                <h4 className="font-semibold text-gray-700">Danh sách Sản phẩm Chi tiết</h4>
                {filteredProducts.map((prod) => (
                    <div
                        key={prod.MaSanPham}
                        className="border rounded-lg p-4 flex items-center justify-between bg-white shadow-sm"
                    >
                        <div>
                            <Link 
                                to={`/product/${prod.MaSanPham}`}
                                // THÊM: Truyền toàn bộ object sản phẩm vào state của router
                                state={{ productDB: prod }} 
                                className="text-gray-800 hover:text-shopee-primary transition"
                            >
                                <p className="font-semibold">
                                    {prod.TenSanPham || prod.Ten || `Sản phẩm #${prod.MaSanPham}`}
                                </p>
                            </Link>
                            <p className="text-xs text-gray-500 mt-1">
                                Mã Shop: {prod.MaShop} • Mã sản phẩm: {prod.MaSanPham}
                                <br/>
                                Mã danh mục: {prod.MaDanhMuc} • Mã thương hiệu: {prod.MaThuongHieu}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-600">
                                Số lượng:{' '}
                                <span className="font-semibold">
                                    {prod.SoLuong}
                                </span>
                            </p>
                            <p className="text-sm text-shopee-primary font-bold mt-1">
                                {formatCurrency(prod.GiaBan)}
                            </p>
                            <div className="mt-2 flex gap-2 justify-end">
                                <button
                                    type="button"
                                    onClick={() => handleEditProductClick(prod)}
                                    className="text-xs px-3 py-1 rounded border border-blue-500 text-blue-500 hover:bg-blue-50"
                                >
                                    Sửa
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDeleteProductClick(prod)}
                                    className="text-xs px-3 py-1 rounded border border-red-500 text-red-500 hover:bg-red-50"
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    const getStatusText = (status) => {
        switch (status) {
            case 'pending':
                return 'CHỜ XÁC NHẬN';
            case 'waiting':
                return 'CHỜ LẤY HÀNG';
            case 'shipping':
                return 'ĐANG GIAO';
            case 'completed':
                return 'HOÀN THÀNH';
            case 'cancelled':
                return 'ĐÃ HỦY';
            default:
                return 'TẤT CẢ';
        }
    };

    const activeTabStyle =
        'text-shopee-primary border-b-2 border-shopee-primary bg-white';
    const inactiveTabStyle = 'hover:text-shopee-primary transition';

    return (
        <div
            id="left-content-orders"
            className="left-content bg-white rounded-lg shadow lg:col-span-12 space-y-4"
        >
            {/* Thanh Tab Đơn hàng / Quản lý */}
            <div className="grid grid-cols-6 bg-gray-100 text-sm font-semibold text-gray-600 border-b border-gray-200 rounded-t-lg overflow-hidden">
                {['all', 'pending', 'waiting', 'shipping', 'completed', 'cancelled'].map(
                    (tab) => (
                        <div
                            key={tab}
                            className={`text-center cursor-pointer p-4 transition ${
                                activeOrderTab === tab ? activeTabStyle : inactiveTabStyle
                            }`}
                            onClick={() => setActiveOrderTab(tab)}
                        >
                            {getStatusText(tab)}
                        </div>
                    )
                )}
            </div>

            {/* Thanh search dùng chung */}
            <div className="border-t bg-white px-4 py-3 flex items-center justify-between">
                <span className="text-sm text-gray-600 hidden sm:block">
                    Tìm theo mã, tên shop hoặc tên sản phẩm:
                </span>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Nhập từ khóa tìm kiếm..."
                    className="w-full sm:w-80 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-shopee-primary focus:border-shopee-primary"
                />
            </div>

            {/* Nội dung chính */}
            <div className="space-y-6 p-4">
                {activeOrderTab === 'all' ? (
                    <>
                        {/* TIÊU ĐỀ + NÚT THÊM SẢN PHẨM */}
                        {/* TIÊU ĐỀ + NÚT THÊM/SỬA SẢN PHẨM + NÚT BÁO CÁO (ĐÃ CẬP NHẬT) */}
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                            <h3 className="font-semibold text-gray-700 text-base">
                                {productViewMode === 'list' && 'Quản lý Sản phẩm'}
                                {productViewMode === 'category_list' && 'Liệt kê Sản phẩm theo Danh mục'}
                                {productViewMode === 'inventory_report' && 'Thống kê Tồn kho'}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={handleViewInventoryReport}
                                    className="bg-purple-500 text-white text-sm px-4 py-2 rounded-md hover:bg-purple-600 transition shadow flex items-center"
                                >
                                    <BarChart2 className='w-4 h-4 mr-1'/> Thống kê Tồn kho
                                </button>
                                <button
                                    type="button"
                                    onClick={handleViewCategoryProducts}
                                    className="bg-indigo-500 text-white text-sm px-4 py-2 rounded-md hover:bg-indigo-600 transition shadow flex items-center"
                                >
                                    <List className='w-4 h-4 mr-1'/> Liệt kê theo Danh mục
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        // Toggle form thêm/sửa, reset về chế độ list
                                        setIsAdding(!isAdding);
                                        setEditingProductId(null);
                                        setProductViewMode('list'); 
                                        if (productViewMode !== 'list') loadProducts(); // Tải lại list nếu đang ở chế độ báo cáo
                                    }}
                                    className="bg-shopee-primary text-white text-sm px-4 py-2 rounded-md hover:opacity-90 transition shadow flex items-center"
                                >
                                    <ShoppingBag className='w-4 h-4 mr-1'/>
                                    {isAdding
                                        ? editingProductId
                                            ? 'Đóng form sửa'
                                            : 'Đóng form thêm'
                                        : '+ Thêm sản phẩm'}
                                </button>
                            </div>
                        </div>

                        {/* FORM THÊM / SỬA SẢN PHẨM */}
                        {isAdding && (
                            <form
                                onSubmit={handleAddProductSubmit}
                                className="border rounded-lg p-4 bg-gray-50 mb-4 space-y-3"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-gray-600">
                                            Tên sản phẩm
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full border px-3 py-2 rounded mt-1 focus:ring-shopee-primary focus:border-shopee-primary outline-none"
                                            value={newProduct.ten}
                                            onChange={(e) =>
                                                setNewProduct((p) => ({
                                                    ...p,
                                                    ten: e.target.value
                                                }))
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">
                                            Giá bán (VND)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            className="w-full border px-3 py-2 rounded mt-1 focus:ring-shopee-primary focus:border-shopee-primary outline-none"
                                            value={newProduct.gia_ban}
                                            onChange={(e) =>
                                                setNewProduct((p) => ({
                                                    ...p,
                                                    gia_ban: e.target.value
                                                }))
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">
                                            Số lượng
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            className="w-full border px-3 py-2 rounded mt-1 focus:ring-shopee-primary focus:border-shopee-primary outline-none"
                                            value={newProduct.so_luong}
                                            onChange={(e) =>
                                                setNewProduct((p) => ({
                                                    ...p,
                                                    so_luong: e.target.value
                                                }))
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">
                                            Mã danh mục
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            className="w-full border px-3 py-2 rounded mt-1 focus:ring-shopee-primary focus:border-shopee-primary outline-none"
                                            value={newProduct.ma_danh_muc}
                                            onChange={(e) =>
                                                setNewProduct((p) => ({
                                                    ...p,
                                                    ma_danh_muc: e.target.value
                                                }))
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">
                                            Mã thương hiệu
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            className="w-full border px-3 py-2 rounded mt-1 focus:ring-shopee-primary focus:border-shopee-primary outline-none"
                                            value={newProduct.ma_thuong_hieu}
                                            onChange={(e) =>
                                                setNewProduct((p) => ({
                                                    ...p,
                                                    ma_thuong_hieu: e.target.value
                                                }))
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mt-2">
                                    <button
                                        type="submit"
                                        disabled={savingProduct}
                                        className="bg-shopee-primary text-white px-5 py-2 rounded font-semibold hover:opacity-90 disabled:opacity-60"
                                    >
                                        {savingProduct
                                            ? 'Đang lưu...'
                                            : editingProductId
                                                ? 'Cập nhật sản phẩm'
                                                : 'Lưu sản phẩm'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsAdding(false);
                                            setEditingProductId(null);
                                            setNewProduct({
                                                ten: '',
                                                so_luong: '',
                                                gia_ban: '',
                                                ma_danh_muc: '',
                                                ma_thuong_hieu: ''
                                            });
                                        }}
                                        className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 font-semibold"
                                    >
                                        Hủy
                                    </button>
                                </div>

                                {/* Thông báo lỗi / thành công */}
                                {productError && (
                                    <p className="text-sm text-red-500 mt-2">
                                        {productError}
                                    </p>
                                )}
                                {productMessage && (
                                    <p className="text-sm text-green-600 mt-2">
                                        {productMessage}
                                    </p>
                                )}
                            </form>
                        )}

                        {/* LIST SẢN PHẨM TỪ BACKEND */}
                        {renderProductContent()}
                    </>
                ) : (
                    <>
                        {/* CÁC TAB KHÁC VẪN DÙNG initialOrders GIẢ LẬP */}
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="bg-white rounded-lg shadow-md overflow-hidden border"
                                >
                                    {/* Tên Shop & Trạng thái */}
                                    <div className="flex items-center p-4 border-b bg-gray-50">
                                        <Store className="w-5 h-5 text-shopee-primary mr-2" />
                                        <span className="font-semibold text-gray-800">
                                            {order.shop}
                                        </span>
                                        <span className="ml-auto font-bold text-shopee-primary text-sm">
                                            {getStatusText(order.status)}
                                        </span>
                                    </div>

                                    {/* Danh sách Sản phẩm trong đơn (giả lập) */}
                                    {order.items.map((item, index) => (
                                        <OrderItemDetail
                                            key={index}
                                            item={item}
                                            orderId={order.id + index}
                                        />
                                    ))}

                                    {/* Thành tiền */}
                                    <div className="col-span-12 flex justify-end items-center p-4 bg-gray-50/50 border-t">
                                        <span className="text-sm mr-2 text-gray-600">
                                            Thành tiền:
                                        </span>
                                        <span className="font-bold text-shopee-primary text-2xl">
                                            {formatCurrency(order.total)}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center">
                                Không có đơn hàng nào trong mục{' '}
                                {getStatusText(activeOrderTab)}.
                            </p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};



// --- Component Tài khoản (Thông tin chung) ---
const ProfileDetails = () => (
    <div id="left-content-profile" className="left-content bg-white p-6 rounded-lg shadow min-h-[400px]">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Thông tin cá nhân</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Các trường input */}
            <div>
                <label className="text-sm text-gray-600">Họ và tên</label>
                <input type="text" className="w-full border px-3 py-2 rounded mt-1 focus:ring-shopee-primary focus:border-shopee-primary outline-none" defaultValue="Nguyễn Văn A" />
            </div>
            <div>
                <label className="text-sm text-gray-600">Email</label>
                <input type="email" className="w-full border px-3 py-2 rounded mt-1 bg-gray-100 text-gray-500" defaultValue="email@example.com" readOnly />
            </div>
            <div>
                <label className="text-sm text-gray-600">CCCD</label>
                <input type="text" className="w-full border px-3 py-2 rounded mt-1 bg-gray-100 text-gray-500" defaultValue="123456789012" readOnly />
            </div>
            <div>
                <label className="text-sm text-gray-600">Số điện thoại</label>
                <input type="text" className="w-full border px-3 py-2 rounded mt-1 bg-gray-100 text-gray-500" defaultValue="0123456789" readOnly />
            </div>
            <div>
                <label className="text-sm text-gray-600">Giới tính</label>
                <select className="w-full border px-3 py-2 rounded mt-1 focus:ring-shopee-primary focus:border-shopee-primary outline-none">
                    <option defaultValue>Nam</option>
                    <option>Nữ</option>
                    <option>Khác</option>
                </select>
            </div>
            <div>
                <label className="text-sm text-gray-600">Ngày sinh</label>
                <input type="date" className="w-full border px-3 py-2 rounded mt-1 focus:ring-shopee-primary focus:border-shopee-primary outline-none" defaultValue="2000-01-01" />
            </div>
        </div>

        <button className="bg-shopee-primary text-white px-6 py-2 rounded mt-5 hover:opacity-90 transition font-semibold">
            Lưu thay đổi
        </button>
    </div>
);

// --- Component Ngân hàng ---
const BankManagement = () => (
    <div id="left-content-bank" className="left-content bg-white p-6 rounded-lg shadow min-h-[400px]">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Tài khoản ngân hàng</h2>

        {/* Danh sách tài khoản hiện có */}
        <div className="border border-green-500 bg-green-50 rounded p-4 mb-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-semibold text-green-700">Vietcombank</p>
                    <p className="text-gray-600 text-sm">Số tài khoản: 0123 456 789</p>
                    <p className="text-gray-600 text-sm">Tên chủ tài khoản: Nguyễn Văn A</p>
                </div>
                <button className="text-sm text-red-500 hover:underline">Xóa</button>
            </div>
        </div>
        
        <h3 className="font-semibold text-gray-700 mb-3 border-t pt-4">Liên kết ngân hàng mới</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="text-sm text-gray-600">Ngân hàng</label>
                <select className="w-full border px-3 py-2 rounded mt-1 focus:ring-shopee-primary focus:border-shopee-primary outline-none">
                    <option>Vietcombank</option>
                    <option>Techcombank</option>
                    <option>MB Bank</option>
                    <option>ACB</option>
                    <option>VPBank</option>
                </select>
            </div>
            <div>
                <label className="text-sm text-gray-600">Số tài khoản</label>
                <input type="text" className="w-full border px-3 py-2 rounded mt-1 focus:ring-shopee-primary focus:border-shopee-primary outline-none" />
            </div>
            <div className='md:col-span-2'>
                <label className="text-sm text-gray-600">Tên chủ tài khoản</label>
                <input type="text" className="w-full border px-3 py-2 rounded mt-1 focus:ring-shopee-primary focus:border-shopee-primary outline-none" />
            </div>
        </div>

        <button className="bg-shopee-primary text-white px-6 py-2 rounded mt-5 hover:opacity-90 transition font-semibold">
            <CreditCard className='w-5 h-5 mr-2 inline' /> Liên kết tài khoản
        </button>
    </div>
);

// --- Component Voucher ---
const VoucherManagement = () => (
    <div id="left-content-voucher" className="left-content bg-white p-6 rounded-lg shadow min-h-[400px]">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Thông tin shop</h2>
        <div id="left-content-shopinfo" className="left-content bg-white p-6 rounded-lg shadow min-h-[400px]">
            
            <div>
                <label className="text-sm text-gray-600">Mã shop</label>
                <input type="text" className="w-full border px-3 py-2 rounded mt-1 focus:ring-shopee-primary focus:border-shopee-primary outline-none" defaultValue="1" />
            </div>
            <div>
                <label className="text-sm text-gray-600">Tên shop</label>
                <input type="email" className="w-full border px-3 py-2 rounded mt-1 bg-gray-100 text-gray-500" defaultValue="Shop A" readOnly />
            </div>
            <div>
                <label className="text-sm text-gray-600">CCCD</label>
                <input type="text" className="w-full border px-3 py-2 rounded mt-1 bg-gray-100 text-gray-500" defaultValue="012345678901" readOnly />
            </div>
            <div>
                <label className="text-sm text-gray-600">Địa chỉ</label>
                <input type="text" className="w-full border px-3 py-2 rounded mt-1 bg-gray-100 text-gray-500" defaultValue="123 Nguyễn Huệ, Quận 1, TP.HCM" readOnly />
            </div>
            <div>
                <label className="text-sm text-gray-600">Ngày mở cửa</label>
                <input type="text" className="w-full border px-3 py-2 rounded mt-1 bg-gray-100 text-gray-500" defaultValue="01/01/2020" readOnly />
            </div>
        </div>
    </div>
);

// --- Component Tổng Hợp (App) ---
const Profile = () => {
    const [activeTab, setActiveTab] = useState('orders'); // Mặc định hiển thị tab Đơn hàng
    const [modal, setModal] = useState(null); // State cho modal

    const renderContent = () => {
        switch (activeTab) {
            case 'info': return <ProfileDetails />;
            case 'profile': return <ProfileManagement setModal={setModal} />; // Truyền setModal
            case 'bank': return <BankManagement />;
            case 'shopinfo': return <VoucherManagement />;
            case 'shop': return <OrderManagement />;
            default: return <OrderManagement />;
        }
    };
    
    // Loai bỏ useEffect để tránh lỗi re-render không cần thiết
    // useEffect(() => { setActiveTab('orders'); }, []);

    return (
        <>
            {/* Hiển thị Modal/Alert nếu có */}
            {modal && (
                <CustomConfirmation 
                    message={modal.message}
                    type={modal.type}
                    onConfirm={modal.onConfirm || (() => setModal(null))}
                    onCancel={modal.onCancel}
                />
            )}

            {/* LOẠI BỎ DIV CHUNG VÀ HEADER/FOOTER VÌ ĐÃ CÓ LAYOUT.JSX XỬ LÝ */}
            <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-gray-50">
                {/* Cột trái: Menu tài khoản */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-lg shadow p-6 space-y-4 sticky top-4">
                        <div className="flex items-center space-x-3 border-b pb-4">
                            <img src="https://placehold.co/60x60/EE4D2D/FFFFFF?text=A" className="w-12 h-12 rounded-full border-2 border-shopee-primary" alt="Ảnh đại diện" />
                            <div>
                                <p className="font-semibold text-gray-800">Nguyễn Văn A</p>
                                <p className="text-sm text-shopee-primary hover:underline cursor-pointer" onClick={() => setActiveTab('profile')}>Sửa hồ sơ</p>
                            </div>
                        </div>

                        <div className="space-y-3 text-sm">
                            {[
                                { key: 'info', label: 'Thông tin cá nhân', icon: X},
                                { key: 'profile', label: 'Hồ sơ', icon: X },
                                { key: 'bank', label: 'Ngân hàng', icon: X},
                                { key: 'shopinfo', label: 'Thông tin shop', icon: X},
                                { key: 'shop', label: 'Shop của tôi', icon: X},
                            ].map(({ key, label, icon: Icon }) => (
                                <p 
                                    key={key}
                                    className={`flex items-center py-2 px-3 rounded-md cursor-pointer transition 
                                        ${activeTab === key ? 'text-shopee-primary bg-red-50 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
                                    onClick={() => setActiveTab(key)}
                                >
                                    <Icon className='w-4 h-4 mr-2' />
                                    {label}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Cột phải: Nội dung */}
                <div className="lg:col-span-9 space-y-4">
                    {renderContent()}
                </div>
            </div>
        </>
    );
};

export default Profile;