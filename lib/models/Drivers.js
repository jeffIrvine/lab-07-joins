const pool = require('../utils/pool');
const Car = require('./Cars');



module.exports = class Driver {
    id;
    license;
    carId;

    constructor(row) {
      this.id = String(row.id);
      this.license = row.license;
      this.carId = String(row.car_id);
    }

    static async insert({ license, carId }) {
      const { rows } = await pool.query(
        'INSERT INTO drivers (license, car_id) VALUES ($1, $2) RETURNING *',
        [license, carId]
      );
  
      return new Driver(rows[0]);
    }
  
    static async findById(id) {
      const { rows } = await pool.query(
        `SELECT 
          drivers.*
          array_to_json(array_agg(cars.*)) AS cars 
        FROM 
          drivers
        JOIN cars
        ON drivers.id = cars.drivers_id
        WHERE drivers.id=$1
        GROUP BY drivers.id`,
        [id]
      );
  
      if(!rows[0]) throw new Error(`No Driver found with the id of ${id}`);
  
      return { 
        ...new Driver(rows[0]),
        cars: rows[0].cars.map(car => new Car(car))
      };
    }
  
  
    static async find() {
      const { rows } = await pool.query('SELECT * FROM drivers');
  
      return rows.map(row => new Driver(row));
    }
      
    static async update(id, { license, carId }) {
      const { rows } = await pool.query(
        `UPDATE drivers
            SET license=$1,
              car_id=$2,
              WHERE id=$3
              RETURNING *`,
        [license, carId, id]
      );
    
      if(!rows[0]) throw new Error(`No Driver found with the id of ${id}`);
          
      return new Driver(rows[0]);
    }
  
  
    static async delete(id) {
      const { rows } = await pool.query(
        'DELETE FROM drivers WHERE id=$1 RETURNING *',
        [id]
      );
    
      if(!rows[0]) throw new Error(`No Driver found with the id of ${id}`);
          
      return new Driver(rows[0]);
    }
};
