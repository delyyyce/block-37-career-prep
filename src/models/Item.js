module.exports = (sequelize, DataTypes) => {
    const Item = sequelize.define('Item', {
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
    });
  
    Item.associate = models => {
      Item.hasMany(models.Review);
    };
  
    return Item;
  };
  