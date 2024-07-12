const { DataTypes, Op } = require('sequelize');
const sequelize = require('../util/database');
const Discussion = require('./discussion');

const Calls = sequelize.define('Calls', {
    call_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    proposed_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    approved_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    joined_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    rejected_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    tableName: 'calls', // Ensure this matches your actual table name in the database
    timestamps: false, // If you don't want Sequelize to automatically manage createdAt and updatedAt fields
});

// Function to update call_count with the count fetched from Discussion
const updateCallCount = async () => {
    try {
        const currentTime = new Date();
        const startDate = new Date(currentTime);
        startDate.setDate(startDate.getDate() - 1);
        startDate.setUTCHours(0, 0, 0, 0); // Set start time to 00:00:00

        const endDate = new Date(currentTime);
        endDate.setUTCHours(23, 59, 59, 999); // Set end time to 23:59:59

        // Fetch the count of discussions created within the date range
        const callCount = await Discussion.count({
            where: {
                created_date: {
                    [Op.between]: [startDate, endDate] // Filter discussions from startDate to endDate
                }
            }
        });

        // Update call_count directly
        await Calls.update({ call_count: callCount }, { where: {} });
    } catch (error) {
        console.error('Error updating call count:', error);
    }
};

// Function to update counts with the count fetched from Discussion
const updateDiscussionCounts = async () => {
    try {
        const currentTime = new Date();
        const startDate = new Date(currentTime);
        startDate.setDate(startDate.getDate() - 1);
        startDate.setUTCHours(0, 0, 0, 0); // Set start time to 00:00:00

        const endDate = new Date(currentTime);
        endDate.setUTCHours(23, 59, 59, 999); // Set end time to 23:59:59

        // Fetch the counts of discussions created within the date range
        const counts = await Discussion.findAll({
            attributes: [
                [sequelize.fn('COUNT', sequelize.literal('CASE WHEN `discussion` LIKE "%Proposed%" THEN 1 ELSE NULL END')), 'proposed_count'],
                [sequelize.fn('COUNT', sequelize.literal('CASE WHEN `discussion` LIKE "%Approved%" THEN 1 ELSE NULL END')), 'approved_count'],
                [sequelize.fn('COUNT', sequelize.literal('CASE WHEN `discussion` LIKE "%Joined%" THEN 1 ELSE NULL END')), 'joined_count'],
                [sequelize.fn('COUNT', sequelize.literal('CASE WHEN `discussion` LIKE "%Rejected%" THEN 1 ELSE NULL END')), 'rejected_count']
            ],
            where: {
                created_date: {
                    [Op.between]: [startDate, endDate] // Filter discussions from startDate to endDate
                }
            },
            raw: true
        });

        // Update the counts in the Calls table
        await Calls.update(
            {
                proposed_count: counts[0].proposed_count || 0,
                approved_count: counts[0].approved_count || 0,
                joined_count: counts[0].joined_count || 0,
                rejected_count: counts[0].rejected_count || 0
            },
            {
                where: {} // This empty object means update all rows in the table
            }
        );

    } catch (error) {
        console.error('Error updating counts:', error);
    }
};

setInterval(updateCallCount, 24 * 60 * 60 * 1000); // 24 hours
setInterval(updateDiscussionCounts, 24 * 60 * 60 * 1000); // 24 hours

module.exports = Calls;
