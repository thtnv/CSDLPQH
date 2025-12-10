using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ThuongMaiDienTu.Models;

namespace ThuongMaiDienTu.Controllers
{
    public class LichSuDatHangController : Controller
    {
        private readonly trangsucbacEntities _context;

        // Constructor to initialize the database context
        public LichSuDatHangController()
        {
            _context = new trangsucbacEntities();
        }

        // GET: LichSuDatHang
        public ActionResult Index()
        {
            if (Session["idNguoiDung"] == null)
            {
                ViewBag.isLogin = false;
                return RedirectToAction("Index", "Account"); 
            }

            ViewBag.isLogin = true;

            int userId = (int)Session["idNguoiDung"];
            System.Diagnostics.Debug.WriteLine("userId from session = " + userId);

            var orderHistory = _context.HoaDons
    .Include(h => h.ChiTietHoaDons.Select(ct => ct.SanPham.DanhMuc))
    .Where(h => h.idNguoiDung == userId)
    .OrderByDescending(h => h.idHoaDon)
    .ToList();

            //System.Diagnostics.Debug.WriteLine("Order History Count: " + orderHistory.Count);

            return View(orderHistory); // Pass the order history to the view
        }

        // Dispose the context to release resources
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _context.Dispose();
            }
            base.Dispose(disposing);
        }
        public ActionResult Details(int id)
        {
            if (Session["idNguoiDung"] == null)
                return RedirectToAction("Index", "Account");

            int userId = (int)Session["idNguoiDung"];

            var hoaDon = _context.HoaDons
                .Include(h => h.ChiTietHoaDons.Select(ct => ct.SanPham.DanhMuc))
                .FirstOrDefault(h => h.idHoaDon == id && h.idNguoiDung == userId);

            if (hoaDon == null)
                return HttpNotFound("Hóa đơn không tồn tại hoặc bạn không có quyền xem.");

            return View("Details", hoaDon);
        }

        [HttpPost]
        public ActionResult GuiDanhGia(int idChiTietHD, int soSao, string noiDung)
        {
            if (Session["idNguoiDung"] == null)
            {
                Response.StatusCode = 401; // Unauthorized
                return Json(new { success = false, message = "Please login to rate a product" }, JsonRequestBehavior.AllowGet);
            }
            int userId = (int)Session["idNguoiDung"];
            try
            {
                var chiTietHD = _context.ChiTietHoaDons
                    .Include(ct => ct.HoaDon)
                    .FirstOrDefault(ct => ct.idChiTietHD == idChiTietHD && ct.HoaDon.idNguoiDung == userId);

                if (chiTietHD == null)
                {
                    return Json(new { success = false, message = "Not found" });
                }

                // Kiểm tra xem sản phẩm đã được đánh giá chưa
                var existingReview = _context.DanhGias
                    .FirstOrDefault(d => d.idChiTietHD == idChiTietHD && d.idNguoiDung == userId);

                if (existingReview != null)
                {
                    return Json(new { success = false, message = "You've rate this product" });
                }

                // Tạo đánh giá mới
                var danhGia = new DanhGia
                {
                    idNguoiDung = userId,
                    idChiTietHD = idChiTietHD,
                    soSao = soSao,
                    noiDung = noiDung
                };

                _context.DanhGias.Add(danhGia);
                _context.SaveChanges();

                return Json(new { success = true, message = "Thank you!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Error: " + ex.Message });
            }
        }

    }
}