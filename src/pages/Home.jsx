import React from 'react';
// Bổ sung Link
import { Link } from 'react-router-dom';
import { Shirt, Monitor, Gem, BookOpen, Home as HomeIcon, Sparkles, Gamepad, Bike, Apple, MoreHorizontal } from 'lucide-react'; 

const Home = () => {
    // Component con được tạo ra để DRY (Don't Repeat Yourself) cho phần Gợi Ý Hôm Nay
    // Đã sửa href thành to và dùng Link
    const ProductSuggestionItem = ({ to, imgSrc, imgAlt, description, price, soldText }) => (
        <Link to={to} className="bg-white rounded-lg shadow hover:shadow-xl transition cursor-pointer overflow-hidden transform hover:scale-[1.02]">
            <img 
                src={imgSrc} 
                alt={imgAlt} 
                className="w-full h-40 object-cover" 
                // Xử lý lỗi ảnh bằng placeholder đơn giản
                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/160x160/CCCCCC/333333?text=Product" }}
            />
            <div className="p-2">a
                <p className="text-xs text-gray-800 h-8 overflow-hidden mb-1">{description}</p>
                <div className="flex justify-between items-center">
                    <span className="text-shopee-primary text-base font-bold">{price}</span>
                    <span className="text-xs text-gray-500">{soldText}</span>
                </div>
            </div>
        </Link>
    );
    
    return (
        // Chỉ giữ lại nội dung chính, MainLayout sẽ cung cấp thẻ <main>
        <div className="container mx-auto p-4">

            {/* 2. BANNER & CATEGORY QUICK ACCESS */}
            <section className="flex space-x-3 mb-6">
                {/* Banner Chính (2/3 width) - CAROUSEL */}
                <div className="w-2/3 h-64 rounded-lg overflow-hidden shadow-lg relative">
                    <div className="carousel-container h-full">
                           {/* Thay thế ảnh cũ bằng placeholder để đảm bảo hiển thị */}
                        <img 
                            src="https://placehold.co/900x400/EE4D2D/FFFFFF?text=BANNER+CHINH+1" 
                            alt="Slide 1" 
                            className="carousel-slide w-full h-full object-cover absolute transition duration-500" 
                        />
                        <img 
                            src="https://placehold.co/900x400/FF7338/FFFFFF?text=BANNER+CHINH+2" 
                            alt="Slide 2" 
                            className="carousel-slide w-full h-full object-cover absolute opacity-0" 
                        />
                        
                        {/* Logic carousel sẽ điều khiển opacity/transform */}
                    </div>
                </div>
                
                {/* Banners Phụ (1/3 width) */}
                <div className="w-1/3 space-y-3">
                    <div className="h-1/2 bg-gray-300 rounded-lg overflow-hidden shadow-md cursor-pointer hover:opacity-90 transition">
                        <img 
                            src="https://placehold.co/500x200/F4721D/FFFFFF?text=Voucher+Hot" 
                            alt="Voucher" 
                            className="w-full h-full object-cover" 
                            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/500x200/F4721D/FFFFFF?text=Voucher+Hot" }}
                        />
                    </div>
                    <div className="h-1/2 bg-gray-300 rounded-lg overflow-hidden shadow-md cursor-pointer hover:opacity-90 transition">
                        <img 
                            src="https://placehold.co/500x200/F89D3C/FFFFFF?text=Freeship+0%C4%90" 
                            alt="Freeship" 
                            className="w-full h-full object-cover" 
                            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/500x200/F89D3C/FFFFFF?text=Freeship+0%C4%90" }}
                        />
                    </div>
                </div>
            </section>

            {/* 3. DANH MỤC NỔI BẬT */}
            <section className="bg-white p-4 rounded-lg shadow mb-6">
                <h2 className="text-gray-800 text-base font-semibold mb-3">DANH MỤC NỔI BẬT</h2>
                <div className="grid grid-cols-10 gap-3 text-center">
                    {[
                        { icon: Shirt, label: "Thời Trang Nam" },
                        { icon: Monitor, label: "Điện Tử" },
                        { icon: Gem, label: "Trang Sức" },
                        { icon: BookOpen, label: "Sách" },
                        { icon: HomeIcon, label: "Nhà Cửa" },
                        { icon: Sparkles, label: "Làm Đẹp" }, 
                        { icon: Gamepad, label: "Đồ Chơi" },
                        { icon: Bike, label: "Thể Thao" },
                        { icon: Apple, label: "Thực Phẩm" },
                        { icon: MoreHorizontal, label: "Xem Thêm" },
                    ].map((category, index) => (
                        <div key={index} className="flex flex-col items-center p-2 hover:shadow-lg transition cursor-pointer rounded-md border border-white hover:border-red-100">
                            <div className="w-12 h-12 flex items-center justify-center text-shopee-primary">
                                <category.icon className="w-8 h-8" />
                            </div>
                            <p className="text-xs text-gray-700 mt-1">{category.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 4. FLASH SALE */}
            <section className="bg-shopee-primary rounded-lg shadow mb-6 overflow-hidden">
                <div className="bg-black/10 flex items-center justify-between p-3">
                    <div className="flex items-center space-x-3 text-white">
                        <h2 className="text-lg font-bold">FLASH SALE</h2>
                        <div className="flex space-x-1 font-mono">
                            <span className="bg-black text-white p-1 rounded">00</span>
                            <span className="text-white">:</span>
                            <span className="bg-black text-white p-1 rounded">59</span>
                            <span className="text-white">:</span>
                            <span className="bg-black text-white p-1 rounded">45</span>
                        </div>
                    </div>
                    <a href="#" className="text-white text-sm hover:underline">XEM TẤT CẢ &gt;</a>
                </div>
                
                <div className="flex space-x-4 p-4 overflow-x-auto bg-white/50">
                    {/* SẢN PHẨM 1 - 5 (Đã thay <a> bằng <Link> và dùng route /product/:itemId) */}
                    {[1, 2, 3, 4, 5].map((id) => (
                        <Link key={id} to={`/product/${id}`} className="flex-shrink-0 w-40 bg-white rounded-lg shadow-md p-3 text-center transition hover:shadow-xl cursor-pointer">
                            <img 
                                src={`https://placehold.co/160x160/FEECE8/EE4D2D?text=Sale+${id}`} 
                                alt={`Sản phẩm Sale ${id}`} 
                                className="w-full h-auto rounded-md mb-2" 
                                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/160x160/CCCCCC/333333?text=Product" }}
                            />
                            <p className="text-shopee-primary text-lg font-bold">{id * 50}.000₫</p>
                            <p className="text-xs text-gray-500 line-through">{(id * 50 + 50)}.000₫</p>
                            <div className="mt-2 relative h-3 bg-red-100 rounded-full overflow-hidden">
                                <div className="shopee-primary h-full rounded-full" style={{ width: `${90 - id * 10}%` }}></div>
                                <span className="absolute inset-0 text-white text-xs font-semibold flex items-center justify-center">
                                    Đã bán {10 * id}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* 5. GỢI Ý HÔM NAY */}
            <section>
                <div className="shopee-primary w-full p-2 text-center text-white text-sm font-semibold rounded-t-lg shadow-lg">
                    GỢI Ý HÔM NAY
                </div>
                
                {/* 12 Sản phẩm gợi ý (Đã sửa href thành to và dùng <ProductSuggestionItem> với <Link>) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 bg-white p-4 rounded-b-lg shadow-lg">
                    {[
                        // Gán ID > 5 để tránh trùng Flash Sale
                        { desc: "Quần Jean Nam Ống Rộng Cá Tính...", price: "199.000₫", sold: "Đã bán 1k", img: "https://placehold.co/160x160/3498DB/FFFFFF?text=QUAN", id: 6 },
                        { desc: "Tai Nghe Bluetooth TWS Chất Lượng Cao Chống Nước", price: "450.000₫", sold: "Đã bán 500", img: "https://placehold.co/160x160/8E44AD/FFFFFF?text=TWS", id: 7 },
                        { desc: "Son Môi Lì Màu Đỏ Gạch Siêu Mịn Màng", price: "89.000₫", sold: "Đã bán 3k", img: "https://placehold.co/160x160/E74C3C/FFFFFF?text=SON", id: 8 },
                        { desc: "Áo Thun Nữ Cổ Tròn Form Rộng In Hình Dễ Thương", price: "59.000₫", sold: "Đã bán 2.5k", img: "https://placehold.co/160x160/2ECC71/FFFFFF?text=AOTHUN", id: 9 },
                        { desc: "Giày Sneaker Unisex Cổ Thấp Đệm Êm Chân", price: "350.000₫", sold: "Đã bán 800", img: "https://placehold.co/160x160/F39C12/FFFFFF?text=GIAY", id: 10 },
                        { desc: "Bếp Điện Từ Mini Đa Năng Tiết Kiệm Điện", price: "780.000₫", sold: "Đã bán 200", img: "https://placehold.co/160x160/9B59B6/FFFFFF?text=BEP", id: 11 },
                        { desc: "Quần Jean Nam Ống Rộng Cá Tính (2)...", price: "209.000₫", sold: "Đã bán 1.2k", img: "https://placehold.co/160x160/3498DB/FFFFFF?text=QUAN2", id: 12 },
                        { desc: "Tai Nghe Không Dây Giá Rẻ Anker", price: "250.000₫", sold: "Đã bán 900", img: "https://placehold.co/160x160/8E44AD/FFFFFF?text=ANKER", id: 13 },
                        { desc: "Son Môi Lì Màu Cam Đất", price: "99.000₫", sold: "Đã bán 4k", img: "https://placehold.co/160x160/E74C3C/FFFFFF?text=SON2", id: 14 },
                        { desc: "Áo Polo Nam Chất Liệu Cotton", price: "180.000₫", sold: "Đã bán 1.5k", img: "https://placehold.co/160x160/2ECC71/FFFFFF?text=POLO", id: 15 },
                        { desc: "Giày Thể Thao Nam Trắng", price: "400.000₫", sold: "Đã bán 750", img: "https://placehold.co/160x160/F39C12/FFFFFF?text=GIAY2", id: 16 },
                        { desc: "Nồi Chiên Không Dầu", price: "1.200.000₫", sold: "Đã bán 350", img: "https://placehold.co/160x160/9B59B6/FFFFFF?text=NOI", id: 17 },
                    ].map((item) => (
                        <ProductSuggestionItem 
                            key={item.id}
                            to={`/product/${item.id}`}
                            imgSrc={item.img}
                            imgAlt={item.desc}
                            description={item.desc}
                            price={item.price}
                            soldText={item.sold}
                        />
                    ))}
                </div>

                <div className="text-center mt-6">
                    <button className="shopee-primary text-white font-semibold px-8 py-3 rounded-md text-sm hover:opacity-90 transition shadow-lg">
                        XEM THÊM SẢN PHẨM
                    </button>
                </div>
            </section>

        </div>
    );
};

export default Home;