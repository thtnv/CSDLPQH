using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ThuongMaiDienTu.Models
{
    public class DatHangViewModel
    {
       
        
            public string Email { get; set; }
            public string HoTen { get; set; }
            public string SoDienThoai { get; set; }
            public string DiaChi { get; set; }
            public string GhiChu { get; set; }
            public int? idNguoiDung { get; set; } // nếu đăng nhập
        

    }
}