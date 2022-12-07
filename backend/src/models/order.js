'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.User, { foreignKey: 'userId',targetKey: 'id', as:'userData',onDelete: 'CASCADE',hooks:true});
    }
  };
  Order.init({
    userId:DataTypes.INTEGER,
    productName: DataTypes.TEXT,
 
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};