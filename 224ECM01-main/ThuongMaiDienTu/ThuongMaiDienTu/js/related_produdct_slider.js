new Swiper('.related-products .card-wrapper', {
    
    loop: true,
    spaceBetween: 10,
    slidesPerView: 4,

    // If we need pagination
    pagination: {
        el: '.related-products .swiper-pagination',
        clickable: true,
        dynamicBullets: true,
    },

    // Navigation arrows
    navigation: {
        nextEl: '.related-products .swiper-button-next',
        prevEl: '.related-products .swiper-button-prev',
    },
    breakpoints: {
        0: {
            slidesPerView: 1
        },
        768: {
            slidesPerView: 3
        },
        1024: {
            slidesPerView: 4
        },
    }
    
});