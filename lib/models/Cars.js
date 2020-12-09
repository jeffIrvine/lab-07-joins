const pool = require('../utils/pool');

module.exports = class Car {
    id;
    make;
    model;
    color;

    constructor(row) {
      this.id = row.id;
      this.make = row.make;
      this.model = row.model;
      this.color = row.color;
    }

    static async insert({ make, model, color }) {
      const { rows } = await pool.query(
        'INSERT INTO cars (make, model, color) VALUES ($1, $2, $3) RETURNING *',
        [make, model, color]
      );

      return new Car(rows[0]);
    }

};
