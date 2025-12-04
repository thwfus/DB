import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Ticket, Store, ChevronLeft } from 'lucide-react';

const VoucherPage = () => {
    const navigate = useNavigate();
    
    // --- STATE QUẢN LÝ ---
    const [manualCode, setManualCode] = useState('');
    const [codeMessage, setCodeMessage] = useState({ text: '', type: '' }); // type: 'success' | 'error'
    
    // State cho voucher được chọn
    const [selectedShopeeVoucher, setSelectedShopeeVoucher] = useState(null); // Chỉ chọn 1 (Radio)
    const [selectedShopVouchers, setSelectedShopVouchers] = useState([]); // Chọn nhiều (Checkbox)

    // --- MOCK DATA ---
    const shopeeVouchers = [
        { id: 'sp1', value: 50000, label: 'Giảm 50.000₫', sub: 'Cho đơn hàng từ 500.000₫. Hạn dùng 30/12/2025.', disabled: false },
        { id: 'sp2', value: 0.1, label: 'Giảm 10% (Tối đa 30K)', sub: 'Áp dụng cho mọi sản phẩm. Hạn dùng 30/12/2025.', disabled: false },
        { id: 'sp3', value: 0, label: 'Giảm 10.000₫', sub: 'Không đủ điều kiện áp dụng cho đơn hàng này.', disabled: true }
    ];

    const shopVouchers = [
        { id: 'shop1', value: 10000, label: 'Giảm 10.000₫ cho shop A', sub: 'Cho đơn hàng từ 150.000₫. Hạn dùng 30/12/2025.', disabled: false }
    ];

    // --- LOGIC XỬ LÝ ---

    // 1. Nhập mã thủ công
    const handleApplyManualCode = () => {
        if (!manualCode.trim()) return;
        
        if (manualCode.toUpperCase() === 'SHOPEE50K') {
            setCodeMessage({ text: 'Mã SHOPEE50K đã được thêm vào Kho voucher.', type: 'success' });
        } else {
            setCodeMessage({ text: 'Mã không hợp lệ hoặc không áp dụng được.', type: 'error' });
        }
    };

    // 2. Chọn Voucher Shopee (Radio - Single select)
    const toggleShopeeVoucher = (id) => {
        if (selectedShopeeVoucher === id) {
            setSelectedShopeeVoucher(null); // Bỏ chọn nếu click lại
        } else {
            setSelectedShopeeVoucher(id);
        }
    };

    // 3. Chọn Voucher Shop (Checkbox - Multi select)
    const toggleShopVoucher = (id) => {
        if (selectedShopVouchers.includes(id)) {
            setSelectedShopVouchers(prev => prev.filter(vId => vId !== id));
        } else {
            setSelectedShopVouchers(prev => [...prev, id]);
        }
    };

    // 4. Tính tổng số lượng đã chọn
    const totalSelected = (selectedShopeeVoucher ? 1 : 0) + selectedShopVouchers.length;

    // 5. Xác nhận áp dụng
    const handleConfirmApply = () => {
        // Trong thực tế: Lưu vào Context/Redux hoặc truyền params
        console.log("--- ÁP DỤNG VOUCHER ---");
        console.log("Shopee Voucher:", selectedShopeeVoucher);
        console.log("Shop Vouchers:", selectedShopVouchers);
        navigate('/payment');
    };

    // --- STYLES CSS (Giả lập CSS trong JSX) ---
    // CSS riêng cho hiệu ứng răng cưa (Sawtooth border) đặc trưng của voucher
    const voucherClipStyle = `
        .shopee-voucher-clip {
            position: relative;
            background-color: #fef8f8;
            border: 1px dashed #EE4D2D;
        }
        .shopee-voucher-clip:before, .shopee-voucher-clip:after {
            content: '';
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 16px;
            height: 16px;
            background-color: #f9fafb; /* Trùng màu nền body */
            border-radius: 50%;
            border: 1px solid #EE4D2D;
            z-index: 1;
        }
        .shopee-voucher-clip:before { left: -9px; border-right-color: transparent; border-top-color: transparent; transform: translateY(-50%) rotate(45deg); }
        .shopee-voucher-clip:after { right: -9px; border-left-color: transparent; border-bottom-color: transparent; transform: translateY(-50%) rotate(45deg); }
        
        /* Ẩn viền tròn đè lên để tạo cảm giác răng cưa mượt hơn */
        .shopee-voucher-clip:before { border: 1px solid #EE4D2D; background: #f9fafb; } 
    `;

    return (
        <div className="min-h-screen flex flex-col font-sans bg-gray-50">
            <style>{voucherClipStyle}</style>

            {/* 1. HEADER */}
            <header className="bg-[#EE4D2D] shadow-md sticky top-0 z-50">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center text-white">
                        <Link to="/payment" className="mr-4 md:hidden"><ChevronLeft className="w-6 h-6" /></Link>
                        <h1 className="text-xl md:text-2xl font-normal border-r border-white/50 pr-4 mr-4 hidden md:block">SHOPEE VOUCHER</h1>
                        <span className="text-lg md:text-xl font-medium">Chọn Voucher</span>
                    </div>
                    {/* Search Bar nhỏ (Ẩn trên mobile quá nhỏ) */}
                    <div className="hidden md:block w-1/3">
                        <div className="bg-white rounded-sm p-1 flex items-center shadow-md">
                            <input type="text" placeholder="Tìm voucher..." className="flex-1 px-3 py-1 text-sm text-gray-700 outline-none bg-transparent"/>
                            <button className="bg-[#EE4D2D] text-white rounded-sm px-4 py-1.5 hover:opacity-90"><Search className="w-4 h-4" /></button>
                        </div>
                    </div>
                </div>
            </header>

            {/* 2. MAIN CONTENT */}
            <main className="flex-grow container mx-auto p-4 md:p-6 max-w-4xl">
                
                {/* Nhập mã thủ công */}
                <section className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-4">
                    <h2 className="text-base font-medium text-gray-700 mb-3">Mã Voucher</h2>
                    <div className="flex space-x-3">
                        <input
                            type="text"
                            value={manualCode}
                            onChange={(e) => setManualCode(e.target.value)}
                            placeholder="Nhập mã giảm giá (VD: SHOPEE50K)"
                            className="flex-grow px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-[#EE4D2D] text-sm uppercase"
                        />
                        <button
                            onClick={handleApplyManualCode}
                            className={`text-white font-medium px-6 py-2 rounded-sm text-sm transition shadow-sm ${manualCode ? 'bg-[#EE4D2D] hover:opacity-90' : 'bg-gray-300 cursor-not-allowed'}`}
                            disabled={!manualCode}
                        >
                            ÁP DỤNG
                        </button>
                    </div>
                    {codeMessage.text && (
                        <p className={`text-xs mt-2 ${codeMessage.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                            {codeMessage.text}
                        </p>
                    )}
                </section>

                {/* Danh sách Voucher Shopee */}
                <section className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-4">
                    <h2 className="text-base font-medium text-gray-700 mb-4 flex items-center space-x-2">
                        <Ticket className="w-5 h-5 text-[#EE4D2D]" />
                        <span>Mã Giảm Giá Shopee</span>
                    </h2>
                    
                    <div className="space-y-4">
                        {shopeeVouchers.map((voucher) => {
                            const isSelected = selectedShopeeVoucher === voucher.id;
                            return (
                                <div 
                                    key={voucher.id}
                                    onClick={() => !voucher.disabled && toggleShopeeVoucher(voucher.id)}
                                    className={`shopee-voucher-clip p-3 flex items-center justify-between rounded-md cursor-pointer transition border
                                        ${voucher.disabled ? 'opacity-60 bg-gray-100 cursor-not-allowed border-gray-300' : 'hover:shadow-md'}
                                        ${isSelected ? 'border-[#EE4D2D] bg-[#fff5f4]' : 'border-gray-200'}
                                    `}
                                >
                                    <div className="flex-grow flex space-x-3 overflow-hidden">
                                        <div className={`w-20 h-20 md:w-24 md:h-24 flex flex-col items-center justify-center rounded-l-md flex-shrink-0 text-white
                                            ${voucher.disabled ? 'bg-gray-400' : 'bg-[#EE4D2D]'}`}>
                                            <span className="text-xs font-bold transform -rotate-90 md:rotate-0 whitespace-nowrap">SHOPEE</span>
                                            <div className="w-full border-t border-dashed border-white/30 my-1 md:hidden"></div>
                                        </div>
                                        <div className="flex-grow py-1 pr-2 flex flex-col justify-center">
                                            <p className={`font-bold ${voucher.disabled ? 'text-gray-500' : 'text-gray-800'}`}>{voucher.label}</p>
                                            <p className="text-xs text-gray-500 line-clamp-2 mt-1">{voucher.sub}</p>
                                            {isSelected && <span className="text-xs text-[#EE4D2D] mt-1 font-semibold">Đã chọn</span>}
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0 pl-2">
                                        <input 
                                            type="radio" 
                                            checked={isSelected} 
                                            disabled={voucher.disabled}
                                            readOnly
                                            className="w-5 h-5 text-[#EE4D2D] focus:ring-[#EE4D2D]" 
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Danh sách Voucher Shop */}
                <section className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-20">
                    <h2 className="text-base font-medium text-gray-700 mb-4 flex items-center space-x-2">
                        <Store className="w-5 h-5 text-green-600" />
                        <span>Mã Giảm Giá Shop</span>
                    </h2>
                    
                    <div className="space-y-4">
                        {shopVouchers.map((voucher) => {
                            const isSelected = selectedShopVouchers.includes(voucher.id);
                            return (
                                <div 
                                    key={voucher.id}
                                    onClick={() => !voucher.disabled && toggleShopVoucher(voucher.id)}
                                    className={`shopee-voucher-clip p-3 flex items-center justify-between rounded-md cursor-pointer transition border
                                        ${isSelected ? 'border-[#EE4D2D] bg-[#fff5f4]' : 'border-gray-200'}
                                    `}
                                >
                                    <div className="flex-grow flex space-x-3 overflow-hidden">
                                        <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center bg-green-600 rounded-l-md flex-shrink-0 text-white">
                                            <span className="text-xs font-bold">SHOP</span>
                                        </div>
                                        <div className="flex-grow py-1 pr-2 flex flex-col justify-center">
                                            <p className="font-bold text-gray-800">{voucher.label}</p>
                                            <p className="text-xs text-gray-500 line-clamp-2 mt-1">{voucher.sub}</p>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0 pl-2">
                                        <input 
                                            type="checkbox" 
                                            checked={isSelected}
                                            readOnly 
                                            className="w-5 h-5 text-[#EE4D2D] rounded focus:ring-[#EE4D2D]" 
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

            </main>

            {/* 3. FOOTER */}
            <footer className="bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 sticky bottom-0 z-50 border-t">
                <div className="container mx-auto max-w-4xl flex justify-end items-center space-x-4">
                    <div className="text-sm text-gray-700">
                        <span className="hidden md:inline">Đã chọn </span>
                        <span className="font-bold text-[#EE4D2D]">{totalSelected}</span> 
                        <span className="hidden md:inline"> voucher</span>
                    </div>
                    <button
                        onClick={handleConfirmApply}
                        className="bg-[#EE4D2D] text-white py-3 px-10 rounded-sm text-base font-semibold hover:opacity-90 transition shadow-lg w-full md:w-auto"
                    >
                        ĐỒNG Ý
                    </button>
                </div>
            </footer>
        </div>
    );
};
export default VoucherPage;