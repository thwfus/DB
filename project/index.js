const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001; // Đổi port để tránh xung đột

// ================ MIDDLEWARE ================
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// ================ DATABASE CONNECTION ================

// const pool = mysql.createPool({
//     host: process.env.DB_HOST || 'btl-hcsdl-tienloc0902-2358.g.aivencloud.com',
//     user: process.env.DB_USER || 'avnadmin',
//     password: process.env.DB_PASSWORD || 'AVNS_xNTjkqxKZJWB7A1ej72',
//     database: process.env.DB_NAME || 'defaultdb',
//     port: process.env.DB_PORT || 16219,
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// });

// Test connection
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Kết nối MySQL thành công!');
        connection.release();
    } catch (err) {
        console.error('❌ Lỗi kết nối MySQL:', err.message);
    }
})();

// ================ UTILITY FUNCTIONS ================

/**
 * Hàm tiện ích để chuẩn hóa phản hồi lỗi
 */
const sendError = (res, error, status = 500) => {
    // 1. Lỗi kết nối database
    if (error.code === 'ECONNREFUSED' || error.code === 'PROTOCOL_CONNECTION_LOST') {
        return res.status(503).json({ 
            success: false, 
            message: 'Không thể kết nối đến cơ sở dữ liệu' 
        });
    }
    
    // 2. MySQL SIGNAL (SQLSTATE '45000') - Lỗi nghiệp vụ từ SP
    if (typeof error === 'object' && error.code === 'ER_SIGNAL_EXCEPTION') {
        const errorMessage = error.sqlMessage || 'Lỗi nghiệp vụ từ CSDL.';
        return res.status(400).json({ 
            success: false, 
            message: errorMessage 
        });
    }
    
    // 3. Lỗi foreign key constraint
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({ 
            success: false, 
            message: 'Dữ liệu tham chiếu không tồn tại (khóa ngoại)' 
        });
    }
    
    // 4. Lỗi duplicate entry
    if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ 
            success: false, 
            message: 'Dữ liệu đã tồn tại' 
        });
    }
    
    // Xử lý lỗi chung
    const message = (typeof error === 'string') ? error : (error.message || 'Lỗi không xác định.');
    console.error(`Lỗi Server (${status}):`, error);

    res.status(status).json({ 
        success: false, 
        message: `Lỗi hệ thống: ${message}` 
    });
};

// Validation functions
// Điền thông tin người dùng
const validateUser = (user) => {
    if (!user.ho_ten || !user.email || !user.sdt) {
        return { valid: false, message: 'Thiếu thông tin bắt buộc' };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
        return { valid: false, message: 'Email không hợp lệ' };
    }
    
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(user.sdt.replace(/\D/g, ''))) {
        return { valid: false, message: 'Số điện thoại phải có 10-11 chữ số' };
    }
    
    if (user.ngay_sinh) {
        const birthDate = new Date(user.ngay_sinh);
        const age = new Date().getFullYear() - birthDate.getFullYear();
        if (age < 14) {
            return { valid: false, message: 'Người dùng phải từ 14 tuổi trở lên' };
        }
    }
    
    return { valid: true };
};

// Kiểm tra dữ liệu sản phẩm
const validateProduct = (product) => {
    const { shop_id, ten, so_luong, gia_ban, ma_danh_muc, ma_thuong_hieu } = product;
    
    if (!shop_id || !ten || so_luong === undefined || gia_ban === undefined || !ma_danh_muc || !ma_thuong_hieu) {
        return { valid: false, message: 'Thiếu dữ liệu bắt buộc' };
    }
    
    if (typeof ten !== 'string' || ten.trim().length === 0) {
        return { valid: false, message: 'Tên sản phẩm không hợp lệ' };
    }
    
    if (typeof so_luong !== 'number' || so_luong < 0) {
        return { valid: false, message: 'Số lượng phải là số không âm' };
    }
    
    if (typeof gia_ban !== 'number' || gia_ban <= 0) {
        return { valid: false, message: 'Giá bán phải là số dương' };
    }
    
    if (typeof shop_id !== 'number' || typeof ma_danh_muc !== 'number' || typeof ma_thuong_hieu !== 'number') {
        return { valid: false, message: 'ID phải là số' };
    }
    
    return { valid: true };
};

// ================ API ROUTES ================

// 1. HEALTH CHECK
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Server đang hoạt động',
        timestamp: new Date().toISOString(),
        service: 'full-management-system'
    });
});

// 2. TEST DATABASE
app.get('/api/test-db', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT NOW() as current_time, DATABASE() as db_name');
        res.json({ 
            success: true, 
            message: 'Kết nối database thành công',
            data: rows[0]
        });
    } catch (error) {
        sendError(res, error);
    }
});

// ================ PHẦN 1: QUẢN LÝ SẢN PHẨM (1.1, 1.2) ================

// Lấy danh sách sản phẩm theo Shop và Danh mục
app.get('/api/products', async (req, res) => {
    const { shop_id, category_id } = req.query;

    if (!shop_id || !category_id) {
        return sendError(res, 'Vui lòng cung cấp shop_id và category_id qua query parameter.', 400);
    }

    try {      
        const [rows] = await pool.execute(
            // 'CALL sp_LietKeSanPhamTheoShopDanhMuc(?, ?)', 
            // [shop_id, category_id]
            `SELECT * FROM SanPham sp JOIN SanPhamThuocVao spv 
                ON sp.MaShop = spv.MaShop and sp.MaSanPham = spv.MaSanPham
                WHERE sp.MaShop = ${shop_id}
            `
        );
        
        products = rows || [];
        
        res.status(200).json({ 
            success: true, 
            data: products,
            count: products.length
        });
    } catch (error) {
        sendError(res, error);
    }
});

// Thêm sản phẩm mới
app.post('/api/products', async (req, res) => {
    //console.log("BODY FE GỬI LÊN:", req.body); 
    const { shop_id, ten, so_luong, gia_ban, ma_danh_muc, ma_thuong_hieu } = req.body;

    // Validate
    const validation = validateProduct(req.body);
    if (!validation.valid) {
        return sendError(res, validation.message, 400);
    }

    try {

        await pool.execute(
            'CALL InsertSanPhamFull(?, ?, ?, ?, ?, ?)', 
            [shop_id, ten.trim(), so_luong, gia_ban, ma_danh_muc, ma_thuong_hieu]
        );

        res.status(201).json({ 
            success: true, 
            message: 'Thêm sản phẩm thành công.' 
        });
    } catch (error) {
        sendError(res, error);
    }
});

// Cập nhật sản phẩm
app.put('/api/products/:id', async (req, res) => {
    const maSanPham = req.params.id;
    const { shop_id, ten, so_luong, gia_ban, ma_thuong_hieu, ma_danh_muc } = req.body;
    
    if (!shop_id) {
        return sendError(res, 'Thiếu shop_id trong body.', 400);
    }

    try {
        await pool.execute(
            'CALL sp_SuaSanPham(?, ?, ?, ?, ?, ?, ?)', 
            [
                shop_id, 
                maSanPham, 
                ten || null,
                so_luong === undefined ? null : so_luong, 
                gia_ban === undefined ? null : gia_ban, 
                ma_thuong_hieu || null, 
                ma_danh_muc || null
            ]
        );

        res.status(200).json({ 
            success: true, 
            message: 'Cập nhật sản phẩm thành công.' 
        });
    } catch (error) {
        sendError(res, error);
    }
});

// Xóa sản phẩm (soft delete)
app.delete('/api/products/:id', async (req, res) => {
    const maSanPham = req.params.id;
    const { shop_id } = req.query; // Sửa: dùng query parameter

    if (!shop_id) {
        return sendError(res, 'Thiếu shop_id trong query parameter.', 400);
    }

    try {
        await pool.execute('CALL sp_XoaSanPham(?, ?)', [shop_id, maSanPham]);

        res.status(200).json({ 
            success: true, 
            message: 'Xóa sản phẩm thành công.' 
        });
    } catch (error) {
        sendError(res, error);
    }
});

// ================ PHẦN 1.3: BÁO CÁO & KIỂM TRA ================

// Thống kê tồn kho theo danh mục
app.get('/api/report/inventory', async (req, res) => {
    const { shop_id, min_total } = req.query;

    if (!shop_id || min_total === undefined) {
        return sendError(res, 'Vui lòng cung cấp shop_id và min_total (ngưỡng số lượng tối thiểu).', 400);
    }

    try {
        const [rows] = await pool.execute(
            'CALL sp_ThongKeTonTheoDanhMuc(?, ?)', 
            [shop_id, min_total]
        );

        res.status(200).json({ 
            success: true, 
            data: rows[0] || []
        });
    } catch (error) {
        sendError(res, error, 500);
    }
});

// Liệt kê sản phẩm theo danh mục
app.get('/api/report/list', async (req, res) => {
    // Đặt tên query param cho khớp với SP: p_MaShop, p_MaDanhMuc
    const { ma_shop, ma_danh_muc } = req.query;
    console.log("Query Params Received:", req.query);
    if (!ma_shop || !ma_danh_muc) {
        return sendError(
            res,
            'Vui lòng cung cấp ma_shop và ma_danh_muc qua query parameter.',
            400
        );
    }

    const shopId = parseInt(ma_shop, 10);
    const categoryId = parseInt(ma_danh_muc, 10);

    if (Number.isNaN(shopId) || Number.isNaN(categoryId)) {
        return sendError(res, 'ma_shop và ma_danh_muc phải là số nguyên.', 400);
    }

    try {
        // Gọi đúng SP bạn đã tạo trong MySQL
        const [rows] = await pool.execute(
            'CALL sp_LietKeSanPhamTheoShopDanhMuc(?, ?)',
            [shopId, categoryId]
        );

        const products = rows[0] || [];

        res.status(200).json({
            success: true,
            data: products,
            count: products.length
        });
    } catch (error) {
        sendError(res, error);
    }
});

// // ================ MỤC 3.1: QUẢN LÝ NHÂN VIÊN ================

// // Lấy danh sách nhân viên
// app.get('/api/employees', async (req, res) => {
//     try {
//         const [rows] = await pool.execute('SELECT * FROM NhanVien ORDER BY ma_nv DESC');
//         res.json({ 
//             success: true, 
//             data: rows,
//             count: rows.length
//         });
//     } catch (error) {
//         sendError(res, error);
//     }
// });

// // Lấy thông tin 1 nhân viên
// app.get('/api/employees/:id', async (req, res) => {
//     try {
//         const [rows] = await pool.execute('SELECT * FROM NhanVien WHERE ma_nv = ?', [req.params.id]);
//         if (rows.length === 0) {
//             return res.status(404).json({ 
//                 success: false, 
//                 message: 'Nhân viên không tồn tại' 
//             });
//         }
//         res.json({ success: true, data: rows[0] });
//     } catch (error) {
//         sendError(res, error);
//     }
// });

// // Thêm nhân viên
// app.post('/api/employees', async (req, res) => {
//     try {
//         const employeeData = req.body;
        
//         // Validate
//         const validation = validateEmployee(employeeData);
//         if (!validation.valid) {
//             return res.status(400).json({ 
//                 success: false, 
//                 message: validation.message 
//             });
//         }
        
//         // Kiểm tra email đã tồn tại
//         const [existing] = await pool.execute(
//             'SELECT ma_nv FROM NhanVien WHERE email = ?',
//             [employeeData.email]
//         );
        
//         if (existing.length > 0) {
//             return res.status(400).json({ 
//                 success: false, 
//                 message: 'Email đã được sử dụng bởi nhân viên khác' 
//             });
//         }
        
//         // Thử gọi stored procedure trước
//         let result;
//         try {
//             const [spResult] = await pool.execute(
//                 'CALL sp_ThemNhanVien(?, ?, ?, ?, ?, ?, ?, ?, ?)',
//                 [
//                     employeeData.ho_ten,
//                     employeeData.ngay_sinh || null,
//                     employeeData.gioi_tinh || 'Nam',
//                     employeeData.dia_chi || '',
//                     employeeData.sdt,
//                     employeeData.email,
//                     employeeData.ngay_vao_lam || new Date(),
//                     employeeData.ma_chuc_vu || 1,
//                     employeeData.luong_co_ban || 0
//                 ]
//             );
//             result = spResult[0] ? spResult[0][0] : { new_employee_id: null };
//         } catch (spError) {
//             // Nếu SP không tồn tại, dùng query trực tiếp
//             console.log('Không tìm thấy SP, dùng query trực tiếp');
//             const [insertResult] = await pool.execute(
//                 `INSERT INTO NhanVien 
//                  (ho_ten, ngay_sinh, gioi_tinh, dia_chi, sdt, email, ngay_vao_lam, ma_chuc_vu, luong_co_ban) 
//                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//                 [
//                     employeeData.ho_ten,
//                     employeeData.ngay_sinh || null,
//                     employeeData.gioi_tinh || 'Nam',
//                     employeeData.dia_chi || '',
//                     employeeData.sdt,
//                     employeeData.email,
//                     employeeData.ngay_vao_lam || new Date(),
//                     employeeData.ma_chuc_vu || 1,
//                     employeeData.luong_co_ban || 0
//                 ]
//             );
//             result = { new_employee_id: insertResult.insertId };
//         }
        
//         res.status(201).json({
//             success: true,
//             message: 'Thêm nhân viên thành công',
//             data: result
//         });
//     } catch (error) {
//         sendError(res, error);
//     }
// });

// // Sửa nhân viên
// app.put('/api/employees/:id', async (req, res) => {
//     try {
//         const employeeId = req.params.id;
//         const employeeData = req.body;
        
//         // Validate
//         const validation = validateEmployee(employeeData);
//         if (!validation.valid) {
//             return res.status(400).json({ 
//                 success: false, 
//                 message: validation.message 
//             });
//         }
        
//         // Kiểm tra nhân viên tồn tại
//         const [existing] = await pool.execute(
//             'SELECT ma_nv FROM NhanVien WHERE ma_nv = ?',
//             [employeeId]
//         );
        
//         if (existing.length === 0) {
//             return res.status(404).json({ 
//                 success: false, 
//                 message: 'Nhân viên không tồn tại' 
//             });
//         }
        
//         // Kiểm tra email trùng
//         const [emailCheck] = await pool.execute(
//             'SELECT ma_nv FROM NhanVien WHERE email = ? AND ma_nv != ?',
//             [employeeData.email, employeeId]
//         );
        
//         if (emailCheck.length > 0) {
//             return res.status(400).json({ 
//                 success: false, 
//                 message: 'Email đã được sử dụng bởi nhân viên khác' 
//             });
//         }
        
//         // Cập nhật nhân viên
//         await pool.execute(
//             `UPDATE NhanVien SET 
//                 ho_ten = ?, 
//                 ngay_sinh = ?, 
//                 gioi_tinh = ?, 
//                 dia_chi = ?, 
//                 sdt = ?, 
//                 email = ?, 
//                 ngay_vao_lam = ?, 
//                 ma_chuc_vu = ?, 
//                 luong_co_ban = ?,
//                 updated_at = NOW()
//              WHERE ma_nv = ?`,
//             [
//                 employeeData.ho_ten,
//                 employeeData.ngay_sinh || null,
//                 employeeData.gioi_tinh || 'Nam',
//                 employeeData.dia_chi || '',
//                 employeeData.sdt,
//                 employeeData.email,
//                 employeeData.ngay_vao_lam || new Date(),
//                 employeeData.ma_chuc_vu || 1,
//                 employeeData.luong_co_ban || 0,
//                 employeeId
//             ]
//         );
        
//         res.json({
//             success: true,
//             message: 'Cập nhật nhân viên thành công'
//         });
//     } catch (error) {
//         sendError(res, error);
//     }
// });

// // Xóa nhân viên
// app.delete('/api/employees/:id', async (req, res) => {
//     try {
//         const employeeId = req.params.id;
        
//         // Kiểm tra nhân viên tồn tại
//         const [existing] = await pool.execute(
//             'SELECT ma_nv FROM NhanVien WHERE ma_nv = ?',
//             [employeeId]
//         );
        
//         if (existing.length === 0) {
//             return res.status(404).json({ 
//                 success: false, 
//                 message: 'Nhân viên không tồn tại' 
//             });
//         }
        
//         // Kiểm tra nhân viên có đơn hàng không
//         const [hasOrders] = await pool.execute(
//             'SELECT COUNT(*) as order_count FROM DonHang WHERE ma_nv = ?',
//             [employeeId]
//         );
        
//         if (hasOrders[0].order_count > 0) {
//             return res.status(400).json({ 
//                 success: false, 
//                 message: 'Không thể xóa nhân viên đã có đơn hàng' 
//             });
//         }
        
//         // Xóa nhân viên
//         await pool.execute('DELETE FROM NhanVien WHERE ma_nv = ?', [employeeId]);
        
//         res.json({
//             success: true,
//             message: 'Xóa nhân viên thành công'
//         });
//     } catch (error) {
//         sendError(res, error);
//     }
// });

// // Tìm kiếm nhân viên
// app.get('/api/employees/search/filter', async (req, res) => {
//     try {
//         const { keyword, chuc_vu, tu_ngay, den_ngay } = req.query;
        
//         let query = `
//             SELECT nv.*, cv.ten_chuc_vu 
//             FROM NhanVien nv
//             LEFT JOIN ChucVu cv ON nv.ma_chuc_vu = cv.ma_chuc_vu
//             WHERE 1=1
//         `;
//         const params = [];
        
//         if (keyword) {
//             query += ` AND (nv.ho_ten LIKE ? OR nv.email LIKE ? OR nv.sdt LIKE ?)`;
//             const searchTerm = `%${keyword}%`;
//             params.push(searchTerm, searchTerm, searchTerm);
//         }
        
//         if (chuc_vu) {
//             query += ` AND nv.ma_chuc_vu = ?`;
//             params.push(chuc_vu);
//         }
        
//         if (tu_ngay) {
//             query += ` AND nv.ngay_vao_lam >= ?`;
//             params.push(tu_ngay);
//         }
        
//         if (den_ngay) {
//             query += ` AND nv.ngay_vao_lam <= ?`;
//             params.push(den_ngay);
//         }
        
//         query += ` ORDER BY nv.ma_nv DESC`;
        
//         const [rows] = await pool.execute(query, params);
//         res.json({ 
//             success: true, 
//             data: rows,
//             count: rows.length
//         });
//     } catch (error) {
//         sendError(res, error);
//     }
// });

// ================ MỤC 3.2: QUẢN LÝ ĐƠN HÀNG ================

// Lấy danh sách đơn hàng (theo bảng DonHang thật trong DB)
app.get('/api/orders', async (req, res) => {
    try {
        const { trang_thai, ma_don_vi, ma_ho_so, cccd } = req.query;

        let query = `
            SELECT 
                MaDonHang,
                GiaVanChuyen,
                TrangThaiDonHang,
                MaDonViVanChuyen,
                CCCD,
                MaHoSo,
                MaGioHang,
                MaGioPhu
            FROM DonHang
            WHERE 1 = 1
        `;
        const params = [];

        if (trang_thai) {
            query += ` AND TrangThaiDonHang = ?`;
            params.push(trang_thai);
        }

        if (ma_don_vi) {
            query += ` AND MaDonViVanChuyen = ?`;
            params.push(ma_don_vi);
        }

        if (ma_ho_so) {
            query += ` AND MaHoSo = ?`;
            params.push(ma_ho_so);
        }

        if (cccd) {
            query += ` AND CCCD = ?`;
            params.push(cccd);
        }

        query += ` ORDER BY MaDonHang DESC`;

        const [rows] = await pool.execute(query, params);

        res.json({
            success: true,
            data: rows,
            count: rows.length
        });
    } catch (error) {
        sendError(res, error);
    }
});


// // Lấy chi tiết đơn hàng
// app.get('/api/orders/:id', async (req, res) => {
//     try {
//         const orderId = req.params.id;
        
//         // Lấy thông tin đơn hàng
//         const [order] = await pool.execute(`
//             SELECT dh.*, kh.ho_ten as ten_khach_hang, kh.sdt as sdt_khach_hang,
//                    nv.ho_ten as ten_nhan_vien, nv.sdt as sdt_nhan_vien
//             FROM DonHang dh
//             LEFT JOIN KhachHang kh ON dh.ma_kh = kh.ma_kh
//             LEFT JOIN NhanVien nv ON dh.ma_nv = nv.ma_nv
//             WHERE dh.ma_dh = ?
//         `, [orderId]);
        
//         if (order.length === 0) {
//             return res.status(404).json({ 
//                 success: false, 
//                 message: 'Đơn hàng không tồn tại' 
//             });
//         }
        
//         // Lấy chi tiết sản phẩm trong đơn
//         const [details] = await pool.execute(`
//             SELECT ctdh.*, sp.ten_sp, sp.gia_ban
//             FROM ChiTietDonHang ctdh
//             JOIN SanPham sp ON ctdh.ma_sp = sp.ma_sp
//             WHERE ctdh.ma_dh = ?
//         `, [orderId]);
        
//         res.json({
//             success: true,
//             data: {
//                 ...order[0],
//                 chi_tiet: details
//             }
//         });
//     } catch (error) {
//         sendError(res, error);
//     }
// });

// Tạo đơn hàng mới
app.post('/api/orders', async (req, res) => {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        const orderData = req.body;
        
        // Validate
        if (!orderData.ma_kh) {
            throw new Error('Thiếu mã khách hàng');
        }
        
        if (!orderData.items || orderData.items.length === 0) {
            throw new Error('Đơn hàng phải có ít nhất 1 sản phẩm');
        }
        
        // Tạo đơn hàng
        const [orderResult] = await connection.execute(
            'INSERT INTO donhang () VALUES ()',
            [orderData.ma_kh, orderData.ma_nv || null, orderData.trang_thai || 'Chờ xử lý']
        );
        
        const orderId = orderResult.insertId;
        let totalAmount = 0;
        
        // Thêm chi tiết đơn hàng
        for (const item of orderData.items) {
            // Kiểm tra tồn kho
            const [product] = await connection.execute(
                'SELECT ten_sp, gia_ban, so_luong_ton FROM sanpham WHERE ma_sp = ?',
                [item.ma_sp]
            );
            
            if (product.length === 0) {
                throw new Error(`Sản phẩm ${item.ma_sp} không tồn tại`);
            }
            
            if (product[0].so_luong_ton < item.so_luong) {
                throw new Error(`Sản phẩm ${product[0].ten_sp} không đủ số lượng tồn kho`);
            }
            
            const price = product[0].gia_ban;
            const subtotal = price * item.so_luong;
            
            await connection.execute(
                'INSERT INTO ChiTietDonHang (ma_dh, ma_sp, so_luong, don_gia, thanh_tien) VALUES (?, ?, ?, ?, ?)',
                [orderId, item.ma_sp, item.so_luong, price, subtotal]
            );
            
            // Cập nhật tồn kho
            await connection.execute(
                'UPDATE SanPham SET so_luong_ton = so_luong_ton - ? WHERE ma_sp = ?',
                [item.so_luong, item.ma_sp]
            );
            
            totalAmount += subtotal;
        }
        
        // Cập nhật tổng tiền
        await connection.execute(
            'UPDATE DonHang SET tong_tien = ? WHERE ma_dh = ?',
            [totalAmount, orderId]
        );
        
        await connection.commit();
        
        res.status(201).json({
            success: true,
            message: 'Tạo đơn hàng thành công',
            data: { 
                order_id: orderId, 
                total_amount: totalAmount 
            }
        });
    } catch (error) {
        await connection.rollback();
        res.status(400).json({ 
            success: false, 
            message: error.message 
        });
    } finally {
        connection.release();
    }
});

// Cập nhật trạng thái đơn hàng
app.put('/api/orders/:id/status', async (req, res) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;
        
        const validStatuses = ['Chờ xử lý', 'Đang xử lý', 'Đang giao hàng', 'Đã giao', 'Đã hủy'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Trạng thái không hợp lệ'
            });
        }
        
        await pool.execute(
            'UPDATE donhang SET TrangThaiDonHang = ?, updated_at = NOW() WHERE ma_dh = ?',
            [status, orderId]
        );
        
        res.json({
            success: true,
            message: 'Cập nhật trạng thái thành công'
        });
    } catch (error) {
        sendError(res, error);
    }
});

// ================ MỤC 3.3: BÁO CÁO & THỐNG KÊ ================

// Báo cáo doanh thu theo tháng
app.get('/api/reports/sales', async (req, res) => {
    try {
        const { year, month } = req.query;
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        
        const [rows] = await pool.execute(`
            SELECT 
                DATE_FORMAT(ngay_dat, '%Y-%m') as thang_nam,
                COUNT(*) as so_don_hang,
                SUM(tong_tien) as tong_doanh_thu,
                AVG(tong_tien) as don_gia_trung_binh,
                MIN(tong_tien) as don_gia_thap_nhat,
                MAX(tong_tien) as don_gia_cao_nhat
            FROM DonHang
            WHERE trang_thai = 'Đã giao'
                AND YEAR(ngay_dat) = ?
                AND (MONTH(ngay_dat) = ? OR ? IS NULL)
            GROUP BY DATE_FORMAT(ngay_dat, '%Y-%m')
            ORDER BY thang_nam DESC
        `, [year || currentYear, month || null, month || null]);
        
        res.json({ 
            success: true, 
            data: rows 
        });
    } catch (error) {
        sendError(res, error);
    }
});

// Top sản phẩm bán chạy
app.get('/api/reports/top-products', async (req, res) => {
    try {
        const { limit = 10, from_date, to_date } = req.query;
        
        let query = `
            SELECT 
                sp.ma_sp,
                sp.ten_sp,
                SUM(ctdh.so_luong) as tong_so_luong_ban,
                SUM(ctdh.thanh_tien) as tong_doanh_thu,
                COUNT(DISTINCT ctdh.ma_dh) as so_don_hang
            FROM ChiTietDonHang ctdh
            JOIN SanPham sp ON ctdh.ma_sp = sp.ma_sp
            JOIN DonHang dh ON ctdh.ma_dh = dh.ma_dh
            WHERE dh.trang_thai = 'Đã giao'
        `;
        
        const params = [];
        
        if (from_date) {
            query += ` AND dh.ngay_dat >= ?`;
            params.push(from_date);
        }
        
        if (to_date) {
            query += ` AND dh.ngay_dat <= ?`;
            params.push(to_date);
        }
        
        query += `
            GROUP BY sp.ma_sp, sp.ten_sp
            ORDER BY tong_so_luong_ban DESC
            LIMIT ?
        `;
        
        params.push(parseInt(limit));
        
        const [rows] = await pool.execute(query, params);
        res.json({ 
            success: true, 
            data: rows 
        });
    } catch (error) {
        sendError(res, error);
    }
});

// Hiệu suất nhân viên
app.get('/api/reports/employee-performance', async (req, res) => {
    try {
        const { year } = req.query;
        
        const [rows] = await pool.execute(`
            SELECT 
                nv.ma_nv,
                nv.ho_ten,
                cv.ten_chuc_vu,
                COUNT(DISTINCT dh.ma_dh) as so_don_ban_hang,
                SUM(dh.tong_tien) as tong_doanh_thu,
                AVG(dh.tong_tien) as doanh_thu_trung_binh
            FROM NhanVien nv
            LEFT JOIN DonHang dh ON nv.ma_nv = dh.ma_nv
            LEFT JOIN ChucVu cv ON nv.ma_chuc_vu = cv.ma_chuc_vu
            WHERE YEAR(dh.ngay_dat) = ? OR dh.ngay_dat IS NULL
            GROUP BY nv.ma_nv, nv.ho_ten, cv.ten_chuc_vu
            ORDER BY tong_doanh_thu DESC
        `, [year || new Date().getFullYear()]);
        
        res.json({ 
            success: true, 
            data: rows 
        });
    } catch (error) {
        sendError(res, error);
    }
});

// Thống kê khách hàng
app.get('/api/reports/customer-stats', async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT 
                kh.ma_kh,
                kh.ho_ten,
                kh.email,
                kh.sdt,
                COUNT(dh.ma_dh) as so_don_da_mua,
                SUM(dh.tong_tien) as tong_tien_da_mua,
                MAX(dh.ngay_dat) as ngay_mua_gan_nhat
            FROM KhachHang kh
            LEFT JOIN DonHang dh ON kh.ma_kh = dh.ma_kh
            GROUP BY kh.ma_kh, kh.ho_ten, kh.email, kh.sdt
            ORDER BY tong_tien_da_mua DESC
        `);
        
        res.json({ 
            success: true, 
            data: rows 
        });
    } catch (error) {
        sendError(res, error);
    }
});

// ================ UTILITY ROUTES ================

// Lấy danh sách chức vụ
app.get('/api/chuc-vu', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM ChucVu ORDER BY ma_chuc_vu');
        res.json({ 
            success: true, 
            data: rows 
        });
    } catch (error) {
        sendError(res, error);
    }
});

// Lấy danh sách khách hàng
app.get('/api/khach-hang', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT ma_kh, ho_ten, email, sdt FROM KhachHang ORDER BY ho_ten');
        res.json({ 
            success: true, 
            data: rows 
        });
    } catch (error) {
        sendError(res, error);
    }
});

// ================ ERROR HANDLING ================
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        success: false,
        message: 'Lỗi server nội bộ',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint không tồn tại'
    });
});

// ================ START SERVER ================
app.listen(PORT, () => {
    console.log(`
🚀 Server đang chạy tại: http://localhost:${PORT}
📊 API Endpoints:

📌 PHẦN 1 - QUẢN LÝ SẢN PHẨM:
   GET    /api/products?shop_id=..&category_id=..  - Danh sách SP theo shop & danh mục
   POST   /api/products                           - Thêm sản phẩm
   PUT    /api/products/:id                       - Sửa sản phẩm  
   DELETE /api/products/:id?shop_id=..            - Xóa sản phẩm
   
📌 PHẦN 1.3 - BÁO CÁO & KIỂM TRA:
   GET    /api/report/inventory?shop_id=..&min_total=..  - Thống kê tồn kho
   GET    /api/voucher/check?donhang_id=..&voucher_id=.. - Kiểm tra voucher

📌 MỤC 3.1 - QUẢN LÝ NHÂN VIÊN:
   GET    /api/employees                          - Danh sách nhân viên
   GET    /api/employees/:id                      - Chi tiết nhân viên
   POST   /api/employees                          - Thêm nhân viên
   PUT    /api/employees/:id                      - Sửa nhân viên
   DELETE /api/employees/:id                      - Xóa nhân viên
   GET    /api/employees/search/filter            - Tìm kiếm nhân viên

📌 MỤC 3.2 - QUẢN LÝ ĐƠN HÀNG:
   GET    /api/orders                             - Danh sách đơn hàng
   GET    /api/orders/:id                         - Chi tiết đơn hàng
   POST   /api/orders                             - Tạo đơn hàng
   PUT    /api/orders/:id/status                  - Cập nhật trạng thái

📌 MỤC 3.3 - BÁO CÁO THỐNG KÊ:
   GET    /api/reports/sales                      - Doanh thu theo tháng
   GET    /api/reports/top-products               - Sản phẩm bán chạy
   GET    /api/reports/employee-performance       - Hiệu suất nhân viên
   GET    /api/reports/customer-stats             - Thống kê khách hàng

📌 UTILITY:
   GET    /api/chuc-vu                            - Danh sách chức vụ
   GET    /api/khach-hang                         - Danh sách khách hàng
   GET    /api/san-pham                           - Danh sách sản phẩm
   GET    /api/health                             - Kiểm tra server
   GET    /api/test-db                            - Kiểm tra database
  `);
});