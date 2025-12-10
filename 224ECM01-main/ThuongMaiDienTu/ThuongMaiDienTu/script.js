
/*phần slide */
new Swiper('.card-wrapper', {

    loop: true,
    spaceBetween: 30,

    // If we need pagination
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
    },

    // Navigation arrows
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints: {
        0: {
            slidesPerView: 1
        },
        768: {
            slidesPerView: 2
        },
        1024: {
            slidesPerView: 3
        },
    }

});




document.addEventListener('DOMContentLoaded', () => {
    const gridItems = document.querySelectorAll('.grid-item:not(.text)');

    gridItems.forEach(item => {
        const img = item.querySelector('img');
        const loop = item.querySelector('.loop');
        const src = img.getAttribute('src');

        loop.style.backgroundImage = `url(${src})`;
        loop.style.pointerEvents = 'none';

        item.addEventListener('mousemove', function (e) {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            loop.style.display = 'block';
            loop.style.left = x + 'px';
            loop.style.top = y + 'px';

            const zoom = 2.5;
            const bgWidth = img.offsetWidth * zoom;
            const bgHeight = img.offsetHeight * zoom;

            loop.style.backgroundSize = `${bgWidth}px ${bgHeight}px`;

            const percentX = (x / img.offsetWidth) * 100;
            const percentY = (y / img.offsetHeight) * 100;

            loop.style.backgroundPosition = `${percentX}% ${percentY}%`;
        });

        item.addEventListener('mouseleave', function () {
            loop.style.display = 'none';
        });
    });
});


/*phần slide */
document.addEventListener('DOMContentLoaded', () => {
    const cardItems = document.querySelectorAll('.card-item');

    cardItems.forEach((item) => {
        const link = item.querySelector('.card-link');

        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * 10;
            const rotateY = ((x - centerX) / centerX) * -10;

            link.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.07)`;
        });

        item.addEventListener('mouseleave', () => {
            const link = item.querySelector('.card-link');
            link.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
        });
    });
});


/*phần popular */
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.content-popular');
    const image1 = document.querySelector('.image1');
    const image2 = document.querySelector('.image2');
    const buttons = document.querySelectorAll('.view-button');

    // Khi di chuột vào image1
    image1.addEventListener('mouseenter', () => {
        container.style.backgroundImage = "url('img/nen10.jpg')";
    });

    // Khi di chuột vào image2
    image2.addEventListener('mouseenter', () => {
        container.style.backgroundImage = "url('img/nen8.jpg')";
    });

    // Gán sự kiện cho từng button
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            // Kiểm tra button nằm trong image nào để chọn ảnh phù hợp
            const parentImage = button.closest('.image-wrapper');
            if (parentImage.querySelector('.image1')) {
                container.style.backgroundImage = "url('img/nen10.jpg')";
            } else if (parentImage.querySelector('.image2')) {
                container.style.backgroundImage = "url('img/nen8.jpg')";
            }
        });

        button.addEventListener('mouseleave', () => {
            container.style.backgroundImage = '';
        });
    });

    // Khi chuột rời khỏi image1 hoặc image2 thì reset nền
    [image1, image2].forEach(image => {
        image.addEventListener('mouseleave', () => {
            container.style.backgroundImage = ''; // Xóa nền
        });
    });
});
/*tuyết rơirơi */
document.addEventListener('DOMContentLoaded', () => {
    const snowContainer = document.querySelector('#snow-container'); // Chọn container tuyết
    const contentSubscribe = document.querySelector('#content-subscribe'); // Chọn phần content-subscribe

    // Đặt chiều cao của snowContainer bằng chiều cao của content-subscribe
    snowContainer.style.height = `${contentSubscribe.offsetHeight}px`;

    function createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        snowflake.textContent = '❄'; // Biểu tượng tuyết
        snowflake.style.left = Math.random() * 100 + '%'; // Vị trí ngẫu nhiên theo chiều ngang
        snowflake.style.animationDuration = Math.random() * 5 + 5 + 's'; // Thời gian rơi ngẫu nhiên (5-10 giây)
        snowflake.style.fontSize = Math.random() * 10 + 10 + 'px'; // Kích thước ngẫu nhiên
        snowflake.style.opacity = Math.random() * 0.5 + 0.5; // Độ trong suốt ngẫu nhiên

        snowContainer.appendChild(snowflake);

        // Xóa hạt tuyết sau khi hoàn thành animation
        setTimeout(() => {
            snowflake.remove();
        }, 10000); // Thời gian sống của hạt tuyết (tương ứng với thời gian rơi)
    }

    // Tạo hạt tuyết mỗi 300ms
    setInterval(createSnowflake, 300);
});

document.addEventListener('DOMContentLoaded', () => {
    const hopBtn = document.querySelector('.shop-btn'); // Chọn nút hop-btn
    const contentSection = document.querySelector('.content'); // Chọn phần content

    hopBtn.addEventListener('click', () => {
        const targetPosition = contentSection.getBoundingClientRect().top + window.pageYOffset; // Vị trí của content
        const startPosition = window.pageYOffset; // Vị trí hiện tại
        const distance = targetPosition - startPosition; // Khoảng cách cần cuộn
        const duration = 1000; // Thời gian cuộn (ms)
        let start = null;

        function smoothScroll(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const ease = Math.min(progress / duration, 1); // Tính toán easing (0 đến 1)
            window.scrollTo(0, startPosition + distance * ease); // Cuộn đến vị trí
            if (progress < duration) {
                requestAnimationFrame(smoothScroll); // Tiếp tục cuộn
            }
        }

        requestAnimationFrame(smoothScroll);
    });
});


/*Gio hang */
document.addEventListener('DOMContentLoaded', () => {
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    const cartCount = document.querySelector('.cart-count');

    // Lấy số lượng từ localStorage (nếu có)
    let currentCount = parseInt(localStorage.getItem('cartCount')) || 0;
    cartCount.textContent = currentCount;

    addToCartBtn.addEventListener('click', () => {
        currentCount += 1;
        cartCount.textContent = currentCount;
        localStorage.setItem('cartCount', currentCount); // Lưu số lượng vào localStorage
    });
});


