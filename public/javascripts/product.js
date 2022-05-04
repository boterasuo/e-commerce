// 回前一頁
$('#backBtn').click(() => {
    window.location.href = '/products';
});

// 加入購物車
$('#addCart').click(function(e) {
    let product = e.target.name.split(',');
    let productObj = {
        id: product[0],
        name: product[1],
        price: product[2],
        count: 1
    };
    let currentCart = JSON.parse(localStorage.getItem('cart')) || [];
    let index = currentCart.findIndex((v) => v.id === productObj.id);
    if (index > -1) {
        return;
    } else {
        $('#added-inform').addClass('cart-active');
        currentCart.push(productObj);
    }
    localStorage.setItem('cart', JSON.stringify(currentCart));
})