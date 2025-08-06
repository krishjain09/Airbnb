import { QueryInterface } from "sequelize";

module.exports = {
  async up (queryInterface: QueryInterface) {
    queryInterface.sequelize.query(
      `ALTER TABLE rooms ADD COLUMN price INTEGER NOT NULL DEFAULT 0;`
    )
  },

  async down (queryInterface:QueryInterface) {
    queryInterface.sequelize.query(
      `ALTER TABLE rooms DROP COLUMN price;`
    )
  }
};
