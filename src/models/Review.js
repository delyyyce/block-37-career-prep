module.exports = (sequelize, DataTypes) => {
    const Review = sequelize.define('Review', {
      rating: DataTypes.INTEGER,
      text: DataTypes.TEXT,
    });
  
    Review.associate = models => {
      Review.belongsTo(models.User);
      Review.belongsTo(models.Item);
      Review.hasMany(models.Comment);
    };
  
    return Review;
  };
  