-- Xóa và tạo lại database
USE master;
GO
IF EXISTS (SELECT name FROM sys.databases WHERE name = N'trangsucbac')
BEGIN
    ALTER DATABASE [trangsucbac] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE [trangsucbac];
END

create database trangsucbac
go
USE trangsucbac
GO

CREATE TABLE DanhMuc(
	[idDanhMuc] [int] PRIMARY KEY IDENTITY(1,1) NOT NULL,
	[tenDanhMuc] [nvarchar](255) NULL,
	[moTa] [nvarchar](3000) NULL
)

CREATE TABLE SanPham (
    idSanPham INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
    idDanhMuc INT NOT NULL,                      -- Liên kết đến bảng DanhMuc
    TenSanPham NVARCHAR(255) NOT NULL,
    GiaBan INT NOT NULL,
    HinhAnh NVARCHAR(500) NULL,                  -- Đường dẫn ảnh hoặc URL ảnh
    Size NVARCHAR(50) NULL,                      -- Ví dụ: 16,18,19
    SoLuong INT NOT NULL DEFAULT 0,              -- Số lượng sản phẩm còn trong kho
    MoTa NVARCHAR(3000) NULL,
    FOREIGN KEY (idDanhMuc) REFERENCES DanhMuc(idDanhMuc)  -- Ràng buộc khóa ngoại
);
CREATE TABLE NguoiDung (
    idNguoiDung INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
    HoTen NVARCHAR(255) NOT NULL,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    SoDienThoai NVARCHAR(20) NULL,
    DiaChi NVARCHAR(500) NULL,
    MatKhau NVARCHAR(255) NOT NULL,
    PhanQuyen NVARCHAR(50) NOT NULL  -- ví dụ: 'admin', 'user', 'seller'
);

CREATE TABLE GioHang (
    idGioHang INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
    idNguoiDung INT NOT NULL,
    idSanPham INT NOT NULL,
    SoLuong INT NOT NULL DEFAULT 1,
    Size NVARCHAR(50) NULL,

    FOREIGN KEY (idSanPham) REFERENCES SanPham(idSanPham),
    FOREIGN KEY (idNguoiDung) REFERENCES NguoiDung(idNguoiDung)
);

CREATE TABLE HoaDon (
    idHoaDon INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    [idNguoiDung] INT NULL,  -- sửa kiểu dữ liệu để khớp với bảng NguoiDung
    [ngayLap] DATE NULL,
    [tongTien] INT NULL,
    [diaChi] NVARCHAR(MAX) NULL,
    [hoTen] NVARCHAR(100) NULL,
    [soDienThoai] NCHAR(10) NULL,
    [email] NVARCHAR(100) NULL,
    [ghiChu] NVARCHAR(MAX) NULL,
    
    CONSTRAINT FK_HoaDon_NguoiDung FOREIGN KEY (idNguoiDung) REFERENCES NguoiDung(idNguoiDung)
);


CREATE TABLE ChiTietHoaDon (
    [idChiTietHD] INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    [idHoaDon] INT NOT NULL,
    [idSanPham] INT NOT NULL,
    [soLuong] INT NOT NULL,
    [giaBan] INT NOT NULL,
    [size] NVARCHAR(50) NULL,

    CONSTRAINT FK_CTHD_HoaDon FOREIGN KEY (idHoaDon) REFERENCES HoaDon(idHoaDon),
    CONSTRAINT FK_CTHD_SanPham FOREIGN KEY (idSanPham) REFERENCES SanPham(idSanPham)
);

CREATE TABLE [dbo].[DanhGia] (
    [idDanhGia] INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    [idNguoiDung] INT NULL,
    [idChiTietHD] INT NULL,
    [soSao] INT NULL CHECK (soSao >= 1 AND soSao <= 5),
    [noiDung] NVARCHAR(300) NULL,

    CONSTRAINT FK_DanhGia_NguoiDung FOREIGN KEY (idNguoiDung) REFERENCES NguoiDung(idNguoiDung),
    CONSTRAINT FK_DanhGia_CTHD FOREIGN KEY (idChiTietHD) REFERENCES ChiTietHoaDon(idChiTietHD)
);

