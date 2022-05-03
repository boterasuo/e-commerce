const connection = require('../utils/db');
const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid');
const { body, validationResult } = require('express-validator');
const transporter = require('../service/email');

// input 後端驗證 (express-validator)
// const inputValid = function(req, res, email, password, confirmPw) {
//     const validateResult = validationResult(req);
//         if (!validateResult.isEmpty()) {
//             let error = validateResult.mapped();
//             // console.log('error', error);
//             let errorDIV = {};
//             let errorKeys = Object.keys(error);
//             errorKeys.forEach((key) => (errorDIV[key] = error[key].msg));
//             console.log('errorDIV', errorDIV);
//             return res.render('register', { 
//                 title: 'sign up',
//                 active: {signUp: true},
//                 errorDIV,
//                 email,
//                 password,
//                 confirmPw
//             });
//             // 這個寫法也可以
//             // res.locals.errorDIV = errorDIV;
//             // res.render('register');
// }};

const userController = {   
    // 註冊頁 get
    registerPage: (req, res) => {
        let auth = req.session.member;
        if (auth) {
            return res.redirect('/');
        } 
        return res.render('register', {title: 'sign up', active: {signUp: true}});
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
                active: {signUp: true},
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
        // console.log('member', member);
        if (member.length > 0) {
            messageBOX.errMsg = '這個 email 已被註冊過';
            return res.render('register', {
                title: 'sign up',
                active: {signUp: true},
                messageBOX,
                email,
                password,
                confirmPw,
            });
        }
        // 雜湊密碼
        let hashPassword = await bcrypt.hash(password, 10);
        // confirm code
        code = nanoid();
        // 存到資料庫
        let [insertUser] = await connection.execute(
            'INSERT INTO users (email, password, confirm_code) VALUES (?, ?, ?)', 
            [email, hashPassword, code]
        );
        console.log('insertUser result', insertUser);
        // 發送驗證信
        mailOptions = {
            from: process.env.GMAIL_ACCOUNT,
            to: email,
            subject: 'Seadfood 會員註冊驗證',
            html: `
            <h2>請點選下列連結進行會員驗證</h2>
            <a href=http://localhost:3000/confirm/${code}>請點此連結</a>
            <p>Thanks for registering!</p>
            <br>
            <p>Seadfood</p>
            `
        };
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log('email error ', error);
            } else {
                console.log('訊息發送 ', info.response);
            }
        });
        // 回傳畫面
        messageBOX.succMsg = '註冊成功! 請至個人信箱驗證帳號';
        return res.render('register', {
            title: 'sign up',
            active: {signUp: true},
            messageBOX,
            email,
            password,
            confirmPw,
        });
    },
    // 確認 email 已註冊與否
    emailCheck: async (req, res) => {
        const { email } = req.body;
        // console.log('check-email', email);
        let [member] = await connection.execute('SELECT id FROM users WHERE email = ?', [email]);
        let checkResult = '';
        if (member.length > 0) {
            checkResult = '這個 email 已被註冊過';
        } else {
            checkResult = '這個 email 可以唷!';
        }
        return res.send({result: checkResult});
    },
    // 註冊驗證
    emailConfirm: async (req, res) => {
        let confirmCode = req.params.confirmationCode;
        let [findUser] = await connection.execute(
            'SELECT * FROM users WHERE confirm_code = ?', [confirmCode]
        );
        // console.log('emailConfirm findUser', findUser);
        if (findUser.length > 0) {
            let [status1] = await connection.execute(
                'UPDATE users SET status=? WHERE id=?', [1, findUser[0].id]
            );
            console.log('status1', status1);
            return res.render('emailConfirm', {
                title: 'email confirm',
                confirm: true,
            });
        } else {
            return res.render('emailConfirm', {
                title: 'email confirm',
                confirm: false,
            });
        }
    },
    // 登入頁面
    loginPage: (req, res) => {
        let auth = req.session.member;
        if (auth) {
            return res.redirect('/');
        }
        return res.render('login', {title: 'sign in'});
    },
    // 登入
    login: async (req, res) => {
        const {email, password} = req.body;
        let [member] = await connection.execute(
            'SELECT * FROM users WHERE email=?', [email]
        );
        // console.log('member', member);
        if (member.length === 0) {
            console.log("no member data!");
            let messageBOX = {loginMsg: '此帳號尚未註冊'} 
            return res.render('login', {
                title: 'login',
                messageBOX,
                email,
                password,
            });
        }
        member = member[0];
        // 帳號存在則比對密碼
        let passwordCompare = await bcrypt.compare(password, member.password);
        if (!passwordCompare) {
            let messageBOX = {loginMsg: '帳號或密碼錯誤!'} 
            return res.render('login', {
                title: 'login',
                messageBOX,
                email,
                password,
            });
        }
        // 比對成功的資料
        let returnMember = {
            id: member.id,
            email: member.email,
            status: member.status,
        }
        // 登入成功寫 session
        req.session.member = returnMember;
        req.session.save(function(err) {
            if (!err) {
                res.locals.auth = req.session.member;
                res.redirect('/');
            }
        })
    },
    // 登出
    logout: (req, res) => {
        req.session.member = null;
        let messageBOX = {loggedMsg: '已登出'} 
        res.render('index', {
            title: 'Seafood',
            messageBOX,
        });
    }

}

module.exports = userController;