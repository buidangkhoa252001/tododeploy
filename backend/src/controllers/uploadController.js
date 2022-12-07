import fs from "fs"
import cloudinary from 'cloudinary'
require('dotenv').config()

// Return "https" URLs by setting secure: true
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

let uploadImg = async(req,res)=>{
    try{    
         
             if(!req.files || Object.keys(req.files).length===0)
            {
                fs.unlinkSync(file.tempFilePath);   
                return res.status(400).json({msg:"No files were upload"})
            }
            const file = req.files.file
            if(file.size > 1024*1024) 
            {
                fs.unlinkSync(file.tempFilePath);   
                return res.status(400).json({msg:"Files size too large"})
            }

            if(file.mimetype !== "image/jpeg" && file.mimetype !== "image/png")
            {
                 fs.unlinkSync(file.tempFilePath);   
                return res.status(400).json({msg:"Wrong format file"})
            }
              cloudinary.v2.uploader.upload(file.tempFilePath,{folder:"sqlprojectvui"},async(err,result)=>{
                if(err){ 
                    console.log(err)
                    throw err
                 }
                console.log(result)
         fs.unlinkSync(file.tempFilePath);   
              
                res.json({public_id: result.public_id, url: result.secure_url})

            })

        }
        catch(err){
            return res.status(500).json({msg:err.message})
        }
 }
let destroyImg = async(req,res)=>{
    try{    
               const {public_id} = req.body;
        if(!public_id) return res.status(400).json({msg: 'No images Selected'})
              cloudinary.v2.uploader.destroy(public_id,async(err,result)=>{
                if(err){ 
                    throw err
                 }
                 res.json({msg: "Deleted Image"})

            })
        }
        catch(err){
            return res.status(500).json({msg:err.message})
        }
 }

module.exports={
    uploadImg:uploadImg,
    destroyImg:destroyImg
}