'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.addColumn('Users','password',{
    type: Sequelize.STRING,
    unique: true,
   })
  },

  async down (queryInterface, Sequelize) {
    await query.removeColumn('Users','password')
  }
};
