'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.bulkUpdate('users',{dislikedVideos: []},{dislikedVideos: null})
    await queryInterface.changeColumn('users','dislikedVideos',{
      type: Sequelize.DataTypes.ARRAY(Sequelize.DataTypes.STRING),
      allowNull: false,
      defaultValue: []
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.bulkUpdate('users',{dislikedVideos: null},{dislikedVideos: []})
    await queryInterface.changeColumn('users','dislikedVideos',{
      type: Sequelize.DataTypes.ARRAY(Sequelize.DataTypes.STRING),
      allowNull: true,
      defaultValue: null
    })
  }
};
