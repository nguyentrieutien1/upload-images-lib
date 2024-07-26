const pool = require("../../config/database");

module.exports = {
    find: async () => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const environment = process.env.NODE_ENV || 'development';
            const basePath = environment === 'development' ? 'http://localhost:3000/upload/' : 'https://1kview.click/upload/';

            const fetchResult = await connection.query(
                `SELECT 
    CONCAT('${basePath}', profile_picture) AS profile_picture
    FROM profile`
            );
            await connection.commit();
            return fetchResult[0];
        } catch (error) {
            return error;
        } finally {
            connection.release();
        }
    },
    create: async (data) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const queryResult = await connection.query(
                `insert into profile
                (profile_picture)
                values(?)`, [
                data.profile_picture
            ]
            );
            const environment = process.env.NODE_ENV || 'development';
            const basePath = environment === 'development' ? 'http://localhost:3000/upload/' : 'https://1kview.click/upload/';
            console.log(environment);
            const fetchResult = await connection.query(
                `SELECT 
                CONCAT("${basePath}",profile_picture) AS image_url
                FROM profile WHERE id = ?`, [queryResult[0].insertId]
            );
            await connection.commit();
            return fetchResult[0][0];
        } catch (error) {
            return error;
        } finally {
            connection.release();
        }
    },
};
