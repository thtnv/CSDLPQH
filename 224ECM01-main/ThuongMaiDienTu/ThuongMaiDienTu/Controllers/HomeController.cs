using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ThuongMaiDienTu.Models;

namespace ThuongMaiDienTu.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
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

		
				var similarProducts = db.SanPhams
										.Include("DanhMuc")
										.Take(4)
										.ToList();
				ViewBag.SimilarProducts = similarProducts;
				ViewBag.listDanhMuc = db.DanhMucs.ToList();
				ViewBag.PopularProducts = db.SanPhams.OrderBy(p => p.idSanPham).Take(2).ToList();

            }

            return View();
        }
       
        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

    }
}