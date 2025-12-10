using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ThuongMaiDienTu.Models;
using System.Data.Entity;

namespace ThuongMaiDienTu.Controllers
{
    public class GioHangController : Controller
    {
        private trangsucbacEntities db = new trangsucbacEntities();
        // GET: GioHang
        public ActionResult Index()
        {
            if (Session["idNguoiDung"] == null)
            {
                ViewBag.isLogin = false;
                return RedirectToAction("Index", "Account");
            }

            ViewBag.isLogin = true;
            int idNguoiDung = (int)Session["idNguoiDung"];

            using (var db = new trangsucbacEntities())
            {
                var gioHang = db.GioHangs
                    .Where(gh => gh.idNguoiDung == idNguoiDung)
                    .Include(gh => gh.SanPham)
                    .ToList();


                foreach (var item in gioHang)
                {
                    System.Diagnostics.Debug.WriteLine($"SP: {item.idSanPham}, SL: {item.SoLuong}");
                }
                return View(gioHang);
            }
        }

        [HttpPost]
        public ActionResult UpdateCart(int? productId, int quantity, string action)
        {
            try
            {
                if (productId == null || productId == 0)
                {
                    return Json(new { success = false, message = "Product ID không hợp lệ." });
                }

                // Debug:
                System.Diagnostics.Debug.WriteLine($"Mã SP: {productId}");

                int idNguoiDung = (int)Session["idNguoiDung"];

                using (var db = new trangsucbacEntities())
                {
                    var cartItem = db.GioHangs.FirstOrDefault(gh => gh.idNguoiDung == idNguoiDung && gh.idSanPham == productId);

                    if (cartItem == null)
                    {
                        return Json(new { success = false, message = "Sản phẩm không tồn tại trong giỏ hàng." });
                    }

                    if (action == "update")
                    {
                        cartItem.SoLuong = quantity;
                        db.SaveChanges();
                        var cartCount = db.GioHangs
                                .Where(gh => gh.idNguoiDung == idNguoiDung)
                                .Sum(gh => (int?)gh.SoLuong) ?? 0;
                        Session["cartCount"] = cartCount;
                        return Json(new { success = true, message = "Cập nhật số lượng thành công." });
                    }
                    else if (action == "delete")
                    {
                        db.GioHangs.Remove(cartItem);
                        db.SaveChanges();

                        var cartItems = db.GioHangs
                            .Where(gh => gh.idNguoiDung == idNguoiDung)
                            .ToList();
                        var cartCount = cartItems.Sum(g => g.SoLuong);
                        Session["cartCount"] = cartCount;
                        return Json(new { success = true, message = "Xóa sản phẩm khỏi giỏ hàng thành công." });
                    }

                    return Json(new { success = false, message = "Hành động không hợp lệ." });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Lỗi server: " + ex.Message });
            }
        }



        [HttpPost]
        public ActionResult ThemGioHang(int idSanPham, int soLuong, string size)
        {
            try
            {
                using (var db = new trangsucbacEntities())
                {
                    if (Session["idNguoiDung"] == null)
                    {
                        return Json(new { success = false, message = "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng." });
                    }

                    int idNguoiDung = (int)Session["idNguoiDung"];

                    System.Diagnostics.Debug.WriteLine($"Params: idSanPham={idSanPham}, soLuong={soLuong}, size={size}, idNguoiDung={idNguoiDung}");

                    var sanPham = db.SanPhams.Find(idSanPham);
                    if (sanPham == null)
                    {
                        return Json(new { success = false, message = "Sản phẩm không tồn tại" });
                    }

                    var gioHangItem = db.GioHangs
                        .FirstOrDefault(gh => gh.idNguoiDung == idNguoiDung
                                            && gh.idSanPham == idSanPham
                                            && gh.Size == size);

                    if (gioHangItem != null)
                    {
                        gioHangItem.SoLuong += soLuong;
                    }
                    else
                    {
                        db.GioHangs.Add(new GioHang
                        {
                            idNguoiDung = idNguoiDung,
                            idSanPham = idSanPham,
                            SoLuong = soLuong,
                            Size = size
                        });
                    }

                    db.SaveChanges();

                    var cartItems = db.GioHangs
                        .Where(gh => gh.idNguoiDung == idNguoiDung)
                        .ToList();

                    var cartCount = cartItems.Sum(g => g.SoLuong);
                    Session["cartCount"] = cartCount;

                    return Json(new
                    {
                        success = true,
                        cartCount = cartCount,
                        actualItems = cartItems.Select(g => new
                        {
                            id = g.idSanPham,
                            qty = g.SoLuong
                        })
                    });
                }
            }
            catch (Exception ex)
            {
                // Log lỗi
                System.Diagnostics.Debug.WriteLine(ex.ToString());
                return Json(new
                {
                    success = false,
                    message = "Lỗi server: " + ex.Message,
                    stackTrace = ex.StackTrace
                });
            }
        }
    }
}