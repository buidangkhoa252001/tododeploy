import bcrypt  from 'bcrypt';
import db from "../models/index"
const { Op } = require("sequelize");
const salt = bcrypt.genSaltSync(10);
 let createUser = async (req,res)=>{
    try{
       const {password,email,firstName} = req.body
     /*   const {password,email,firstName,lastName,address,phonenumber,gender,role} = req.body */
     console.log(email)
        let passwordhash = await bcrypt.hashSync(password, salt);
          await db.User.create({
                    email: email,
                    password:  passwordhash,
                    firstName:  firstName,
                  /*   lastName:  lastName,
                    address: address,
                    phonenumber:   phonenumber,
                    gender:  gender ,
                    role: role, */
                })
                console.log("create")
           return  res.status(200).json({errMess:"create success"})
    }
    catch(err){
       return res.status(500).json({msg:err.message})
    }
 }
 let  deleteUser = async (req,res)=>{
    try{
       const {id} = req.params
       console.log(req.params)
       console.log(typeof(+id))
       console.log(+id)
   /*      const user = await db.User.findByPk(+id);    */
           await db.User.destroy({
             where: { id: +id },
           });
         /*   console.log(user) */
           
           return  res.status(200).json({msg:"gg"})
    }
    catch(err){
       return res.status(500).json({msg:err.message})
    }
 }
 let updatePassword = async (req,res)=>{
    try{
         /*  let data = await userService.updatePassword(req.body)
       return  res.status(200).json(data) */
       const {email,opassword,npassword} = req.body
        let user =  await db.User.findOne({
               where:{email:email},
                raw:false
            })
            console.log("user",user)
           if(!user)   return res.status(400).json({msg:"can not find user"})
            let confirm=  bcrypt.compareSync(opassword, user.password);
            if(confirm){
                  let newPassword = await bcrypt.hashSync(npassword, salt);
                  user.password= newPassword,
                  await user.save();
                return  res.status(200).json({errMess:"change password success"})
              }
              else{
                return res.status(500).json({msg:"wrong password"})
              }
    }
    catch(err){
        return res.status(500).json({msg:err.message})
    }
 }
 let getUser = async (req,res)=>{
    try{
      console.log("gg",req.user)
          return  res.status(200).json(req.user)
          }
    catch(err){
        return res.status(500).json({msg:err.message})
    }
 }
 let getAllUser = async (req,res)=>{
    try{
        /* pagination */ /* sort ,search */
        console.log(req)
         const {sortBy,keyword}  = req.query
          const page  = req.query.page ? req.query.page :0
          const pageSize  = req.query.pageSize ? req.query.pageSize :10
        /*   keyword =keyword.toLowerCase() */
         let offset = page * pageSize;
         let limit = +pageSize;
    /*      console.log(sortBy) */
         if(keyword&&sortBy){
              const { count, rows }  =  await db.User.findAndCountAll({
              where:{
                [Op.or]: [
                  { 'firstName': { [Op.like]: '%' + keyword + '%' } },
              /*     { '$Comment.body$': { [Op.like]: '%' + query + '%' } } */
                ]
              },  
              offset:offset,
              limit: limit ,
              order:[['createdAt',sortBy]]
            })
              return  res.status(200).json({data:rows,count})
         }
         else{
           const { count, rows }  =  await db.User.findAndCountAll({ 
              offset:offset,
              limit: limit ,
              order:[['createdAt',"ASC"]]
            })
              return  res.status(200).json({data:rows,count})
         }
     /*  console.log("gg",users) */
        
          }
    catch(err){
        return res.status(500).json({msg:err.message})
    }
 }
 let updateInformation = async (req,res)=>{
    try{
      /* ket hop voi up ảnh */
      const {email,firstName,image} = req.body
        let user =  await db.User.findOne({
               where:{email:email},
                raw:false
            })
        
        if(!user) return  res.status(400).json({msg:"can not find user"})
       /*  if(user.image){
            JSON.parse(user.image).public_id
           return  res.status(400).json({msg:"user image gg"})
        } */
        if(user){
          user.image=image
          user.firstName=firstName
           await user.save();
          return  res.status(200).json({msg:"change information success"})
        }

        }
    catch(err){
        return res.status(500).json({msg:err.message})
    }
 }

module.exports={
    createUser:createUser,
    deleteUser:deleteUser,
    updatePassword:updatePassword,
    getUser:getUser,
    getAllUser:getAllUser,
    updateInformation:updateInformation
}