import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Bổ sung Link
import { Search, Store, PlusCircle, ChevronRight } from 'lucide-react';

// Dữ liệu chat giả lập
const initialMessages = [
    { type: 'system', text: '15:30, 01/12/2025' },
    { type: 'buyer', text: 'Chào shop, tôi muốn hỏi áo hoodie size L màu đen còn hàng không? Tôi muốn mua ngay.' },
    { 
        type: 'seller', 
        text: 'Cảm ơn bạn đã quan tâm! Hiện tại, size L màu đen vẫn còn đủ hàng bạn nhé. Bạn có thể đặt hàng ngay.',
        product: { name: 'Áo Hoodie Local Brand Form Rộng', price: 289000, to: '/product/1', imgSrc: 'https://placehold.co/40x40/2C3E50/FFFFFF?text=HOODIE' }
    },
    { type: 'buyer', text: 'Tuyệt vời. Shop cho tôi hỏi về chất liệu vải có bị xù lông không?' },
    { 
        type: 'seller', 
        text: 'Chất liệu nỉ cotton cao cấp, cam kết không xù lông và giữ form tốt sau khi giặt bạn nhé!',
        product: { name: 'Áo Hoodie Local Brand Form Rộng', price: 289000, to: '/product/1', imgSrc: 'https://placehold.co/40x40/2C3E50/FFFFFF?text=HOODIE' }
    },
];

// Dữ liệu danh sách chat giả lập
const initialConversations = [
    { id: 1, name: 'Shop 1 Store', lastMessage: 'Bạn: Size L còn màu đen không?', unread: 1, isActive: true, avatar: 'https://placehold.co/40x40/EE4D2D/FFFFFF?text=SHOP' },
    { id: 2, name: 'Nguyễn Thị C', lastMessage: 'Cảm ơn shop nhé!', unread: 0, isActive: false, time: '10 phút trước', avatar: 'https://placehold.co/40x40/007bff/FFFFFF?text=USER' },
];

const formatCurrency = (number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number).replace('₫', '').trim() + '₫';
};

// Component cho một tin nhắn
const MessageBubble = ({ message }) => {
    if (message.type === 'system') {
        return (
            <div className="text-center text-xs text-gray-400 py-2">
                <span>{message.text}</span>
            </div>
        );
    }
    
    // Tin nhắn của người mua (buyer)
    const isBuyer = message.type === 'buyer';
    const justifyContent = isBuyer ? 'justify-end' : 'justify-start';
    // Định nghĩa style bubble trực tiếp hoặc qua Tailwind
    const bubbleStyle = {
        padding: '10px 15px',
        borderRadius: '18px',
        maxWidth: '75%',
        fontSize: '0.9rem',
        backgroundColor: isBuyer ? '#EE4D2D' : '#F5F5F5',
        color: isBuyer ? 'white' : 'black',
        borderBottomRightRadius: isBuyer ? '4px' : '18px',
        borderBottomLeftRadius: isBuyer ? '18px' : '4px',
    };
    
    const avatarSrc = isBuyer ? 'https://placehold.co/32x32/007bff/FFFFFF?text=USER' : 'https://placehold.co/32x32/EE4D2D/FFFFFF?text=SHOP';
    const marginClass = isBuyer ? 'ml-2' : 'mr-2';

    return (
        <div className={`flex ${justifyContent}`}>
            {!isBuyer && <img src={avatarSrc} alt="Shop Avatar" className={`w-8 h-8 rounded-full ${marginClass} flex-shrink-0`} />}
            
            <div style={bubbleStyle}>
                {!isBuyer && <span className="font-bold text-shopee-primary">Shop 1: </span>}
                {message.text}
                
                {message.product && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">Bạn có thể xem chi tiết sản phẩm:</p>
                        {/* Sử dụng Link */}
                        <Link to={message.product.to} className="flex items-center space-x-2 p-2 bg-white rounded-lg hover:bg-gray-100 transition">
                            <img src={message.product.imgSrc} alt={message.product.name} className="w-10 h-10 object-cover rounded-md" />
                            <div className="flex-grow">
                                <p className="text-sm font-medium text-gray-800 line-clamp-1">{message.product.name}</p>
                                <p className="text-xs text-shopee-primary font-bold">{formatCurrency(message.product.price)}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                        </Link>
                    </div>
                )}
            </div>
            
            {isBuyer && <img src={avatarSrc} alt="User Avatar" className={`w-8 h-8 rounded-full ${marginClass} flex-shrink-0`} />}
        </div>
    );
};


const ChatPage = () => {
    const [messages, setMessages] = useState(initialMessages);
    const [inputMessage, setInputMessage] = useState('');
    const chatBoxRef = useRef(null);

    // Auto scroll to bottom
    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (inputMessage.trim() === '') return;

        // 1. Gửi tin nhắn của người mua
        const newBuyerMessage = { type: 'buyer', text: inputMessage.trim() };
        setMessages(prevMessages => [...prevMessages, newBuyerMessage]);
        setInputMessage('');

        // 2. Giả lập phản hồi của người bán sau 1 giây
        setTimeout(() => {
            const replyText = "Vâng, Shop đã nhận được tin nhắn của bạn và sẽ kiểm tra ngay!";
            const newSellerMessage = { type: 'seller', text: replyText };
            setMessages(prevMessages => [...prevMessages, newSellerMessage]);
        }, 1000);
    };
    
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        // LOẠI BỎ DIV CHUNG VÀ HEADER VÌ ĐÃ CÓ LAYOUT.JSX XỬ LÝ
        <div className="container mx-auto p-4 md:p-6 flex space-x-6 min-h-[calc(100vh-100px)]">

            {/* Cột Trái: Danh sách Cuộc trò chuyện (W-1/4) */}
            <div className="w-1/4 bg-white rounded-lg shadow-md flex-shrink-0 flex flex-col overflow-hidden h-[85vh] sticky top-4">
                <div className="p-4 border-b">
                    <input type="text" placeholder="Tìm kiếm tin nhắn..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-shopee-primary focus:outline-none" />
                </div>
                
                <div className="flex-grow overflow-y-auto">
                    {initialConversations.map(conv => (
                        <div 
                            key={conv.id}
                            className={`p-3 flex items-center space-x-3 border-b cursor-pointer ${conv.isActive ? 'bg-red-50 border-l-4 border-shopee-primary' : 'hover:bg-gray-50'}`}
                        >
                            <img src={conv.avatar} alt="Avatar" className="w-10 h-10 rounded-full" />
                            <div className="flex-grow">
                                <p className="font-semibold text-gray-800 line-clamp-1">{conv.name}</p>
                                <p className={`text-xs line-clamp-1 ${conv.isActive ? 'text-shopee-primary' : 'text-gray-500'}`}>{conv.lastMessage}</p>
                            </div>
                            {conv.unread > 0 ? (
                                <span className="text-xs text-shopee-primary font-bold">{conv.unread}</span>
                            ) : (
                                <span className="text-xs text-gray-400">{conv.time}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Cột Phải: Cửa sổ Chat (W-3/4) */}
            <div className="w-3/4 bg-white rounded-lg shadow-md flex flex-col overflow-hidden h-[85vh]">
                
                {/* Tiêu đề Chat */}
                <div className="p-4 border-b flex justify-between items-center bg-gray-50 flex-shrink-0">
                    <div className="flex items-center space-x-3">
                        <img src="https://placehold.co/40x40/EE4D2D/FFFFFF?text=SHOP" alt="Shop Avatar" className="w-10 h-10 rounded-full" />
                        <p className="text-lg font-semibold text-gray-800">Shop 1 Store</p>
                    </div>
                    <Link to="/ShopCart" className="text-shopee-primary hover:underline text-sm flex items-center space-x-1">
                        <Store className="w-4 h-4" />
                        <span>Xem Shop</span>
                    </Link>
                </div>
                
                {/* Khu vực Tin nhắn */}
                <div id="chat-messages" ref={chatBoxRef} className="flex-grow p-6 space-y-4 overflow-y-auto bg-gray-50">
                    {messages.map((msg, index) => (
                        <MessageBubble key={index} message={msg} />
                    ))}
                </div>

                {/* Khung nhập Tin nhắn */}
                <div className="p-4 border-t flex items-center space-x-3 bg-white flex-shrink-0">
                    <button className="text-gray-500 hover:text-shopee-primary transition p-2 rounded-full">
                        <PlusCircle className="w-6 h-6" />
                    </button>
                    <input 
                        type="text" 
                        placeholder="Nhập tin nhắn..." 
                        className="flex-grow px-4 py-3 border border-gray-300 rounded-lg text-sm focus:border-shopee-primary focus:outline-none"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                    />
                    <button 
                        className="shopee-primary text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition shadow-md"
                        onClick={handleSend}
                    >
                        Gửi
                    </button>
                </div>
            </div>

        </div>
    );
};

export default ChatPage;