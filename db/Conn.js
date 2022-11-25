const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize('toughts', 'root', 'samuel123', {
//     host:'localhost',
//     dialect:'mysql'
// })

const sequelize = new Sequelize('thehealthtalks', 'root', 'samuel123', {
    host:'localhost',
    dialect:'mysql'
})


try{
    sequelize.authenticate();
    console.log('Connected!');
}
catch(err){
    console.log(`Connection failed: ${err}`);
}

module.exports = sequelize;