'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class notification extends Model {
    static associate(models) {
        models.notification.belongsTo(models.video)
        models.notification.belongsToMany(models.user,{through: models.User_Notification})
        models.notification.hasMany(models.User_Notification)
    }
  }
    notification.init({
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: sequelize.literal('gen_random_uuid()'),
      unique: true,
    },
    message: DataTypes.STRING,
    videoId: DataTypes.UUID

  }, {
    sequelize,
    modelName: 'notification',
    timestamps: true,
  });
  return notification;
};