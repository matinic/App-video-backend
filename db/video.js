'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class video extends Model {
    static associate(models) {
      models.video.belongsTo(models.user,{foreignKey:'userId'})
    }
  }
  video.init({
    id:{
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: sequelize.literal('gen_random_uuid()'),
      unique: true
    },
    name: {
      type: DataTypes.STRING,
    },
    userId:{
      type: DataTypes.UUID,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    description:{
      type: DataTypes.STRING
    },
    url:{
      type: DataTypes.STRING,
      allowNull: false
    },
    likes:{
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    published: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    }
  }, {
    sequelize,
    modelName: 'video',
    timestamps: true
  });
  return video;
};