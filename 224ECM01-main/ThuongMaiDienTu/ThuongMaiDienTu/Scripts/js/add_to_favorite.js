document.addEventListener('DOMContentLoaded', function() {
    const favoriteIcon = document.querySelector('.ico-favorite');
    favoriteIcon.addEventListener('click', function(e) {
        e.preventDefault();        

        if (this.src.includes('ico_heart.png')) {
            this.src = './img/ico_heart_fill.png';
        } else {
            this.src = './img/ico_heart.png';
        }
    });
});