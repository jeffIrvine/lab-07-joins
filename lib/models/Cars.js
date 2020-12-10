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

    static async findById(id) {
      const { rows } = await pool.query(
        'SELECT * FROM cars WHERE id=$1',
        [id]
      );

      if(!rows[0]) throw new Error(`No car found with the id of ${id}`);

      return new Car(rows[0]);
    }


    static async find() {
      const { rows } = await pool.query('SELECT * FROM cars');

      return rows.map(row => new Car(row));
    }
    
};
