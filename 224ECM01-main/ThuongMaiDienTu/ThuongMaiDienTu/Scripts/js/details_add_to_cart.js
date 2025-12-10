$(document).ready(function () {
    $('.add-to-cart-btn').click(function () {
        var idSanPham = $('.product-id').text().trim();
        var soLuong = parseInt($('#qty-number').val());
        var size = $('.product-size-selected').text().trim();

        if (!idSanPham) {
            alert("Vui lòng chọn sản phẩm");
            return;
        }
        $.ajax({
            url: '/GioHang/ThemGioHang',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                idSanPham: idSanPham,
                soLuong: soLuong,
                size: size
            }),
            success: function (response) {
                if (response.success) {
                    alert('Thêm vào giỏ hàng thành công!');
                    $('.cart-count').text(response.cartCount);
                } else {
                    alert('Lỗi: ' + response.message);
                    console.error(response);
                }
            },
            error: function (xhr, status, error) {
                console.error("AJAX Error:", {
                    status: xhr.status,
                    statusText: xhr.statusText,
                    responseText: xhr.responseText,
                    error: error
                });

                try {
                    var errResponse = JSON.parse(xhr.responseText);
                    alert('Lỗi server: ' + (errResponse.message || xhr.statusText));
                } catch (e) {
                    alert('Lỗi không xác định: ' + xhr.statusText);
                }
            }
        });
    });

});