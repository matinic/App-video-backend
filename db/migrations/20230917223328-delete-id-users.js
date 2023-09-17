'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users','uid',{
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users','uid')
  }
};
