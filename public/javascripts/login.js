$("#login-btn").click(function () {
    let email = $("#email").val();
    let password = $("#password").val();
    if (email === "") {
        $('#email-error').text('email 不可為空');
    }
    if (password === "") {
        $('#password-error').text('密碼不可為空');
    }
    // 確認前端檢查是否通過
    let emailErr = $('#email-error').text(),
        passwordErr = $('#password-error').text();
    if (emailErr==='' && passwordErr==='') {
        $('#loginForm').submit();
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