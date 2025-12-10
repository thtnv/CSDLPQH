using System;
using System.Data.Entity;
using System.Linq;
using System.Web.Mvc;
using ThuongMaiDienTu.Models;

namespace ThuongMaiDienTu.Controllers
{
    public class ThanhToanController : Controller
    {
        private readonly trangsucbacEntities _context;

        // Constructor
        public ThanhToanController()
        {
            _context = new trangsucbacEntities();
        }

        // Phương thức Index (Hiển thị giỏ hàng)
        public ActionResult Index()
        {
            if (Session["idNguoiDung"] == null)
            {
                ViewBag.isLogin = false;
            }
            else
            {
                ViewBag.isLogin = true;
            }
            int userId = (int)Session["idNguoiDung"];
            var gioHang = _context.GioHangs
                                  .Include(g => g.SanPham) // Kết hợp với bảng SanPham
                                  .Where(g => g.idNguoiDung == userId) // Lọc theo người dùng
                                  .ToList();

            // Tính tổng tiền của giỏ hàng
            var tongTien = gioHang.Sum(g => g.SanPham.GiaBan * g.SoLuong);

            // Truyền dữ liệu sang View
            ViewBag.TongTien = tongTien;
            return View(gioHang);
        }
        [HttpPost]
        public ActionResult DatHang(DatHangViewModel model)
        {
            if (!ModelState.IsValid)
                return Json(new { success = false, message = "Dữ liệu không hợp lệ." });

            if (Session["idNguoiDung"] == null)
                return Json(new { success = false, message = "Bạn cần đăng nhập trước khi đặt hàng." });

            int userId = (int)Session["idNguoiDung"];

            var gioHang = _context.GioHangs
                                  .Include(g => g.SanPham)
                                  .Where(g => g.idNguoiDung == userId)
                                  .ToList();

            if (gioHang == null || !gioHang.Any())
                return Json(new { success = false, message = "Giỏ hàng trống." });

            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    // 1. Tạo hóa đơn
                    var hoaDon = new HoaDon
                    {
                        email = model.Email,
                        hoTen = model.HoTen,
                        soDienThoai = model.SoDienThoai,
                        diaChi = model.DiaChi,
                        ghiChu = model.GhiChu,
                        ngayLap = DateTime.Now,
                        tongTien = gioHang.Sum(x => x.SoLuong * x.SanPham.GiaBan),
                        idNguoiDung = userId
                    };

                    _context.HoaDons.Add(hoaDon);
                    _context.SaveChanges(); // Để lấy được hoaDon.idHoaDon

                    // 2. Thêm từng chi tiết hóa đơn
                    foreach (var item in gioHang)
                    {
                        var chiTiet = new ChiTietHoaDon
                        {
                            idHoaDon = hoaDon.idHoaDon,
                            idSanPham = item.idSanPham,
                            soLuong = item.SoLuong,
                            giaBan = item.SanPham.GiaBan
                        };
                        _context.ChiTietHoaDons.Add(chiTiet);
                    }
                    _context.SaveChanges();

                    // 3. Xóa giỏ hàng
                    _context.GioHangs.RemoveRange(gioHang);
                    _context.SaveChanges();

                    transaction.Commit();
                    Session["cartCount"] = 0;

                    return Json(new { success = true, message = "Đặt hàng thành công!" });
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    System.Diagnostics.Debug.WriteLine("Lỗi đặt hàng: " + ex.Message);
                    return Json(new { success = false, message = "Lỗi trong quá trình đặt hàng: " + ex.Message });
                }
            }
        }
        public ActionResult MuaLai(int idHoaDon)
        {
            if (Session["idNguoiDung"] == null)
            {
                return RedirectToAction("Index", "Account");
            }

            int userId = (int)Session["idNguoiDung"];

            var hoaDon = _context.HoaDons
                .Include(h => h.ChiTietHoaDons.Select(ct => ct.SanPham))
                .FirstOrDefault(h => h.idHoaDon == idHoaDon && h.idNguoiDung == userId);

            if (hoaDon == null)
            {
                return HttpNotFound("Hóa đơn không tồn tại hoặc không thuộc quyền truy cập.");
            }

            // Xóa giỏ hàng cũ (tuỳ chọn, nếu muốn giữ lại thì bỏ đoạn này)
            var gioHangCu = _context.GioHangs.Where(g => g.idNguoiDung == userId).ToList();
            _context.GioHangs.RemoveRange(gioHangCu);

            // Thêm lại các sản phẩm từ đơn cũ vào giỏ hàng
            foreach (var item in hoaDon.ChiTietHoaDons)
            {
                _context.GioHangs.Add(new GioHang
                {
                    idNguoiDung = userId,
                    idSanPham = item.idSanPham,
                    SoLuong = item.soLuong
                });
            }

            _context.SaveChanges();

            // Chuyển đến trang ThanhToan
            return RedirectToAction("Index");
        }


    }
}
