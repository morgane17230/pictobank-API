const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    pool: {
        max: 5,
        min: 0,
        idle: 10000
      },
    define: {
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
    },
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
});

module.exports = sequelize;
