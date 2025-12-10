using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ThuongMaiDienTu.Models
{
    public class ThongKeSanPhamViewModel
    {
        public string TenSanPham { get; set; }
        public string TenDanhMuc { get; set; }
        public int SoLuongBan { get; set; }
        public int DoanhThu { get; set; }
    }
}