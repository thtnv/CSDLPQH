using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Linq;
using System.Web.Mvc;
using ThuongMaiDienTu.Models;
using System.Data.Entity;
using Newtonsoft.Json;
using System.IO;
using System.Web;

namespace ThuongMaiDienTu.Controllers
{
    public class AdminController : Controller
    {
        private trangsucbacEntities db = new trangsucbacEntities();

        // GET: Admin
        public ActionResult HomeAdmin()
        {
            if (Session["idNguoiDung"] == null)
            {
                //Response.StatusCode = 401; // Unauthorized
                return RedirectToAction("Index", "Account");
            }
            return View();
        }

        public ActionResult QLUsers(int? id = null)
        {
            if (id.HasValue)
            {
                var user = db.NguoiDungs.Find(id.Value);
                if (user != null)
                {
                    db.NguoiDungs.Remove(user);
                    db.SaveChanges();
                }
            }

            var danhSachNguoiDung = db.NguoiDungs.ToList();
            return View(danhSachNguoiDung);
        }

        [HttpPost]
        public ActionResult Delete(int id)
        {
            var user = db.NguoiDungs.Find(id);
            if (user != null)
            {
                db.NguoiDungs.Remove(user);
                db.SaveChanges();
            }
            return RedirectToAction("QLUsers");
        }

        public ActionResult CEUsers(int? idNguoiDung, string chucnang)
        {
            ViewBag.ChucNang = chucnang;

            var model = new NguoiDung(); // Tạo model rỗng nếu là tạo mới
            if (chucnang == "edit" && idNguoiDung.HasValue)
            {
                model = db.NguoiDungs.Find(idNguoiDung.Value);
                if (model == null)
                {
                    return HttpNotFound();
                }
            }

            return View(model);
        }


        [HttpPost]
        public ActionResult EditUser(NguoiDung model)
        {
            if (ModelState.IsValid)
            {
                db.Entry(model).State = System.Data.Entity.EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("QLUsers");
            }
            ViewBag.ChucNang = "edit";
            return View("CEUsers", model);
        }

        [HttpPost]
        public ActionResult CreateUser(NguoiDung model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    db.NguoiDungs.Add(model);
                    db.SaveChanges();
                    return RedirectToAction("QLUsers");
                }
            }
            catch (DbEntityValidationException ex)
            {
                foreach (var validationErrors in ex.EntityValidationErrors)
                {
                    foreach (var validationError in validationErrors.ValidationErrors)
                    {
                        System.Diagnostics.Debug.WriteLine(
                            $"Property: {validationError.PropertyName}, Error: {validationError.ErrorMessage}");
                    }
                }

                ViewBag.ChucNang = "create";
                return View("CEUsers", model);
            }

            ViewBag.ChucNang = "create";
            return View("CEUsers", model);
        }

        public ActionResult ChiTietGD()
        {
            var hoaDons = db.HoaDons.Include("NguoiDung").ToList();
            return View(hoaDons);
        }

        // GET: /Admin/Admin/ThongKeSanPham
        public ActionResult ThongKeSanPham()
        {
            var thongKe = db.ChiTietHoaDons
                .GroupBy(ct => new
                {
                    ct.SanPham.TenSanPham,
                    ct.SanPham.DanhMuc.tenDanhMuc
                })
                .Select(g => new ThongKeSanPhamViewModel
                {
                    TenSanPham = g.Key.TenSanPham,
                    TenDanhMuc = g.Key.tenDanhMuc,
                    SoLuongBan = g.Sum(x => x.soLuong),
                    DoanhThu = g.Sum(x => x.soLuong * x.giaBan)
                })
                .OrderByDescending(x => x.DoanhThu)
                .ToList();

            return View(thongKe);
        }

        public ActionResult ThongKeDonHang(DateTime? tuNgay, DateTime? denNgay, string loaiThongKe = "ngay")
        {
            // Logic lấy dữ liệu như đã xử lý trước đó
            var thongKe = LayDuLieuThongKe(tuNgay, denNgay, loaiThongKe);

            var viewModel = new ThongKeDonHangViewModel
            {
                TuNgay = tuNgay,
                DenNgay = denNgay,
                LoaiThongKe = loaiThongKe,
                DanhSachThongKe = thongKe
            };

            return View(viewModel);
        }
        private List<ThongKeDonHangItem> LayDuLieuThongKe(DateTime? tuNgay, DateTime? denNgay, string loaiThongKe)
        {
            var query = db.HoaDons.AsQueryable();

            if (tuNgay.HasValue)
                query = query.Where(h => h.ngayLap >= tuNgay.Value);
            if (denNgay.HasValue)
                query = query.Where(h => h.ngayLap <= denNgay.Value);

            var result = new List<ThongKeDonHangItem>();

            switch (loaiThongKe)
            {
                case "ngay":
                    result = query
                        .GroupBy(h => new
                        {
                            Day = h.ngayLap.Value.Day,
                            Month = h.ngayLap.Value.Month,
                            Year = h.ngayLap.Value.Year
                        })
                        .Select(g => new ThongKeDonHangItem
                        {
                            Ngay = g.Key.Day,
                            Thang = g.Key.Month,
                            Nam = g.Key.Year,
                            SoLuongDonHang = g.Count(),
                            TongDoanhThu = g.Sum(x => x.tongTien ?? 0)
                        })
                        .OrderBy(g => g.Nam).ThenBy(g => g.Thang).ThenBy(g => g.Ngay)
                        .ToList();
                    break;


                case "thang":
                    result = query
                        .GroupBy(h => new { h.ngayLap.Value.Year, h.ngayLap.Value.Month })
                        .Select(g => new ThongKeDonHangItem
                        {
                            Thang = g.Key.Month,
                            Nam = g.Key.Year,
                            SoLuongDonHang = g.Count(),
                            TongDoanhThu = g.Sum(x => x.tongTien ?? 0)
                        })
                        .OrderBy(g => g.Nam).ThenBy(g => g.Thang)
                        .ToList();
                    break;

                case "nam":
                    result = query
                        .GroupBy(h => h.ngayLap.Value.Year)
                        .Select(g => new ThongKeDonHangItem
                        {
                            Nam = g.Key,
                            SoLuongDonHang = g.Count(),
                            TongDoanhThu = g.Sum(x => x.tongTien ?? 0)
                        })
                        .OrderBy(g => g.Nam)
                        .ToList();
                    break;
            }
            return result; // Trả về dữ liệu thống kê phù hợp
        }
        // GET: Admin/QLSanPham
        public ActionResult QLSanPham(int? id = null)
        {
            if (id.HasValue)
            {
                var sanPham = db.SanPhams.Find(id.Value);
                if (sanPham != null)
                {
                    db.SanPhams.Remove(sanPham);
                    db.SaveChanges();
                }
            }

            var danhSachSanPham = db.SanPhams.Include(sp => sp.DanhMuc).ToList();
            return View(danhSachSanPham);
        }

        // POST: Admin/DeleteSanPham
        [HttpPost]
        public ActionResult DeleteSanPham(int id)
        {
            var sanPham = db.SanPhams.Find(id);
            if (sanPham != null)
            {
                db.SanPhams.Remove(sanPham);
                db.SaveChanges();
            }
            return RedirectToAction("QLSanPham");
        }

        // GET: Admin/CESanPham
        public ActionResult CESanPham(int? idSanPham, string chucnang)
        {
            ViewBag.ChucNang = chucnang;
            ViewBag.DanhMucList = new SelectList(db.DanhMucs, "idDanhMuc", "tenDanhMuc");

            var model = new SanPham();
            if (chucnang == "edit" && idSanPham.HasValue)
            {
                model = db.SanPhams.Include(sp => sp.DanhMuc).FirstOrDefault(sp => sp.idSanPham == idSanPham.Value);
                if (model == null)
                {
                    return HttpNotFound();
                }
            }

            return View(model);
        }

        // POST: Admin/CreateSanPham
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult CreateSanPham(SanPham model, HttpPostedFileBase[] HinhAnhFiles)
        {
            try
            {
                // Validate số lượng ảnh
                if (HinhAnhFiles == null || HinhAnhFiles.Length != 4)
                {
                    ModelState.AddModelError("", "Vui lòng upload đúng 4 ảnh");
                    ViewBag.ChucNang = "create";
                    ViewBag.DanhMucList = new SelectList(db.DanhMucs, "idDanhMuc", "tenDanhMuc", model.idDanhMuc);
                    return View("CESanPham", model);
                }

                // Xử lý upload ảnh
                var imageNames = new List<string>();
                var uploadPath = Server.MapPath("~/img");

                foreach (var file in HinhAnhFiles)
                {
                    if (file != null && file.ContentLength > 0)
                    {
                        // Kiểm tra định dạng ảnh
                        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
                        var extension = Path.GetExtension(file.FileName).ToLower();

                        if (!allowedExtensions.Contains(extension))
                        {
                            ModelState.AddModelError("", "Chỉ chấp nhận file ảnh (jpg, jpeg, png, gif)");
                            ViewBag.ChucNang = "create";
                            ViewBag.DanhMucList = new SelectList(db.DanhMucs, "idDanhMuc", "tenDanhMuc", model.idDanhMuc);
                            return View("CESanPham", model);
                        }

                        // Tạo tên file mới
                        var fileName = Path.GetFileNameWithoutExtension(file.FileName);
                        var newFileName = $"{fileName}_{Guid.NewGuid()}{extension}";
                        var fullPath = Path.Combine(uploadPath, newFileName);

                        // Lưu file
                        file.SaveAs(fullPath);
                        imageNames.Add(newFileName);
                    }
                }

                // Lưu tên ảnh dưới dạng JSON
                model.HinhAnh = Newtonsoft.Json.JsonConvert.SerializeObject(imageNames);

                System.Diagnostics.Debug.WriteLine($"testHinhAnh: {model.HinhAnh}");

                db.SanPhams.Add(model);
                db.SaveChanges();
                return RedirectToAction("QLSanPham");
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("", "Có lỗi xảy ra: " + ex.Message);
                ViewBag.ChucNang = "create";
                ViewBag.DanhMucList = new SelectList(db.DanhMucs, "idDanhMuc", "tenDanhMuc", model.idDanhMuc);
                return View("CESanPham", model);
            }
        }


        // POST: Admin/EditSanPham
        //[HttpPost]
        //[ValidateAntiForgeryToken]
        //public ActionResult EditSanPham(SanPham model)
        //{
        //    if (ModelState.IsValid)
        //    {
        //        db.Entry(model).State = EntityState.Modified;
        //        db.SaveChanges();
        //        return RedirectToAction("QLSanPham");
        //    }

        //    ViewBag.ChucNang = "edit";
        //    ViewBag.DanhMucList = new SelectList(db.DanhMucs, "idDanhMuc", "tenDanhMuc", model.idDanhMuc);
        //    return View("CESanPham", model);
        //}
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult EditSanPham(SanPham model, HttpPostedFileBase[] HinhAnhFiles, IEnumerable<string> ExistingImages, string removedImages)
        {
            try
            {
                var product = db.SanPhams.Find(model.idSanPham);
                if (product == null)
                {
                    return HttpNotFound();
                }

                // Xử lý ảnh
                var currentImages = ExistingImages != null ? ExistingImages.ToList() : new List<string>();

                // Xóa ảnh đã chọn xóa
                if (!string.IsNullOrEmpty(removedImages))
                {
                    var imagesToRemove = removedImages.Split(',');
                    foreach (var img in imagesToRemove)
                    {
                        var path = Path.Combine(Server.MapPath("~/img"), img);
                        if (System.IO.File.Exists(path))
                        {
                            System.IO.File.Delete(path);
                        }
                    }
                    currentImages.RemoveAll(img => imagesToRemove.Contains(img));
                }

                // Thêm ảnh mới
                if (HinhAnhFiles != null && HinhAnhFiles.Length > 0)
                {
                    // Tính toán số lượng ảnh cần thêm
                    var remainingSlots = 4 - currentImages.Count;
                    if (HinhAnhFiles.Length != remainingSlots)
                    {
                        ModelState.AddModelError("", $"Bạn cần upload chính xác {remainingSlots} ảnh để có tổng cộng 4 ảnh");
                        ViewBag.ChucNang = "edit";
                        ViewBag.DanhMucList = new SelectList(db.DanhMucs, "idDanhMuc", "tenDanhMuc", model.idDanhMuc);
                        return View("CESanPham", model);
                    }

                    var uploadPath = Server.MapPath("~/img");
                    foreach (var file in HinhAnhFiles)
                    {
                        if (file != null && file.ContentLength > 0)
                        {
                            // Kiểm tra định dạng ảnh
                            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
                            var extension = Path.GetExtension(file.FileName).ToLower();

                            if (!allowedExtensions.Contains(extension))
                            {
                                ModelState.AddModelError("", "Chỉ chấp nhận file ảnh (jpg, jpeg, png, gif)");
                                ViewBag.ChucNang = "edit";
                                ViewBag.DanhMucList = new SelectList(db.DanhMucs, "idDanhMuc", "tenDanhMuc", model.idDanhMuc);
                                return View("CESanPham", model);
                            }

                            // Tạo tên file mới
                            var fileName = Path.GetFileNameWithoutExtension(file.FileName);
                            var newFileName = $"{fileName}_{Guid.NewGuid()}{extension}";
                            var fullPath = Path.Combine(uploadPath, newFileName);

                            // Lưu file
                            file.SaveAs(fullPath);
                            currentImages.Add(newFileName);
                        }
                    }
                }

                // Kiểm tra tổng số ảnh
                if (currentImages.Count != 4)
                {
                    ModelState.AddModelError("", "Sản phẩm phải có đúng 4 ảnh");
                    ViewBag.ChucNang = "edit";
                    ViewBag.DanhMucList = new SelectList(db.DanhMucs, "idDanhMuc", "tenDanhMuc", model.idDanhMuc);
                    return View("CESanPham", model);
                }

                // Cập nhật thông tin sản phẩm
                product.TenSanPham = model.TenSanPham;
                product.idDanhMuc = model.idDanhMuc;
                product.GiaBan = model.GiaBan;
                product.Size = model.Size;
                product.SoLuong = model.SoLuong;
                product.MoTa = model.MoTa;
                product.HinhAnh = Newtonsoft.Json.JsonConvert.SerializeObject(currentImages);

                db.Entry(product).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("QLSanPham");
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("", "Có lỗi xảy ra: " + ex.Message);
                ViewBag.ChucNang = "edit";
                ViewBag.DanhMucList = new SelectList(db.DanhMucs, "idDanhMuc", "tenDanhMuc", model.idDanhMuc);
                return View("CESanPham", model);
            }
        }



        private string UploadImages(HttpPostedFileBase[] files)
        {
            if (files == null || files.Length == 0)
                return null;

            var uploadedImages = new List<string>();
            var uploadPath = Server.MapPath("~/img");

            System.Diagnostics.Debug.WriteLine($"ImagLocation: {uploadPath} uploadedImages: {uploadedImages}");

            foreach (var file in files.Take(4)) // Chỉ lấy tối đa 4 file
            {
                if (file != null && file.ContentLength > 0)
                {
                    var fileName = Path.GetFileNameWithoutExtension(file.FileName);
                    var extension = Path.GetExtension(file.FileName);
                    var newFileName = $"{fileName}_{Guid.NewGuid()}{extension}";
                    var path = Path.Combine(uploadPath, newFileName);

                    file.SaveAs(path);
                    uploadedImages.Add(newFileName);
                }
            }

            return JsonConvert.SerializeObject(uploadedImages);
        }
    }
}