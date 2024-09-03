const { Sequelize, DataTypes } = require('sequelize');


const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite' 
});


const User = sequelize.define('User', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    phone: {
      type: DataTypes.STRING
    },
    cpf: {
      type: DataTypes.STRING,
      unique: true
    },
    birthdate: {
      type: DataTypes.DATE
    }
  });

const Product = sequelize.define('Product', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
  

User.hasMany(Product, { foreignKey: 'userId' });
Product.belongsTo(User, { foreignKey: 'userId' });


sequelize.sync()
  .then(() => {
    console.log('Banco de dados sincronizado');
  })
  .catch((error) => {
    console.error('Erro ao sincronizar banco de dados:', error);
  });

module.exports = { User, Product };