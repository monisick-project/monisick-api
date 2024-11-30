import { DataTypes } from "sequelize";
import sequelize from "../config/Database.js";

const Food = sequelize.define("food", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    food_date: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW, // Set default as current date
    },
    food_time: {
        type: DataTypes.ENUM("breakfast", "lunch", "dinner"),
        allowNull: false,
    },
    calories: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    proteins: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    carbo: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    fats: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    massa: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    monitoringPeriodId: {
        type: DataTypes.INTEGER,
        references: {
            model: "monitoring_periods", // Nama tabel MonitoringPeriod
            key: "id",
        },
        allowNull: false,
        onDelete: "CASCADE" 
    },
});

export default Food;
