import express from "express"
import userController from "../controllers/userController"
import authController from "../controllers/authController"
import orderController from "../controllers/orderController"
import uploadController from "../controllers/uploadController"
import  {verify_token}  from "../middleware/index.js"

let router = express.Router()
let initWebRoutes = (app) => {

     router.post('/api/create-user', userController.createUser);
     router.delete(`/api/delete-user/:id`, userController.deleteUser);
     router.post('/api/update-password', userController.updatePassword);
     router.post('/api/update-information', userController.updateInformation);
     
     router.post('/api/login-user', authController.loginUser);
     router.delete('/api/logout-user', authController.logoutUser);
     router.post('/api/verify-token', authController.verifyToken);
     router.post('/api/forgot-password', authController.forgotPassword);
     router.post('/api/reset-password', authController.resetPassword);
     router.post('/api/upload',uploadController.uploadImg);
     router.delete('/api/destroy',uploadController.destroyImg);
     router.post('/api/create-order',orderController.createOrder);
  
     router.get('/api/get-user', userController.getUser);
     router.get('/api/get-all-user', userController.getAllUser);
        return app.use("/", router);


}

module.exports = initWebRoutes;