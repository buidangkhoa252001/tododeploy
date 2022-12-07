import jwt from "jsonwebtoken"
import db from "../models/index"

export const verify_token = async(req,res,next)=>{
    try{
        const header = req.headers["authorization"]
        console.log(header)
        const token = header?.split(" ")[1];
        console.log(token)
        if(!token) return res.status(400).json({msg: "Dont have a token"})
      const decode=  jwt.verify(token, process.env.ACCESS_TOKEN, {
            complete: true
        });
       if(!decode) return res.status(500).json({msg: "thieu token "})
       console.log(decode)
        let user = await db.User.findOne({
                where:{email:decode.payload.email}
        })
        req.user = user        
        next()

    }
    catch(err){
            return res.status(500).json({msg: "jwt expired."})
    }
}
export const verify_customer = async(req,res,next)=>{
    try{
      /*   console.log(req.user) */
        if(req.user.role!=="customer"){
              return res.status(400).json({msg: "Customer resources access denied"})
        }
        next()
    }
    catch(err){
         return res.status(500).json({msg: err.message})
    }
}
export const verify_admin = async(req,res,next)=>{
    try{
         if(req.user.role!=="admin"){
              return res.status(400).json({msg: "Admin resources access denied"})
        }
         next()
    }
    catch(err){
          return res.status(500).json({msg: err.message})
    }
}