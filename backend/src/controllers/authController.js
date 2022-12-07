import jwt from "jsonwebtoken"
import bcrypt  from 'bcrypt';
import db from "../models/index"
import nodemailer from "nodemailer"
const salt = bcrypt.genSaltSync(10);
import {createAccessToken,createRefreshToken} from "../helper/index"
require('dotenv').config()

let loginUser = async (req,res)=>{
    try{
     
        const {email,password} = req.body
         let user = await db.User.findOne({
                where:{email:email}
            })
       if(!user)   return res.status(500).json({msg:"can not find user"})
           
                let confirm = await bcrypt.compareSync(password, user.password);
                if(confirm){
                    let token =createAccessToken(user)
                    let refreshtoken =  createRefreshToken(user)
                      res.cookie('refreshtoken', refreshtoken, {
                        httpOnly: true,
                        path: '/api/verify-token',
                        maxAge: 7*24*60*60*1000 // 7d
                    })
                    return res.status(200).json({token,refreshtoken})
                      
            }
            else{
                  return res.status(500).json({msg:"wrong password"})
            }
    }
    catch(err){
         return res.status(500).json({msg:err.message})
    }
 }
let logoutUser = async (req,res)=>{
    try{
            /*   const rf_token = req.body.refreshtoken;
              console.log("refresglogoyut",REFRESH_TOKENS)
            if(!rf_token) return res.status(400).json({msg:"dont have token"})
         REFRESH_TOKENS= REFRESH_TOKENS.filter(token=>token !== rf_token)
            console.log("refresglogoyut",REFRESH_TOKENS) */
             res.clearCookie("refreshtoken",{path:"/api/verify-token"})
           
            return res.json({msg:"logout success"})
    }
    catch(err){
        console.log(err.message)
         return res.status(500).json({msg:err.message})
    }
 }
let verifyToken = async(req,res)=>{
    try{    
        const rf_token = req.cookies.refreshtoken;
            if(!rf_token) return res.status(400).json({msg:"Please give tooken refresh"})
           jwt.verify(rf_token,process.env.REFRESH_TOKEN,(err,user)=>{
                if(err) return res.status(400).json({msg:"jwt het han"})
                const accessToken =createAccessToken({email:user.email})
                  res.status(400).json({accessToken})
          })
        }
        catch(err){
            console.log(err.message)
            return res.status(500).json({msg:err.message})
        }
 }
let forgotPassword = async(req,res)=>{
    try{    
        const {email} =req.body
        console.log(email)
        let token= jwt.sign({email:email}, process.env.FORGET_TOKEN, {expiresIn: '1d'})
          let transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 587,
                    secure: false, 
                    auth: {
                    user: process.env.EMAIL_APP , 
                    pass:  process.env.EMAIL_APP_PASSWORD, 
                    },
                });

        let info = await transporter.sendMail({
            from: 'buidangkhoa252001@gmail.com',
            to: email, 
            subject: "Click to reset password", 
            text: "Click to verify",/* `process.env.CLIENT_URL/reset-password/:token */
            html: `<a href="https://www.youtube.com/watch?v=kfw61IxDgW8" target="_blank"><button style="background-color:yellow;padding:6px;;text-align:center;">Click to verify</button></a>`,
        });
            return   res.status(400).json({msg:"success mail",token:token})
        }
        catch(err){
            console.log(err.message)
            return res.status(500).json({msg:err.message})
        }
 }
let resetPassword = async(req,res)=>{
    try{    
            let {token,newpassword} = req.body
           
            const decode=  jwt.verify(token, process.env.FORGET_TOKEN);
            if(!decode) return res.status(500).json({msg: "thieu token "})
            let user = await db.User.findOne({
                    where:{email:decode.email},
                    raw:false
            })
             console.log(user)
            if(!user)   return res.status(400).json({msg:"can not find user"})
             if(user){
                let newPassword = await bcrypt.hashSync(newpassword, salt);
                  user.password= newPassword,
                  await user.save();
                return  res.status(200).json({errMess:"reset password success"})
              }
        }
        catch(err){
            console.log(err.message)
            return res.status(500).json({msg:err.message})
        }
 }
module.exports={
    logoutUser,loginUser,verifyToken,forgotPassword,resetPassword
}