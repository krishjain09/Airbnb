import {QueryInterface} from 'sequelize'
module.exports = {
  async up (queryInterface: QueryInterface) {
    queryInterface.sequelize.query(
      (`
        ALTER TABLE hotels
        ADD COLUMN ratings DECIMAL(3,2) DEFAULT NULL,
        ADD COLUMN rating_count INT DEFAULT NULL
        `
      )
    )
  },

  async down (queryInterface: QueryInterface) {
    queryInterface.sequelize.query(
      (`
        ALTER TABLE hotels
        DROP TABLE ratings,
        DROP TABLE rating_count
        `
      )
    )
  }
};
