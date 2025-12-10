$(document).ready(function () {
    $('.add-to-cart-btn').click(function () {
        var idSanPham = $(this).closest('.product-card').find('.product-id').text().trim();
        var soLuong = parseInt($(this).closest('.product-card').find('.quantity-number').val());
        var size = $(this).closest('.product-card').find('.product-size-selected').text().trim();

        if (!idSanPham) {
            alert("Please choose a product to add to your cart");
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
                    alert('Add to cart successfully!');
                    $('.cart-count').text(response.cartCount);
                } else {
                    //alert(idSanPham)
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
                    alert('Server Error: ' + (errResponse.message || xhr.statusText));
                } catch (e) {

                    alert('Undefined Error: ' + xhr.statusText);
                }
            }
        });
    });

});