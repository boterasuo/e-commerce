let currentCart = JSON.parse(localStorage.getItem('cart')) || [];
console.log('currentCart', currentCart);
let productsRow = '';
let totalAmount = 0;
currentCart.forEach(product => {
    // 總價
    totalAmount += parseInt(product.price, 10);
    // 明細
    productsRow += `
        <tr>
            <td>${product.name}</td>
            <td>
                <input type="button" value="-" id="minusBtn">
                <input type="number" min="0" value="${product.count}">
                <input type="button" value="+" id="plusBtn">
            </td>
            <td id="subTotal" data-price="${product.price}">NT$ ${product.price}</td>
        </tr>
    `
});
$('#totalAmount').text(`NT$ ${totalAmount}`);

// console.log('productsRow', productsRow);
$('#products-row').append(productsRow);

// 小計和總計功能
function countTotal(clickedBtn, counts) {
    // 小計
    let price = clickedBtn.closest('td').siblings('#subTotal').data('price');
    let subTotal = price * counts;
    clickedBtn.closest('td').siblings('#subTotal').text(`NT$ ${subTotal}`);
    // 總計
    let totalAmount = $('#totalAmount').text().substring(4);
    if (clickedBtn.val() === '-') {
        totalAmount = parseInt(totalAmount, 10) - price;
    } else {
        totalAmount = parseInt(totalAmount, 10) + price;
    }
    $('#totalAmount').text(`NT$ ${totalAmount}`);    
};

// 減號
$('#products-row').on('click', '#minusBtn', function(){
    let clickedBtn = $(this);
    let productName = clickedBtn.closest('td').prev().text();
    let counts = clickedBtn.siblings('input[type=number]').val();
    let currentCart = JSON.parse(localStorage.getItem('cart')) || [];    
    let newCart=[];
    if (counts === '1') {
        clickedBtn.closest('tr').remove();
        // 更新 localStorage
        newCart = currentCart.filter(product => {
            return product.name !== productName
        });
    } else {
        counts--;
        clickedBtn.siblings('input[type=number]').val(counts);
        newCart = currentCart.map(product => {
            if (product.name === productName) {
                product.count -= 1;
            }
            return product;
        });
    }
    localStorage.setItem('cart', JSON.stringify(newCart));
    // 小計 & 總計
    countTotal(clickedBtn, counts);
});

// 加號
$('#products-row').on('click', '#plusBtn', function(){
    let clickedBtn = $(this);
    let counts = clickedBtn.siblings('input[type=number]').val();
    let productName = clickedBtn.closest('td').prev().text();
    let currentCart = JSON.parse(localStorage.getItem('cart')) || [];    
    let newCart=[];
    if (counts === '500') {
        return
    } else {
        counts++;
        clickedBtn.siblings('input[type=number]').val(counts);
        newCart = currentCart.map(product => {
            if (product.name === productName) {
                product.count += 1;
            }
            return product;
        });
    }
    localStorage.setItem('cart', JSON.stringify(newCart));
    // 小計 & 總計
    countTotal(clickedBtn, counts);
});
