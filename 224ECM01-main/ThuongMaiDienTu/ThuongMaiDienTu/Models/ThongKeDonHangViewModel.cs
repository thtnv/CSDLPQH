using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ThuongMaiDienTu.Models
{
    public class ThongKeDonHangViewModel
    {
        public DateTime? TuNgay { get; set; }
        public DateTime? DenNgay { get; set; }
        public string LoaiThongKe { get; set; }

        public List<ThongKeDonHangItem> DanhSachThongKe { get; set; }
    }

    public class ThongKeDonHangItem
    {
        public int? Ngay { get; set; }
        public int? Thang { get; set; }
        public int Nam { get; set; }

        public int SoLuongDonHang { get; set; }
        public decimal TongDoanhThu { get; set; }
    }

}