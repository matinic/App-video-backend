'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class video extends Model {
    static associate(models) {
      models.video.belongsTo(models.user,{foreignKey: "userId"})
      models.video.hasOne(models.notification)
    }
  }
  video.init({
    id:{
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: sequelize.literal('gen_random_uuid()'),
      unique: true
    },
    title: {
      type: DataTypes.STRING,
    },
    userId:{
      type: DataTypes.UUID,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    description:{
      type: DataTypes.TEXT
    },
    url:{
      type: DataTypes.STRING,
      allowNull: false
    },
    likes:{
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    dislikes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    published: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    poster:{
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    userId:{
      type: DataTypes.UUID,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    }
  }, {
    sequelize,
    modelName: 'video',
    timestamps: true,
    paranoid: true,
  });
  return video;
};