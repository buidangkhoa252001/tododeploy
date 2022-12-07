import db from "../models/index"
 let createOrder = async (req,res)=>{
    try{
       const {productName} = req.body
       const userId = req.body.userId
       console.log(userId)
        let user =  await db.User.findOne({
               where:{id:userId}
            })
            console.log(user)
         if(user){
               await db.Order.create({
                        userId: userId,
                        productName:  productName,
                     })
               return  res.status(200).json({errMess:"create order success"})
            
         }
         else{
                return  res.status(400).json({errMess:"Dont find a user"})
         }
    }
    catch(err){
       return res.status(500).json({msg:err.message})
    }
 }
 let deleteOrder = async (req,res)=>{
    try{
      
    }
    catch(err){
       return res.status(500).json({msg:err.message})
    }
 }


module.exports={
    createOrder:createOrder,
    deleteOrder:deleteOrder,
   
}