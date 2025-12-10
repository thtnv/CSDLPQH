using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ThuongMaiDienTu.Models;

namespace ThuongMaiDienTu.Controllers
{
    public class DetailsController : Controller
    {
        // GET: Details
        public ActionResult Index(int id, int page = 1)
        {
            using (var db = new trangsucbacEntities())
            {
                if (Session["idNguoiDung"] == null)
                {
                    ViewBag.isLogin = false;
                }
                else
                {
                    ViewBag.isLogin = true;
                }
                var product = db.SanPhams.Find(id);
                if (product == null)
                {
                    return HttpNotFound();
                }
                var danhMuc = db.DanhMucs.FirstOrDefault(dm => dm.idDanhMuc == product.idDanhMuc);
                var sanPhamLienQuan = db.SanPhams
                    .Where(sp => sp.idDanhMuc == product.idDanhMuc && sp.idSanPham != id)
                    .ToList();

                ViewBag.SanPhamLienQuan = sanPhamLienQuan;

                var listDanhMuc = db.DanhMucs.ToList();

                if (!string.IsNullOrEmpty(product.HinhAnh))
                {
                    ViewBag.Images = JsonConvert.DeserializeObject<string[]>(product.HinhAnh);
                }
                else
                {
                    ViewBag.Images = new string[0];
                }

                const int pageSize = 5;
                if (page < 1) page = 1;

                var rawReviews = (from dg in db.DanhGias
                                  join cthd in db.ChiTietHoaDons on dg.idChiTietHD equals cthd.idChiTietHD
                                  join nd in db.NguoiDungs on dg.idNguoiDung equals nd.idNguoiDung
                                  where cthd.idSanPham == id
                                  select new
                                  {
                                      IdNguoiDung = dg.idNguoiDung,
                                      HoTen = nd.HoTen,
                                      NoiDung = dg.noiDung,
                                      SoSao = dg.soSao
                                  }).ToList();

                var allReviews = rawReviews.Select(x => new ReviewViewModel
                {
                    IdNguoiDung = x.IdNguoiDung ?? 0,
                    HoTen = x.HoTen ?? ("User " + (x.IdNguoiDung?.ToString() ?? "Unknown")),
                    NoiDung = x.NoiDung,
                    SoSao = x.SoSao ?? 0
                }).ToList();

                int totalReviews = allReviews.Count;
                int totalPages = (int)Math.Ceiling((double)totalReviews / pageSize);

                var reviews = allReviews
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();

                double averageRating = allReviews.Any() ? allReviews.Average(r => r.SoSao) : 0;

                var ratingStats = new Dictionary<int, int>
                {
                    { 5, allReviews.Count(r => r.SoSao == 5) },
                    { 4, allReviews.Count(r => r.SoSao == 4) },
                    { 3, allReviews.Count(r => r.SoSao == 3) },
                    { 2, allReviews.Count(r => r.SoSao == 2) },
                    { 1, allReviews.Count(r => r.SoSao == 1) }
                };

                ViewBag.Reviews = reviews;
                ViewBag.AverageRating = averageRating;
                ViewBag.HasReviews = reviews.Any();
                ViewBag.RatingStats = ratingStats;
                ViewBag.TotalReviews = totalReviews;
                ViewBag.TenDanhMuc = danhMuc?.tenDanhMuc;

                ViewBag.ListDanhMuc = listDanhMuc;
                ViewBag.CurrentPage = page;
                ViewBag.TotalPages = totalPages;
                ViewBag.ProductId = id;

                return View(product);
            }
        }

        [HttpGet]
        public ActionResult GetReviews(int id, int page = 1)
        {
            using (var db = new trangsucbacEntities())
            {
                const int pageSize = 5;
                if (page < 1) page = 1;

                var rawReviews = (from dg in db.DanhGias
                                  join cthd in db.ChiTietHoaDons on dg.idChiTietHD equals cthd.idChiTietHD
                                  join nd in db.NguoiDungs on dg.idNguoiDung equals nd.idNguoiDung
                                  where cthd.idSanPham == id
                                  select new
                                  {
                                      IdNguoiDung = dg.idNguoiDung,
                                      HoTen = nd.HoTen,
                                      NoiDung = dg.noiDung,
                                      SoSao = dg.soSao
                                  }).ToList();

                var allReviews = rawReviews.Select(x => new ReviewViewModel
                {
                    IdNguoiDung = x.IdNguoiDung ?? 0,
                    HoTen = x.HoTen ?? ("User " + (x.IdNguoiDung?.ToString() ?? "Unknown")),
                    NoiDung = x.NoiDung,
                    SoSao = x.SoSao ?? 0
                }).ToList();

                int totalReviews = allReviews.Count;
                int totalPages = (int)Math.Ceiling((double)totalReviews / pageSize);

                var reviews = allReviews
                       .Skip((page - 1) * pageSize)
                       .Take(pageSize)
                       .ToList();

                var response = new
                {
                    Reviews = reviews,
                    CurrentPage = page,
                    TotalPages = totalPages,
                    TotalReviews = totalReviews
                };

                return Json(response, JsonRequestBehavior.AllowGet);
            }
        }
    }
}