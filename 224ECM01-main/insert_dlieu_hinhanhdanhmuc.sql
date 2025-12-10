USE trangsucbac
GO

ALTER TABLE DanhMuc
ADD hinhAnh NVARCHAR(500) NULL;

SELECT * FROM DanhMuc;


UPDATE DanhMuc
SET hinhAnh = 'dchuyen2.jpg'
WHERE idDanhMuc = 1;

UPDATE DanhMuc
SET hinhAnh = 'nhan_1.png'
WHERE idDanhMuc = 2;

UPDATE DanhMuc
SET hinhAnh = 'ktai1.jpg'
WHERE idDanhMuc = 3;

UPDATE DanhMuc
SET hinhAnh = 'vtay3.jpg'
WHERE idDanhMuc = 4;

UPDATE DanhMuc
SET hinhAnh = 'solitaire-ring2.jpg'
WHERE idDanhMuc = 5;

