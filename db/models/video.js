'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Video extends Model {
    static associate(models) {
      models.Video.belongsTo(models.User,{as:'user', foreignKey: 'userId'})
    }
  }
  Video.init({
    id: DataTypes.UUID,
    name: DataTypes.STRING,
    duration: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Video',
  });
  return Video;
};