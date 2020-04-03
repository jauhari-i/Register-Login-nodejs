const {
    controllerAdd,
    controllerLogin,
    controllerSend,
    controllerVerify
} = require('./user.controller')
const router = require('express').Router()

//Register
router.get('/',function(req,res)
{
	res.sendfile('index.html');
});

router.get('/send',controllerSend);

router.get('/verify',controllerVerify)

//Login
router.get('/login',function(req,res){
    res.render('login')
})

router.post('/auth', controllerLogin)

router.get('/home',(req,res)=>{
    if(req.session.loggedin){
        res.render('home')
    }else{
        res.end("Login dolo!")
    }
})

router.get('/metu',function(req,res){
    if(req.session.loggedin === true){
        req.session.loggedin = false
        res.redirect('/')
    }
    res.end()
})

module.exports = router