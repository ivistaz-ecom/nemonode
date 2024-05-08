// const { DataTypes, Op } = require('sequelize');
// const sequelize = require('../util/database');
// const Discussion = require('./discussion');

// const Calls = sequelize.define('Calls', {
//     call_count: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         defaultValue: 0
//     },
// }, {
//     tableName: 'calls', // Ensure this matches your actual table name in the database
//     timestamps: false, // If you don't want Sequelize to automatically manage createdAt and updatedAt fields
// });

// // Function to update call_count with the count fetched from Discussion
// const updateCallCount = async () => {
//     try {
//         const currentTime = new Date();
//         const yesterday = new Date(currentTime);
//         yesterday.setDate(yesterday.getDate() - 1); // Get the timestamp for yesterday

//         const twoDaysAgo = new Date(yesterday);
//         twoDaysAgo.setDate(twoDaysAgo.getDate() - 1); // Get the timestamp for two days ago

//         // Fetch the count of discussions created between two days ago and yesterday
//         const callCount = await Discussion.count({
//             where: {
//                 created_date: {
//                     [Op.between]: [twoDaysAgo, yesterday] // Filter discussions from two days ago until yesterday
//                 },
//                 [Op.or]: [ // Filter discussions containing proposed, approved, joined, or rejected
//                     { discussion: { [Op.like]: '%Proposed%' } },
//                     { discussion: { [Op.like]: '%Approved%' } },
//                     { discussion: { [Op.like]: '%Joined%' } },
//                     { discussion: { [Op.like]: '%Rejected%' } }
//                 ]
//             }
//         });

//         // Find the record for yesterday's calls and update call_count directly
//         await Calls.update({ call_count: callCount }, { where: {} });
//     } catch (error) {
//         console.error('Error updating call count:', error);
//     }
// };

// // Update call_count every day
// setInterval(updateCallCount, 24 * 60 * 60 * 1000); // 24 hours

// module.exports = Calls;

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
        const yesterday = new Date(currentTime);
        yesterday.setDate(yesterday.getDate() - 1); // Get the timestamp for yesterday

        const twoDaysAgo = new Date(yesterday);
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 1); // Get the timestamp for two days ago

        // Fetch the count of discussions created between two days ago and yesterday
        const callCount = await Discussion.count({
            where: {
                created_date: {
                    [Op.between]: [twoDaysAgo, yesterday] // Filter discussions from two days ago until yesterday
                }
            }
        });

        // Find the record for yesterday's calls and update call_count directly
        await Calls.update({ call_count: callCount }, { where: {} });
    } catch (error) {
        console.error('Error updating call count:', error);
    }
};

// Function to update counts with the count fetched from Discussion
const updateDiscussionCounts = async () => {
    try {
        const currentTime = new Date();
        const yesterday = new Date(currentTime);
        yesterday.setDate(yesterday.getDate() - 1); // Get the timestamp for yesterday

        const twoDaysAgo = new Date(yesterday);
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 1); // Get the timestamp for two days ago

        // Fetch the counts of discussions created between two days ago and yesterday
        const counts = await Discussion.findAll({
            attributes: [
                [sequelize.fn('COUNT', sequelize.literal('CASE WHEN `discussion` LIKE "%Proposed%" THEN 1 ELSE NULL END')), 'proposed_count'],
                [sequelize.fn('COUNT', sequelize.literal('CASE WHEN `discussion` LIKE "%Approved%" THEN 1 ELSE NULL END')), 'approved_count'],
                [sequelize.fn('COUNT', sequelize.literal('CASE WHEN `discussion` LIKE "%Joined%" THEN 1 ELSE NULL END')), 'joined_count'],
                [sequelize.fn('COUNT', sequelize.literal('CASE WHEN `discussion` LIKE "%Rejected%" THEN 1 ELSE NULL END')), 'rejected_count']
            ],
            where: {
                created_date: {
                    [Op.between]: [twoDaysAgo, yesterday] // Filter discussions from two days ago until yesterday
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
