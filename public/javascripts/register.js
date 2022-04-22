// email 格式
let regEmail=/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

// check-email input
$('#check-email').click(function () {
    $(this).text('Loading...');
    let spinner = `<div class="spinner-border ms-1" role="status" id="check-spinner">
    <span class="visually-hidden">Loading...</span></div>`

    $(this).append(spinner);
    let email = $('#email').val();
    if (email === '') {
        $('#email-error').text('email 不可為空');
    } else if (!regEmail.test(email)) {
        $('#email-error').text('email 格式錯誤');
    } else {
        // function checkEmailAjax() {
            $.ajax({
                method: 'POST',
                url: '/signUp/checkEmail',
                data: { email: email },
                // dataType: 'json' //server 回傳的資料格式 (header: content-type)
            })
            .done((response) => {
                console.log('response', response);
                let result = response.result;
                $('#check-result').text(result);
            })
            .fail((error) => {
                console.log(error);
            })
        // }
        // (setTimeout(() => {
        //     checkEmailAjax()
        // }, 1000))();
    }
    $(this).text('check email').children('div').remove();
});

// 前端 input 驗證
$('#submit-btn').click(function() {
    let email = $('#email').val(),
        password = $('#password').val(),
        confirmPw = $('#confirmPw').val();

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
    $('#check-result').text('');
});
$('#password').on('change keyup', function(){
    $('#password-error').text('');
});
$('#confirmPw').on('change keyup', function(){
    $('#confirmPw-error').text('');
});

