$('#submit-btn').click(function() {
    let error = {};
    let email = $('#email').val(),
        password = $('#password').val(),
        confirmPw = $('#confirmPw').val();
    if (email == '') {
        error.message = 'email 不可為空';
        return;
    } else if (password == '') {
        alert('密碼不可為空');
        return;
    } else if (confirmPw == '') {
        alert('確認密碼不可為空');
        return;
    }
    $('#registerForm').submit();
});