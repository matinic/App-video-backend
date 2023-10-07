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
    firstName:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName:{
      type: DataTypes.STRING,
      allowNull: false,
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
    likedVideos:{
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    follow:{
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    refreshToken: DataTypes.STRING

  }, {
    sequelize,
    modelName: 'user',
    timestamps: true
  });
  return user;
};