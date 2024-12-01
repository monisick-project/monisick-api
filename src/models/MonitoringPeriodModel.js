import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js"; 
import Medications from "./MedicationModel.js";
const { DataTypes } = Sequelize;

const MonitoringPeriod = db.define('monitoring_periods', {
    monitoring_name: {
        type: DataTypes.STRING,
        allowNull: false,  
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Users,
            key: 'id'
        }
    },
    status: {
        type: DataTypes.ENUM('active', 'expired'),
        defaultValue: 'active', // Status default adalah 'active'
    }
}, {
    freezeTableName: true
});

// Association: A Monitoring Period has many Medications
MonitoringPeriod.hasMany(Medications, {
    foreignKey: "monitoringPeriodId",
    onDelete: "CASCADE", // Cascade delete medications
    onUpdate: "CASCADE"
});
Medications.belongsTo(MonitoringPeriod, {
    foreignKey: "monitoringPeriodId"
});
export default MonitoringPeriod;
