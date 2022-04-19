const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const connection = require('../utils/db');

const userController = {    
    // 註冊頁 get
    registerPage: (req, res) => {
        return res.render('register', {title: 'sign up'});
    },
    // 註冊後端驗證
    registerRules: [
        body('email').isEmail().withMessage('email 格式錯誤'),
        body('password').isLength({min: 8}).withMessage('密碼長度至少為 8'),
        body('confirmPw').custom((value, {req}) => {
            return value === req.body.password;
        }).withMessage('確認密碼錯誤'),
    ],
    // 註冊頁 post
    register: async (req, res, next) => {
        const {email, password, confirmPw} = req.body;
        // input 欄位後端驗證
        const validateResult = validationResult(req);
        if (!validateResult.isEmpty()) {
            let error = validateResult.mapped();
            // console.log('error', error);
            let errorDIV = {};
            let errorKeys = Object.keys(error);
            errorKeys.forEach((key) => (errorDIV[key] = error[key].msg));
            console.log('errorDIV', errorDIV);
            return res.render('register', { 
                title: 'sign up',
                errorDIV,
                email,
                password,
                confirmPw
            });
            // 這個寫法也可以
            // res.locals.errorDIV = errorDIV;
            // res.render('register');
        };
        let messageBOX = {};
        let [member] = await connection.execute('SELECT id FROM users WHERE email = ?', [email]);
        console.log('member', member);
        if (member.length > 0) {
            messageBOX.errMsg = '這個 email 已被註冊過';
            return res.render('register', {
                title: 'sign up',
                messageBOX,
                email,
                password,
                confirmPw,
            });
        } else {
            messageBOX.succMsg = '這個 email 可以喔!';
            return res.render('register', {
                title: 'sign up',
                messageBOX,
                email,
                password,
                confirmPw,
            });
        }

    },
    // 確認 email 已註冊與否
    emailCheck: async (req, res) => {
        const { email } = req.body;
        // console.log('check-email', email);
        let [member] = await connection.execute('SELECT id FROM users WHERE email = ?', [email]);
        let checkResult = '';
        if (member.length > 0) {
            checkResult = '這個 email 已被註冊了';
        } else {
            checkResult = '這個 email 可以唷!';
        }
        return res.send({result: checkResult});
    },

}

module.exports = userController;