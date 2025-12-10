using System.Diagnostics;
using System.Linq;
using System.Web.Mvc;
using ThuongMaiDienTu.Models;

namespace ThuongMaiDienTu.Controllers
{
    public class DanhMucController : Controller
    {
        private readonly trangsucbacEntities _context;

        public DanhMucController()
        {
            _context = new trangsucbacEntities();
        }

        // Phương thức Index (Hiển thị danh mục)
        public ActionResult Index(int? idDanhMuc)
        {
            Debug.WriteLine("idDanhMuc: " + idDanhMuc);
            var danhMucs = _context.DanhMucs.ToList();
            var sanPhams = _context.SanPhams.AsQueryable();

            if (Session["idNguoiDung"] == null)
            {
                ViewBag.isLogin = false;
            }
            else
            {
                ViewBag.isLogin = true;
            }

            if (idDanhMuc.HasValue)
            {
                sanPhams = sanPhams.Where(sp => sp.idDanhMuc == idDanhMuc);
                ViewBag.TenDanhMuc = danhMucs.FirstOrDefault(dm => dm.idDanhMuc == idDanhMuc).tenDanhMuc;
            }

            var viewModel = new SanPhamViewModel
            {
                DanhMucs = danhMucs,
                SanPhams = sanPhams.ToList()
            };

            ViewBag.KetQuaTim = viewModel.SanPhams.Count();


            return View(viewModel);
        }
        [ChildActionOnly]
        public ActionResult MenuDanhMuc()
        {
            var list = _context.DanhMucs.ToList();
            return PartialView("_MenuDanhMuc", list);
        }
    }
}
