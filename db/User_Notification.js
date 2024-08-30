'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User_Notification extends Model {
    static associate(models) {
      models.User_Notification.belongsTo(models.user)
      models.User_Notification.belongsTo(models.notification)
    }
  }
  User_Notification.init({
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: sequelize.literal('gen_random_uuid()'),
      unique: true,
    },
    isRead:{
      type: DataTypes.BOOLEAN,
    },
    

  }, {
    sequelize,
    modelName: 'User_Notification',
    freezeTableName: true,
    timestamps: true
  });
  return User_Notification;
};