using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ThuongMaiDienTu.Models
{
    public class ReviewViewModel
    {
        public int IdNguoiDung { get; set; }
        public string HoTen { get; set; }
        public string NoiDung { get; set; }
        public int SoSao { get; set; }
    }
}