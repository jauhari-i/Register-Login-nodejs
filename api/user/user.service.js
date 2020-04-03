const db = require("../../config/connection")

module.exports = {
    serviceAdd: (data)=>{
      db.query(
        `insert into tb_user set ?`,
        [data]
      )  
    },
    serviceCheck:(data,callBack)=>{
        db.query(
            `select email_user from tb_user where email_user=?`,
            [data.email_user],
            (err,results)=>{
                if(err){
                    return callBack(err);
                }else{
                    return callBack(null, results[0])
                }
            }
        )
    },
    serviceLogin: (data,callBack)=>{ 
        // console.log(data);
        db.query(
            `select email_user,password from tb_user where email_user=? `,
            [data.email_user],(err,results)=>{
                if(err){
                    return callBack(err)
                }else{
                    return callBack(null,results[0])
                }
            }
        )
    },
}