// check-email input
$('#check-email').click(() => {
    let email = $('#email').val();
    $.ajax({
        method: 'POST',
        url: '/checkEmail',
        data: { email: email },
        // dataType: 'json'
    })
    .done((response) => {
        console.log('response', response);
        let result = response.result;
        $('#check-result').text(result);
    })
    .fail((error) => {
        console.log(error);
    })
});

// 前端 input 驗證
$('#submit-btn').click(function() {
    let email = $('#email').val(),
        password = $('#password').val(),
        confirmPw = $('#confirmPw').val();
    
    // email 格式
    let regEmail=/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

    if (email === '') {
        $('#email-error').text('email 不可為空');
    } else if (!regEmail.test(email)) {
        $('#email-error').text('email 格式錯誤');
    }
    if (password === '') {
        $('#password-error').text('密碼不可為空');
    } else if (password.length < 8) {
        $('#password-error').text('密碼至少為 8 碼');
    }
    if (confirmPw === '') {
        $('#confirmPw-error').text('確認密碼不可為空');
    } else if (password !== confirmPw) {
        $('#confirmPw-error').text('確認密碼與密碼不同');
    }
    // 確認前端檢查是否通過
    let emailErr = $('#email-error').text(),
        passwordErr = $('#password-error').text(),
        confirmPwErr = $('#confirmPw-error').text();
    if (emailErr==='' && passwordErr==='' && confirmPwErr==='') {
        $('#registerForm').submit();
    }
});

// input 欄位變更時清空錯誤提醒
$('#email').on('change keyup', function(){
    $('#email-error').text('');
});
$('#password').on('change keyup', function(){
    $('#password-error').text('');
});
$('#confirmPw').on('change keyup', function(){
    $('#confirmPw-error').text('');
});

// 關閉訊息提醒視窗
$('#close-msgBOX').click(() => {
    $('.message-box').removeClass('show');
})