const {
    serviceAdd,
    serviceLogin,
    serviceCheck
} = require('./user.service')
const {genSaltSync, hashSync, compareSync} = require('bcryptjs');
const { sign } = require('jsonwebtoken')
var nodemailer = require("nodemailer");
var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "battteg@gmail.com",
        pass: "081231717659"
    }
});
module.exports = {
    controllerSend:(req,res)=>{
        // console.log(req.query.name);
        // console.log(req.query.email);
        // console.log(req.query.password);
    rand=Math.floor((Math.random() * 100) + 54);
    host=req.get('host');
    data_user={
        nm_user:req.query.name,
        email_user:req.query.email,
        password:req.query.password,
    }
    const salt = genSaltSync(10);
    data_user.password = hashSync(data_user.password, salt);
    link="http://"+req.get('host')+"/api/user/verify?id="+rand,[data_user];
    // serviceAdd(data_user,(err,result)=>{
    //     if(err){
    //         console.log(err)
    //     }
    // });
    mailOptions={
        to : req.query.email,
        subject : "Please confirm your Email account",
        html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"	
    }
    console.log(mailOptions);
    serviceCheck(data_user,(err,results)=>{
        if(err){
            console.log(err);
            return
        }else if(!results){
            smtpTransport.sendMail(mailOptions, function(error, response){
                if(error){
                    console.log(error);
                res.end("error");
            }else{
                    console.log("Message sent: " + response.message);
                res.end("sent");
                }
            });
        }else{
            console.log("Already Exits ");
            res.end("terpakai");
        }

    })

    },
    controllerVerify:(req,res)=>{
        console.log(req.protocol+":/"+req.get('host'));
        if((req.protocol+"://"+req.get('host'))==("http://"+host))
        {
            console.log(data_user);
            console.log("Domain is matched. Information is from Authentic email");
            if(req.query.id==rand)
            {
                serviceAdd(data_user);
                res.end("<h1>Email "+mailOptions.to+" is been Successfully verified");
            }
            else
            {
                console.log("email is not verified");
                res.end("<h1>Bad Request</h1>");
            }
        }
        else
        {
            res.end("<h1>Request is from unknown source");
        }
    },
    controllerLogin:(req,res)=>{
        const body = req.body;
        serviceLogin(body,(err,results)=>{
            if(err){
                console.log(err);
            }if(!results){
                return res.json({
                    success:0,
                    message:" Invalid email or password"
                })
            }
            const result= compareSync(body.password,results.password)
            console.log(results.email_user);
            if(result){
                req.session.loggedin=true
                req.session.email=results.email_user
                res.redirect('home')
            }else{
                return res.json({
                    succes:0,
                    message:"Email or password invalid"
                })
            }
        })
    },
}
