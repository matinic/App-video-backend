'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    static associate(models) {
      models.user.hasMany(models.video,{foreignKey:'userId'})
    }
  }
  user.init({
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: sequelize.literal('gen_random_uuid()'),
      unique: true,
    },
    image:{
      type: DataTypes.STRING,
    },
    username:{
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true
    },
    followers:{
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    followersCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    subscriptions:{
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    likedVideos:{
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: []
    },
    dislikedVideos: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: []
    },
    refreshToken: DataTypes.STRING

  }, {
    sequelize,
    modelName: 'user',
    timestamps: true
  });
  return user;
};