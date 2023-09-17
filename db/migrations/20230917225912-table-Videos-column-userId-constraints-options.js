'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('Videos',{
      type: 'foreign key',
      fields: ['userId'],
      references:{
        table:'Users',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      name: 'fk_userId',
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Videos','fk_userId')
  }
};
