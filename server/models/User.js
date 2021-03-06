'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {

    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    name: {
        type: DataTypes.STRING
    }, 
    providerId:{
        type:DataTypes.STRING,
        field: 'provider_id' 
    },
    email: {
        type: DataTypes.STRING
    },
    phoneNumber: {
        type: DataTypes.STRING,
        field:'phone_number'
    },
    status: {
        type: DataTypes.STRING,
        defaultValue:'PORTED'
    }, 
    profileLink : {
        type:DataTypes.STRING,
        field: 'profile_link' 
    },
    createdAt: { 
        type: DataTypes.DATE, 
        field: 'created_at' 
    },
    updatedAt: { 
        type: DataTypes.DATE, field: 'updated_at' 
    },
  }, {
    tableName: 'users',
    timestamps: true,
    underscored: true
  });
  User.associate = function(models) {
    models.WorkLog.belongsTo(models.User,{
        foreignKey:'actorId', 
        as:'actor'
    });
    models.HelpRequest.belongsTo(models.User,{
        foreignKey:'operatorId',
        as:'operator'
    })
    // associations can be defined here
  };
  return User;
};