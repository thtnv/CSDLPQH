document.addEventListener("DOMContentLoaded", function () {
    // Lấy tất cả các phần tử chứa nút tăng/giảm (quantity hoặc quantity-box)
    const quantityWrappers = document.querySelectorAll('.quantity, .quantity-box');

    quantityWrappers.forEach(wrapper => {
        const minusBtn = wrapper.querySelector('button:first-child');
        const plusBtn = wrapper.querySelector('button:last-child');
        const input = wrapper.querySelector('input');

        if (minusBtn && plusBtn && input) {
            // Giảm số lượng
            minusBtn.addEventListener('click', () => {
                let quantity = parseInt(input.value) || 1;
                if (quantity > 1) {
                    input.value = quantity - 1;
                    updateCartItem(wrapper, 'update'); // Cập nhật server khi thay đổi số lượng
                }
            });

            // Tăng số lượng
            plusBtn.addEventListener('click', () => {
                let quantity = parseInt(input.value) || 1;
                input.value = quantity + 1;
                updateCartItem(wrapper, 'update'); // Cập nhật server khi thay đổi số lượng
            });

            // Khi chỉnh sửa số lượng bằng tay
            input.addEventListener('change', () => {
                let quantity = parseInt(input.value) || 1;
                if (quantity < 1) {
                    quantity = 1;
                    input.value = 1;
                }
                updateCartItem(wrapper, 'update'); // Cập nhật server khi thay đổi số lượng
            });
        }
    });

    // Xử lý xóa sản phẩm với span .remove-item
    const removeSpans = document.querySelectorAll(".remove-item");
    removeSpans.forEach(span => {
        span.addEventListener("click", function () {
            const cartItem = this.closest(".cart-item");
            if (cartItem) {
                const productId = cartItem.dataset.productId;

                // Hiển thị xác nhận xóa
                Swal.fire({
                    title: 'Bạn có chắc chắn?',
                    text: "Sản phẩm sẽ bị xóa khỏi giỏ hàng!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Xóa',
                    cancelButtonText: 'Hủy'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Nếu người dùng chọn "Xóa"
                        updateCartItem(cartItem, 'delete'); // Cập nhật server khi xóa sản phẩm
                        cartItem.remove(); // Xóa khỏi giao diện
                        Swal.fire(
                            'Đã xóa!',
                            'Sản phẩm đã được xóa khỏi giỏ hàng.',
                            'success'
                        );
                    }
                });
            }
        });
    });

    // Xử lý xóa sản phẩm với nút .delete-btn (nếu có)
    const deleteButtons = document.querySelectorAll(".delete-btn");
    deleteButtons.forEach(button => {
        button.addEventListener("click", function () {
            const cartItem = this.closest(".cart-item");
            if (cartItem) {
                const productId = cartItem.dataset.productId;

                // Hiển thị xác nhận xóa
                Swal.fire({
                    title: 'Bạn có chắc chắn?',
                    text: "Sản phẩm sẽ bị xóa khỏi giỏ hàng!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Xóa',
                    cancelButtonText: 'Hủy'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Nếu người dùng chọn "Xóa"
                        updateCartItem(cartItem, 'delete'); // Cập nhật server khi xóa sản phẩm
                        cartItem.remove(); // Xóa khỏi giao diện
                        Swal.fire(
                            'Đã xóa!',
                            'Sản phẩm đã được xóa khỏi giỏ hàng.',
                            'success'
                        );
                    }
                });
            }
        });
    });

    // Xử lý thanh toán
    const checkoutButton = document.querySelector('.checkout-btn');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            window.location.href = '@Url.Action("Index", "ThanhToan")'; // Chuyển hướng đến trang Index.cshtml của view ThanhToan
        });
    }
});

// Hàm cập nhật giỏ hàng và cơ sở dữ liệu ngay khi có thay đổi
function updateCartItem(cartItem, action) {
    const input = cartItem.querySelector('input');
    const quantity = parseInt(input.value) || 1;
    const productId = cartItem.dataset.productId;

    // Gửi yêu cầu Ajax để cập nhật giỏ hàng và cơ sở dữ liệu
    $.ajax({
        url: '/GioHang/UpdateCart',  // Đường dẫn đến action cập nhật giỏ hàng
        type: 'POST',
        data: {
            productId: productId,
            quantity: quantity,
            action: action // 'update' hoặc 'delete'
        },
        success: function (response) {
            if (response.success) {
                updateCart(); // Cập nhật lại tổng giỏ hàng nếu cần
                console.log(response.message); // Thông báo thành công (log)
            } else {
                alert('Có lỗi xảy ra khi cập nhật giỏ hàng: ' + response.message);
            }
        },
        error: function (xhr, status, error) {
            alert('Lỗi khi gửi yêu cầu: ' + error);
        }
    });
}

// Hàm cập nhật lại tổng giỏ hàng khi thay đổi số lượng hoặc xóa sản phẩm
function updateCart() {
    const cartItems = document.querySelectorAll('.cart-item');
    let total = 0;

    cartItems.forEach(item => {
        const quantity = parseInt(item.querySelector('input').value) || 1;
        const price = parseInt(item.querySelector('.item-price').textContent.replace(/[₫,]/g, '')) || 0;
        total += quantity * price;
    });

    // Cập nhật tổng giỏ hàng
    const checkoutButton = document.querySelector('.checkout-btn');
    if (checkoutButton) {
        checkoutButton.textContent = `THANH TOÁN ・ ${total.toLocaleString()}₫`;
    }
}
function openCart() {
    document.getElementById('sidebar-cart').classList.add('active');
    document.getElementById('cart-overlay').classList.add('active');
}

function closeCart() {
    document.getElementById('sidebar-cart').classList.remove('active');
    document.getElementById('cart-overlay').classList.remove('active');
}

