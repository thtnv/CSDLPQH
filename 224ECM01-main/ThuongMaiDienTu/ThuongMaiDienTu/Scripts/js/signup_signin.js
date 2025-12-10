document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector('.container');
    const signupBtn = document.querySelector('#signup-btn');
    const backBtn = document.querySelector('.back-btn');
    const signinBtn = document.querySelector('#signin-btn');
    const signinPopup = document.querySelector('.signin-popup');
    const overlay = document.querySelector('.overlay');
    const closeBtn = document.querySelector('.close-btn');
    const carousel = document.querySelector('.carousel');
    const cards = document.querySelectorAll('.card');
    const totalCards = cards.length;
    let currentIndex = 0;

    // Toggle signup form
    signupBtn.addEventListener('click', (e) => {
        e.preventDefault();
        container.classList.add('sign-up-mode');
    });

    backBtn.addEventListener('click', () => {
        container.classList.remove('sign-up-mode');
    });

    // Toggle signin popup
    signinBtn.addEventListener('click', (e) => {
        e.preventDefault();
        signinPopup.classList.add('active');
        overlay.classList.add('active');
    });

    closeBtn.addEventListener('click', () => {
        signinPopup.classList.remove('active');
        overlay.classList.remove('active');
    });

    overlay.addEventListener('click', () => {
        signinPopup.classList.remove('active');
        overlay.classList.remove('active');
    });

    // Carousel
    function moveCarousel() {
        currentIndex = (currentIndex + 1) % totalCards;
        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
    setInterval(moveCarousel, 3000);

    // Show/hide password - Signup Password
    const visibleHidePasswordSignUp1 = document.querySelector("#visible_hide_pass_sign_up_1");
    const passwordInputSignUp1 = document.querySelector("#signup-password");
    const eyeIconSignUp1 = document.querySelector("#visible_hide_pass_sign_up_1 i");

    visibleHidePasswordSignUp1.addEventListener("click", () => {
        if (passwordInputSignUp1.type === "password") {
            passwordInputSignUp1.type = "text";
            eyeIconSignUp1.classList.remove("fa-eye-slash");
            eyeIconSignUp1.classList.add("fa-eye");
            visibleHidePasswordSignUp1.querySelector("span").textContent = "Hide";
        } else {
            passwordInputSignUp1.type = "password";
            eyeIconSignUp1.classList.remove("fa-eye");
            eyeIconSignUp1.classList.add("fa-eye-slash");
            visibleHidePasswordSignUp1.querySelector("span").textContent = "Show";
        }
    });

    // Show/hide password - Signup Confirm Password
    const visibleHidePasswordSignUp2 = document.querySelector("#visible_hide_pass_sign_up_2");
    const passwordInputSignUp2 = document.querySelector("#signup-confirm-password");
    const eyeIconSignUp2 = document.querySelector("#visible_hide_pass_sign_up_2 i");

    visibleHidePasswordSignUp2.addEventListener("click", () => {
        if (passwordInputSignUp2.type === "password") {
            passwordInputSignUp2.type = "text";
            eyeIconSignUp2.classList.remove("fa-eye-slash");
            eyeIconSignUp2.classList.add("fa-eye");
            visibleHidePasswordSignUp2.querySelector("span").textContent = "Hide";
        } else {
            passwordInputSignUp2.type = "password";
            eyeIconSignUp2.classList.remove("fa-eye");
            eyeIconSignUp2.classList.add("fa-eye-slash");
            visibleHidePasswordSignUp2.querySelector("span").textContent = "Show";
        }
    });

    // Show/hide password - Signin
    const visibleHidePasswordSignIn = document.querySelector("#visible_hide_pass_sign_in");
    const passwordInputSignIn = document.querySelector("#signin-password");
    const eyeIconSignIn = document.querySelector("#visible_hide_pass_sign_in i");

    visibleHidePasswordSignIn.addEventListener("click", () => {
        if (passwordInputSignIn.type === "password") {
            passwordInputSignIn.type = "text";
            eyeIconSignIn.classList.remove("fa-eye-slash");
            eyeIconSignIn.classList.add("fa-eye");
            visibleHidePasswordSignIn.querySelector("span").textContent = "Hide";
        } else {
            passwordInputSignIn.type = "password";
            eyeIconSignIn.classList.remove("fa-eye");
            eyeIconSignIn.classList.add("fa-eye-slash");
            visibleHidePasswordSignIn.querySelector("span").textContent = "Show";
        }
    });

    // Client-side validation
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePhone(phone) {
        const re = /^\d{10,15}$/;
        return re.test(phone);
    }

    // Sign-up form submission
    const signupForm = document.querySelector('.signup-form form');
    signupForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.querySelector('#name').value.trim();
        const phone = document.querySelector('#tel').value.trim();
        const address = document.querySelector('#address').value.trim();
        const email = document.querySelector('#signup-email').value.trim();
        const password = document.querySelector('#signup-password').value;
        const confirmPassword = document.querySelector('#signup-confirm-password').value;

        // Client-side validation
        if (!name) return alert("Please enter full name.");
        if (!phone || !validatePhone(phone)) return alert("Please enter a valid phone number (10-15 digits).");
        if (!address) return alert("Please enter address.");
        if (!email || !validateEmail(email)) return alert("Please enter a valid email.");
        if (!password || password.length < 6) return alert("Password must be at least 6 characters.");
        if (password !== confirmPassword) return alert("Passwords do not match.");

        const formData = new FormData();
        formData.append('FullName', name);
        formData.append('Phone', phone);
        formData.append('Address', address);
        formData.append('Email', email);
        formData.append('Password', password);
        formData.append('ConfirmPassword', confirmPassword);
        formData.append('__RequestVerificationToken', document.querySelector('.signup-form input[name="__RequestVerificationToken"]').value);

        console.log('Sending signup data:', Object.fromEntries(formData));

        fetch('/Account/Register', {
            method: 'POST',
            headers: {
                'RequestVerificationToken': formData.get('__RequestVerificationToken')
            },
            body: formData
        })
            .then(response => {
                console.log('Response status:', response.status);
                console.log('Response headers:', Object.fromEntries(response.headers));
                if (!response.ok) {
                    return response.text().then(text => {
                        console.error('Response text:', text);
                        throw new Error(`HTTP error! Status: ${response.status}, Response: ${text.substring(0, 100)}...`);
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log('Response data:', data);
                alert(data.message);
                if (data.success) {
                    window.location.href = '/Home/Index';
                }
            })
            .catch(error => {
                console.error('Signup error:', error);
                alert('Error: ' + error.message);
            });
    });

    // Sign-in form submission
    const signinForm = document.querySelector('.signin-popup form');
    signinForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = document.querySelector('#signin-email').value.trim();
        const password = document.querySelector('#signin-password').value;

        if (!email || !validateEmail(email)) return alert("Please enter a valid email.");
        if (!password) return alert("Please enter password.");

        const formData = new FormData();
        formData.append('Email', email);
        formData.append('Password', password);
        formData.append('__RequestVerificationToken', document.querySelector('.signin-popup input[name="__RequestVerificationToken"]').value);

        console.log('Sending signin data:', Object.fromEntries(formData));

        fetch('/Account/Login/', {
            method: 'POST',
            headers: {
                'RequestVerificationToken': formData.get('__RequestVerificationToken')
            },
            body: formData
        })
            .then(response => {
                console.log('Response status:', response.status);
                console.log('Response headers:', Object.fromEntries(response.headers));
                if (!response.ok) {
                    return response.text().then(text => {
                        console.error('Response text:', text);
                        throw new Error(`HTTP error! Status: ${response.status}, Response: ${text.substring(0, 100)}...`);
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log('Response data:', data);
                alert(data.message);
                if (data.success) {
                    if (data.isAdmin) {
                        window.location.href = '/Admin/HomeAdmin';
                    }
                    else {
                        window.location.href = '/Home';
                    }
                    
                }
            })
            .catch(error => {
                console.error('Signin error:', error);
                alert('Error: ' + error.message);
            });
    });
});