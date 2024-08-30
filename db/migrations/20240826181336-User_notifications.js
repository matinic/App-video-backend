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
    await queryInterface.createTable("User_Notification",{
      id:  {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        unique: true,
      },
      notificationId: {
        type: Sequelize.UUID,
        references: {
          model: 'notifications',  // Tabla referenciada
          key: 'id'           // Clave primaria referenciada
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      userId: {
        type: Sequelize.UUID,
        references: {
          model: 'users',  // Tabla referenciada
          key: 'id'           // Clave primaria referenciada
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("userNotification")
  }
};
