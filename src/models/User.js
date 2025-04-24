module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      username: DataTypes.STRING,
      email: { type: DataTypes.STRING, unique: true },
      passwordHash: DataTypes.STRING,
    });
  
    User.associate = models => {
      User.hasMany(models.Review);
      User.hasMany(models.Comment);
    };
  
    return User;
  };
  