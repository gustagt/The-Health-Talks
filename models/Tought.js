const { DataTypes } = require('sequelize');
const db = require('../db/Conn');

const User = require('./User');

const Tought = db.define('Tought', {
    title:{
        type: DataTypes.TEXT,
        allowNull: false,
        require: true
    },
})

Tought.belongsTo(User);
User.hasMany(Tought);

module.exports = Tought;