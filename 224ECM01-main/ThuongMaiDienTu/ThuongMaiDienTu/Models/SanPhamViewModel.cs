using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ThuongMaiDienTu.Models
{
    public class SanPhamViewModel
    {
        public List<SanPham> SanPhams { get; set; }
        public List<DanhMuc> DanhMucs { get; set; }
    }
}