function updateProductCount(value) {
    document.getElementById('quantityInput').value = value;
}

function incrementValue() {
    var inputElement = document.getElementById('quantityInput');
    var currentValue = parseInt(inputElement.value, 10);

    if (currentValue < parseInt(inputElement.max, 10)) {
        updateProductCount(currentValue + 1);
    }
}

function decrementValue() {
    var inputElement = document.getElementById('quantityInput');
    var currentValue = parseInt(inputElement.value, 10);

    if (currentValue > parseInt(inputElement.min, 10)) {
        updateProductCount(currentValue - 1);
    }
}