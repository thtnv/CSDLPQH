let currentIndex = 0;
const slides = document.querySelectorAll(".slide");
const slider = document.getElementById("slider");

function showSlide(index) {
    if (index >= slides.length) {
        currentIndex = 0;
    } else if (index < 0) {
        currentIndex = slides.length - 1;
    } else {
        currentIndex = index;
    }

    // Xóa class 'active' khỏi tất cả slides
    slides.forEach(slide => slide.classList.remove("active"));

    // Thêm class 'active' vào slide hiện tại
    slides[currentIndex].classList.add("active");

    // Dịch chuyển slider
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
}

function nextSlide() {
    showSlide(currentIndex + 1);
}

function prevSlide() {
    showSlide(currentIndex - 1);
}

// --- DELETE THIS BLOCK ---
document.addEventListener('DOMContentLoaded', () => {
    const dropdowns = document.querySelectorAll('.nav-links li');

    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('mouseenter', () => {
            const submenu = dropdown.querySelector('.dropdown-menu');
            if (submenu) {
                submenu.style.display = 'block';
            }
        });

        dropdown.addEventListener('mouseleave', () => {
            const submenu = dropdown.querySelector('.dropdown-menu');
            if (submenu) {
                submenu.style.display = 'none';
            }
        });
    });
});
// --- END OF BLOCK TO DELETE ---


 // --- Slider Image ---


 function showSlide(index) {
     if (index >= slides.length) {
         currentIndex = 0;
     } else if (index < 0) {
         currentIndex = slides.length - 1;
     } else {
         currentIndex = index;
     }

     slides.forEach(slide => slide.classList.remove("active"));
     slides[currentIndex].classList.add("active");
     slider.style.transform = `translateX(-${currentIndex * 100}%)`;
 }

 function nextSlide() {
     showSlide(currentIndex + 1);
 }

 function prevSlide() {
     showSlide(currentIndex - 1);
 }

 // --- DOM Elements ---
 const minPriceInput = document.getElementById('min_price');
 const maxPriceInput = document.getElementById('max_price');
 const minHandle = document.getElementById('min-handle');
 const maxHandle = document.getElementById('max-handle');
 const trackFill = document.getElementById('track-fill');
 const priceFrom = document.querySelector('.price_label .from');
 const priceTo = document.querySelector('.price_label .to');
 const priceFilterForm = document.getElementById('price-filter-form');
 const productContainer = document.querySelector('.products');
 const allProductCards = productContainer.querySelectorAll('.product-card');
 const resultTextSpan = document.querySelector('.result-header .result-text');
 const noProductsMessage = document.getElementById('no-products-message');

 // --- Slider State Variables ---
 let minPrice = parseInt(minPriceInput.value);
 let maxPrice = parseInt(maxPriceInput.value);
 const minLimit = parseInt(minPriceInput.getAttribute('data-min'));
 const maxLimit = parseInt(maxPriceInput.getAttribute('data-max'));
 let activeHandle = null;

 // --- Update Result Count ---
 function updateResultCount() {
     let visibleCount = 0;
     allProductCards.forEach(card => {
         if (card.style.display !== 'none') {
             visibleCount++;
         }
     });

     if (resultTextSpan) {
         if (visibleCount === 0) {
             resultTextSpan.textContent = "Không tìm thấy kết quả nào";
         } else if (visibleCount === 1) {
             resultTextSpan.textContent = "Hiển thị một kết quả duy nhất";
         } else {
             resultTextSpan.textContent = `Hiển thị ${visibleCount} kết quả`;
         }
     }

     if (noProductsMessage) {
         noProductsMessage.style.display = visibleCount === 0 ? 'block' : 'none';
     }
 }

 // --- Update Slider UI ---
 function updateSliderVisuals() {
     let displayMin = Math.min(minPrice, maxPrice);
     let displayMax = Math.max(minPrice, maxPrice);

     const minPercent = ((displayMin - minLimit) / (maxLimit - minLimit)) * 100;
     const maxPercent = ((displayMax - minLimit) / (maxLimit - minLimit)) * 100;

     minHandle.style.left = minPercent + '%';
     maxHandle.style.left = maxPercent + '%';
     trackFill.style.left = minPercent + '%';
     trackFill.style.width = (maxPercent - minPercent) + '%';

     priceFrom.textContent = displayMin.toLocaleString('vi-VN') + ' ₫';
     priceTo.textContent = displayMax.toLocaleString('vi-VN') + ' ₫';

     minPriceInput.value = displayMin;
     maxPriceInput.value = displayMax;
 }

 // --- Drag Slider Handle ---
 function startDrag(e, handle) {
     activeHandle = handle;
     e.preventDefault();
 }

 function stopDrag() {
     activeHandle = null;
 }

 function moveHandle(e) {
     if (!activeHandle) return;

     const slider = activeHandle.parentElement;
     const rect = slider.getBoundingClientRect();
     const offsetX = e.clientX - rect.left;
     const sliderWidth = rect.width;

     let newValue = minLimit + (offsetX / sliderWidth) * (maxLimit - minLimit);
     newValue = Math.max(minLimit, Math.min(maxLimit, Math.round(newValue)));

     if (activeHandle === minHandle) {
         newValue = Math.min(newValue, maxPrice);
         minPrice = newValue;
     } else if (activeHandle === maxHandle) {
         newValue = Math.max(newValue, minPrice);
         maxPrice = newValue;
     }

     updateSliderVisuals();
 }

 minHandle.addEventListener('mousedown', (e) => startDrag(e, minHandle));
 maxHandle.addEventListener('mousedown', (e) => startDrag(e, maxHandle));
 document.addEventListener('mousemove', moveHandle);
 document.addEventListener('mouseup', stopDrag);
 document.addEventListener('mouseleave', stopDrag);

 // --- Filter Products ---
 priceFilterForm.addEventListener('submit', function(event) {
     event.preventDefault();

     const selectedMinPrice = Math.min(parseInt(minPriceInput.value), parseInt(maxPriceInput.value));
     const selectedMaxPrice = Math.max(parseInt(minPriceInput.value), parseInt(maxPriceInput.value));

     allProductCards.forEach(card => {
         const priceElement = card.querySelector('.price');
         let showCard = false;

         if (priceElement) {
             const priceText = priceElement.textContent.replace(/[^0-9]/g, '');
             const productPrice = parseInt(priceText);

             if (!isNaN(productPrice) && productPrice >= selectedMinPrice && productPrice <= selectedMaxPrice) {
                 showCard = true;
             }
         }

         card.style.display = showCard ? 'block' : 'none';
     });

     updateResultCount();
 });

 // --- Sort Products ---
 const sortDropdown = document.querySelector('.sort-dropdown select');

 function sortProducts() {
     const sortOption = sortDropdown.value;
     const productArray = Array.from(allProductCards);

     productArray.sort((a, b) => {
         const nameA = a.querySelector('p').textContent.toLowerCase();
         const nameB = b.querySelector('p').textContent.toLowerCase();
         const priceA = parseInt(a.querySelector('.price').textContent.replace(/[^0-9]/g, ''));
         const priceB = parseInt(b.querySelector('.price').textContent.replace(/[^0-9]/g, ''));

         switch (sortOption) {
             case 'A → Z':
                 return nameA.localeCompare(nameB);
             case 'Z → A':
                 return nameB.localeCompare(nameA);
             case 'Giá thấp đến cao':
                 return priceA - priceB;
             case 'Giá cao đến thấp':
                 return priceB - priceA;
             default:
                 return 0;
         }
     });

     productContainer.innerHTML = '';
     productArray.forEach(card => productContainer.appendChild(card));
     productContainer.appendChild(noProductsMessage);
     updateResultCount();
 }

 sortDropdown.addEventListener('change', sortProducts);

 // --- Initial Setup ---
 document.addEventListener('DOMContentLoaded', () => {
     updateSliderVisuals();
     updateResultCount();
     sortProducts();
 });


 document.addEventListener('DOMContentLoaded', () => {
    // --- Constants ---
    const PRODUCTS_PER_PAGE = 12;

    // --- DOM Elements ---
    // Price Slider
    const minPriceInput = document.getElementById('min_price');
    const maxPriceInput = document.getElementById('max_price');
    const minHandle = document.getElementById('min-handle');
    const maxHandle = document.getElementById('max-handle');
    const trackFill = document.getElementById('track-fill');
    const priceFrom = document.querySelector('.price_label .from');
    const priceTo = document.querySelector('.price_label .to');
    const priceFilterForm = document.getElementById('price-filter-form');

    // Product Area & Sorting
    const productContainer = document.querySelector('.products');
    const allProductCards = Array.from(productContainer.querySelectorAll('.product-card')); // Get all cards into an Array
    const noProductsMessage = productContainer.querySelector('#no-products-message');
    const resultTextSpan = document.querySelector('.result-header .result-text');
    const sortDropdown = document.querySelector('.sort-dropdown select');

    // Pagination
    const paginationContainer = document.querySelector('.pagination-container'); // The outer container
    const paginationNav = document.querySelector('.pagination'); // The nav element holding the ul
    const productStatusDiv = document.getElementById('product-display-status'); // Optional

    // --- State Variables ---
    // Price Slider
    let minPrice = minPriceInput ? parseInt(minPriceInput.value) : 0;
    let maxPrice = maxPriceInput ? parseInt(maxPriceInput.value) : 100000000;
    const minLimit = minPriceInput ? parseInt(minPriceInput.getAttribute('data-min')) : 0;
    const maxLimit = maxPriceInput ? parseInt(maxPriceInput.getAttribute('data-max')) : 100000000;
    let activeHandle = null;

    // Filtering/Sorting/Pagination
    let currentPage = 1;
    let currentSortOption = 'Thứ tự mặc định'; // Initial sort
    let currentlyVisibleCards = []; // Array to hold cards that pass filters

    // --- Price Slider Functions ---
    function updateSliderVisuals() {
        if (!minHandle || !maxHandle) return; // Guard if elements don't exist

        let displayMin = Math.min(minPrice, maxPrice);
        let displayMax = Math.max(minPrice, maxPrice);
        const minPercent = maxLimit === minLimit ? 0 : ((displayMin - minLimit) / (maxLimit - minLimit)) * 100;
        const maxPercent = maxLimit === minLimit ? 100 : ((displayMax - minLimit) / (maxLimit - minLimit)) * 100;

        minHandle.style.left = minPercent + '%';
        maxHandle.style.left = maxPercent + '%';
        if (trackFill) {
            trackFill.style.left = minPercent + '%';
            trackFill.style.width = (maxPercent - minPercent) + '%';
        }
        if(priceFrom) priceFrom.textContent = displayMin.toLocaleString('vi-VN') + ' ₫';
        if(priceTo) priceTo.textContent = displayMax.toLocaleString('vi-VN') + ' ₫';
        if(minPriceInput) minPriceInput.value = displayMin;
        if(maxPriceInput) maxPriceInput.value = displayMax;
    }

    function startDrag(e, handle) {
        activeHandle = handle;
        e.preventDefault();
    }

    function stopDrag() {
        if (activeHandle) {
            activeHandle = null;
            // Optional: Trigger filter immediately on mouse up
            // filterSortAndRender();
        }
    }

    function moveHandle(e) {
        if (!activeHandle || !activeHandle.parentElement) return;
        const slider = activeHandle.parentElement;
        const rect = slider.getBoundingClientRect();
        // Use pageX for wider compatibility with touch events later if needed
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const offsetX = clientX - rect.left;
        const sliderWidth = rect.width;

        if (sliderWidth === 0) return; // Avoid division by zero

        let newValue = minLimit + (offsetX / sliderWidth) * (maxLimit - minLimit);
        newValue = Math.max(minLimit, Math.min(maxLimit, Math.round(newValue)));

        if (activeHandle === minHandle) {
            newValue = Math.min(newValue, maxPrice);
            minPrice = newValue;
        } else if (activeHandle === maxHandle) {
            newValue = Math.max(newValue, minPrice);
            maxPrice = newValue;
        }
        updateSliderVisuals();
    }

    // --- Core Filtering and Sorting Logic ---
    function filterAndSortProducts() {
        // 1. Filter by Price
        const selectedMin = Math.min(parseInt(minPriceInput.value), parseInt(maxPriceInput.value));
        const selectedMax = Math.max(parseInt(minPriceInput.value), parseInt(maxPriceInput.value));

        currentlyVisibleCards = allProductCards.filter(card => {
            const priceElement = card.querySelector('.price');
            if (!priceElement) return false; // Card must have a price
            const priceText = priceElement.textContent.replace(/[^0-9]/g, '');
            const productPrice = parseInt(priceText);
            return !isNaN(productPrice) && productPrice >= selectedMin && productPrice <= selectedMax;
        });

        // 2. Sort the filtered results
        currentSortOption = sortDropdown ? sortDropdown.value : 'Thứ tự mặc định';
        currentlyVisibleCards.sort((a, b) => {
            const nameA = a.querySelector('p:not(.price)')?.textContent.toLowerCase() || ''; // Get first non-price paragraph
            const nameB = b.querySelector('p:not(.price)')?.textContent.toLowerCase() || '';
            const priceA = parseInt(a.querySelector('.price')?.textContent.replace(/[^0-9]/g, '') || '0');
            const priceB = parseInt(b.querySelector('.price')?.textContent.replace(/[^0-9]/g, '') || '0');

            switch (currentSortOption) {
                case 'A → Z': return nameA.localeCompare(nameB);
                case 'Z → A': return nameB.localeCompare(nameA);
                case 'Giá thấp đến cao': return priceA - priceB;
                case 'Giá cao đến thấp': return priceB - priceA;
                case 'Thứ tự mặc định': // Use original DOM order (approximated by index in allProductCards)
                     return allProductCards.indexOf(a) - allProductCards.indexOf(b);
                default: return 0;
            }
        });

        // 3. Reset to page 1 after filtering or sorting
        currentPage = 1;

        // 4. Render the results
        renderProductsAndPagination();
    }

    // --- Rendering Function (Display Products and Pagination) ---
    function renderProductsAndPagination() {
        const totalVisibleProducts = currentlyVisibleCards.length;
        const totalPages = Math.ceil(totalVisibleProducts / PRODUCTS_PER_PAGE);

        // --- Update Product Display ---
        // Hide all cards first (important for pagination)
        allProductCards.forEach(card => card.style.display = 'none');

        if (totalVisibleProducts > 0) {
            const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
            const endIndex = startIndex + PRODUCTS_PER_PAGE;
            const cardsToShow = currentlyVisibleCards.slice(startIndex, endIndex);

            // Show only the cards for the current page
            cardsToShow.forEach(card => card.style.display = 'block'); // Or 'grid' etc.
            if(noProductsMessage) noProductsMessage.style.display = 'none'; // Hide 'no products' message
        } else {
             if(noProductsMessage) noProductsMessage.style.display = 'block'; // Show 'no products' message
        }

        // --- Update Result Count Text ---
        if (resultTextSpan) {
            if (totalVisibleProducts === 0) {
                resultTextSpan.textContent = "Không tìm thấy kết quả nào";
            } else if (totalVisibleProducts === 1) {
                resultTextSpan.textContent = "Hiển thị một kết quả duy nhất";
            } else {
                // Show count based on total filtered items, maybe mention pagination range?
                 // e.g., "Hiển thị sản phẩm 1-12 trong tổng số ${totalVisibleProducts} kết quả";
                resultTextSpan.textContent = `Hiển thị ${totalVisibleProducts} kết quả`; // Simpler count
            }
        }

        // --- Update Pagination UI ---
        updatePaginationUI(totalPages);
    }
 // --- Function to Update Pagination Controls ---
 function updatePaginationUI(totalPages) {
    if (!paginationNav || !paginationContainer) return;

   if (totalPages <= 1) {
       paginationContainer.style.display = 'none';
       return;
   } else {
       paginationContainer.style.display = 'flex';
   }

   const ul = paginationNav.querySelector('ul');
   if (!ul) return;
   const prevLink = ul.querySelector('.prev-page'); // Get reference BEFORE clearing
   const nextLink = ul.querySelector('.next-page'); // Get reference BEFORE clearing

   // Clear existing number links ONLY
   ul.querySelectorAll('.page-link:not(.prev-page):not(.next-page)').forEach(link => link.parentElement.remove()); // Remove the whole <li>

   // --- Rebuild number links ---
   const fragment = document.createDocumentFragment(); // More efficient for multiple appends
   for (let i = 1; i <= totalPages; i++) {
       const li = document.createElement('li');
       const link = document.createElement('a');
       link.href = '#';
       link.textContent = i;
       link.classList.add('page-link');
       link.dataset.page = i;
       if (i === currentPage) {
           link.classList.add('current-page');
           link.setAttribute('aria-current', 'page');
       }
       li.appendChild(link);
       fragment.appendChild(li);
   }

   // Insert numbers before the 'next' link's list item
   if (nextLink) {
       ul.insertBefore(fragment, nextLink.parentElement);
   } else {
        // Fallback if next link wasn't found (shouldn't happen with correct HTML)
        ul.appendChild(fragment);
   }


   // --- Enable/Disable Prev/Next ---
   if (prevLink) {
       prevLink.classList.toggle('disabled', currentPage === 1);
       prevLink.parentElement.style.pointerEvents = currentPage === 1 ? 'none' : 'auto'; // Disable on LI
       prevLink.parentElement.style.opacity = currentPage === 1 ? '0.5' : '1';
   }
   if (nextLink) {
       nextLink.classList.toggle('disabled', currentPage === totalPages);
        nextLink.parentElement.style.pointerEvents = currentPage === totalPages ? 'none' : 'auto'; // Disable on LI
        nextLink.parentElement.style.opacity = currentPage === totalPages ? '0.5' : '1';
   }
}


// --- Event Listeners ---
// Price Slider
if (minHandle) minHandle.addEventListener('mousedown', (e) => startDrag(e, minHandle), { passive: false }); // Use passive: false if preventDefault is needed
if (maxHandle) maxHandle.addEventListener('mousedown', (e) => startDrag(e, maxHandle), { passive: false });
document.addEventListener('mousemove', moveHandle);
document.addEventListener('mouseup', stopDrag);
// Add touch events
if (minHandle) minHandle.addEventListener('touchstart', (e) => startDrag(e, minHandle), { passive: false });
if (maxHandle) maxHandle.addEventListener('touchstart', (e) => startDrag(e, maxHandle), { passive: false });
document.addEventListener('touchmove', moveHandle);
document.addEventListener('touchend', stopDrag);

// Filter Form Submit (using button click as well)
const filterButton = priceFilterForm ? priceFilterForm.querySelector('button') : null;
if (filterButton) {
   filterButton.addEventListener('click', (event) => {
        event.preventDefault();
        filterAndSortProducts();
   });
}
// Also keep form submit listener as fallback
if (priceFilterForm) {
    priceFilterForm.addEventListener('submit', (event) => {
        event.preventDefault();
        filterAndSortProducts();
    });
}


// Sort Dropdown Change
if (sortDropdown) {
   sortDropdown.addEventListener('change', () => {
       filterAndSortProducts();
   });
}

// Pagination Click (Handles Prev, Next, and Numbers)
if (paginationNav) {
   paginationNav.addEventListener('click', function(event) {
       const targetLink = event.target.closest('a.page-link'); // Target the anchor directly

       // Check if click is on a valid, non-disabled link inside the pagination nav
       if (!targetLink || targetLink.classList.contains('current-page') || targetLink.parentElement.style.pointerEvents === 'none') {
            return;
       }
       event.preventDefault();

       let newPage;
       const action = targetLink.dataset.action;
       const pageNum = parseInt(targetLink.dataset.page);
       const currentTotalPages = Math.ceil(currentlyVisibleCards.length / PRODUCTS_PER_PAGE); // Recalculate total pages on click

       // ---- Calculate Target Page ----
       if (action === 'prev') {
            newPage = Math.max(1, currentPage - 1); // <<< HANDLES PREVIOUS
       } else if (action === 'next') {
            newPage = Math.min(currentTotalPages, currentPage + 1); // <<< HANDLES NEXT
       } else if (!isNaN(pageNum)) {
            newPage = pageNum; // Handles Number click
       } else {
            return; // Should not happen with valid links
       }

       // ---- Update if Page Changed ----
       if (newPage !== currentPage) {
           currentPage = newPage; // Update the current page state
           renderProductsAndPagination(); // Re-render the view for the new page
           // Scroll to top after page change
           if (productContainer) {
               // Find the top of the product container relative to the viewport
               const containerTop = productContainer.getBoundingClientRect().top + window.pageYOffset;
               // Adjust offset (e.g., subtract header height)
               const offsetPosition = containerTop - 80; // Adjust 80 as needed
               window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
           }
       }
   });
}


// --- Initial Setup ---
if (minPriceInput) updateSliderVisuals(); // Set initial slider handle positions
filterAndSortProducts(); // Perform initial filter/sort and render page 1

}); // End DOMContentLoaded