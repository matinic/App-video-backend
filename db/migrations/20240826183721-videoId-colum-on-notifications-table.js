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
   await queryInterface.addColumn("notifications","videoId",{
    type: Sequelize.UUID,
    references: {
      model: 'videos',  // Tabla referenciada
      key: 'id'           // Clave primaria referenciada
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
   })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("notifications","videoId")
  }
};
