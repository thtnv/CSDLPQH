document.addEventListener('DOMContentLoaded', function () {
    const tabItems = document.querySelectorAll('.product-describe-rating .tab-nav li');

    tabItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();

            // Lấy vị trí của tab đang active và tab được click
            const currentActive = document.querySelector('.tab-nav li.active');
            const newActive = this;

            // Tính toán khoảng cách di chuyển
            const currentRect = currentActive.getBoundingClientRect();
            const newRect = newActive.getBoundingClientRect();
            const distance = newRect.left - currentRect.left;

            // Tạo element border di chuyển
            let movingBorder = document.querySelector('.moving-border');
            if (!movingBorder) {
                movingBorder = document.createElement('div');
                movingBorder.className = 'moving-border';
                document.querySelector('.tab-nav').appendChild(movingBorder);
            }
            // Bắt đầu animation
            movingBorder.style.width = currentRect.width + 'px';
            movingBorder.style.left = currentRect.left - document.querySelector('.tab-nav').getBoundingClientRect().left + 'px';

            setTimeout(() => {
                movingBorder.style.width = newRect.width + 'px';
                movingBorder.style.left = newRect.left - document.querySelector('.tab-nav').getBoundingClientRect().left + 'px';

                // Khi animation kết thúc
                setTimeout(() => {
                    tabItems.forEach(tab => tab.classList.remove('active'));
                    newActive.classList.add('active');

                    document.querySelectorAll('.product-tab-content').forEach(content => {
                        content.classList.add('display-none');
                    });

                    const tabText = newActive.textContent.trim().toLowerCase();
                    const contentId = `tab-${tabText === 'description' ? 'describe' : 'rating'}`;
                    document.getElementById(contentId)?.classList.remove('display-none');
                }, 300);
            }, 10);
        });
    });


    const wrapper = document.querySelector('.main-img-wrapper');
    const subImgs = document.querySelectorAll('.sub-img');
    let isAnimating = false;

    // Zoom cho ảnh đầu tiên
    const activeImg = wrapper.querySelector('.main-img.active');
    const zoomImg = wrapper.querySelector('.zoom-img');
    zoomImg.src = activeImg.src;
    zoomImg.style.display = 'block';

    // Zoom effect
    wrapper.addEventListener('mousemove', function (e) {
        const rect = wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const percentX = x / rect.width;
        const percentY = y / rect.height;

        const moveX = (zoomImg.offsetWidth - rect.width) * percentX;
        const moveY = (zoomImg.offsetHeight - rect.height) * percentY;

        zoomImg.style.top = `-${moveY}px`;
        zoomImg.style.left = `-${moveX}px`;
    });

    // Click chuyển ảnh
    subImgs.forEach(subImg => {
        subImg.addEventListener('click', function () {
            if (isAnimating) return;
            isAnimating = true;

            const activeImg = wrapper.querySelector('.main-img.active');
            const nextImg = wrapper.querySelector('.main-img.next');
            const newSrc = this.src;

            // Gán ảnh mới và chuẩn bị hiệu ứng
            nextImg.src = newSrc;
            nextImg.style.display = 'block';
            nextImg.style.transform = 'translateX(100%)';
            nextImg.style.objectFit = 'cover';

            // Reset sạch style
            nextImg.style.margin = '0';
            nextImg.style.padding = '0';
            nextImg.style.border = 'none';
            nextImg.style.outline = 'none';
            nextImg.style.boxShadow = 'none';
            nextImg.style.background = 'none';
            nextImg.style.objectFit = 'cover';
            nextImg.style.position = 'absolute';
            nextImg.style.top = '0';
            nextImg.style.left = '0';
            nextImg.style.width = '100%';
            nextImg.style.height = '100%';
            nextImg.style.borderRadius = '14px';
            nextImg.style.transition = 'transform 0.5s ease';
            nextImg.style.zIndex = '1';


            zoomImg.src = newSrc;
            zoomImg.style.display = 'block';

            nextImg.onload = () => {
                // Force style update: ép browser render xong ảnh trước khi animate
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        activeImg.style.transform = 'translateX(-100%)';
                        nextImg.style.transform = 'translateX(0)';
                    });
                });

                setTimeout(() => {
                    activeImg.classList.remove('active');
                    activeImg.style.display = 'none';
                    activeImg.style.transform = '';

                    nextImg.classList.remove('next');
                    nextImg.classList.add('active');

                    const oldNext = wrapper.querySelector('.main-img.next');
                    if (oldNext) oldNext.remove();

                    const newNext = document.createElement('img');
                    newNext.className = 'main-img next';
                    newNext.style.display = 'none';
                    newNext.style.objectFit = 'cover';
                    newNext.style.position = 'absolute';
                    newNext.style.top = '0';
                    newNext.style.left = '0';
                    newNext.style.width = '100%';
                    newNext.style.height = '100%';
                    newNext.style.borderRadius = '14px';
                    wrapper.appendChild(newNext);

                    isAnimating = false;
                }, 500);
            };


            // Trường hợp ảnh đã được cache và không kích hoạt onload
            if (nextImg.complete) {
                nextImg.onload(); // gọi thủ công
            }
        });
    });




    // Tăng qty
    const plusQtyBtn = document.querySelector('#plus-qty')
    const minusQtyBtn = document.querySelector('#minus-qty')
    const qtyNum = document.querySelector('#qty-number')

    plusQtyBtn.addEventListener('click', function (e) {
        qtyNum.value = parseInt(qtyNum.value) + 1
    })

    minusQtyBtn.addEventListener('click', function (e) {
        if (parseInt(qtyNum.value) > 1)
            qtyNum.value = parseInt(qtyNum.value) - 1
        else
            qtyNum.value = 1
    })


    //Đổi size
    document.querySelectorAll("ul.product-size li").forEach(item => {
        item.addEventListener('click', function (e) {
            document.querySelectorAll("ul.product-size li").forEach(li => {
                li.classList.remove('product-size-selected');
            });

            this.classList.add("product-size-selected");
        });
    });
})