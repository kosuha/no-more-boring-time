const express = require('express');
const router = express.Router();
const connection = require('../config/conn.js');

router.get('/', (request, response) => {
    response.sendFile(__dirname + 'random-block-puzzle/index.html');
});

router.post('/user-data-process', (request, response) => {
    const userData = request.session.passport.user;
    
    connection.query(`SELECT * FROM rank_random_block_puzzle WHERE id_kakao = ${userData.id}`,
        (error, rows, fields) => {
            if (error) {
                throw error;
            }
            if (Object.keys(rows).length === 0) {
                response.json({userData: userData, highest: 0});
            } else {
                response.json({userData: userData, highest: rows[0].score});
            }
        });
});

router.post('/ranking-process', (request, response) => {
    connection.query('SELECT * FROM rank_random_block_puzzle ORDER BY score DESC LIMIT 10',
        (error, rows, fields) => {
            response.json(rows);
        });
});

router.post('/score-upload-process', (request, response) => {
    const userData = request.session.passport.user;
    connection.query(
        `INSERT INTO log_random_block_puzzle(id_kakao, nickname_kakao, username_kakao, profile_image, score, level, mobile) VALUES(?, ?, ?, ?, ?, ?, ?)`,
        [userData.id, userData.userName, userData.nickName, userData.profileImageURL, request.body.score, request.body.level, request.body.isMobile],
        (error, rows, fields) => {
            if (error) {
                throw error;
            }
        });

    connection.query(`SELECT * FROM rank_random_block_puzzle WHERE id_kakao = ${userData.id}`,
        (error, rows, fields) => {
            if (error) {
                throw error;
            }
            if (Object.keys(rows).length === 0) {
                connection.query(
                    `INSERT INTO rank_random_block_puzzle(id_kakao, nickname_kakao, username_kakao, profile_image, score, level) VALUES(?, ?, ?, ?, ?, ?)`,
                    [userData.id, userData.userName, userData.nickName, userData.profileImageURL, request.body.score, request.body.level],
                    (error, rows, fields) => {
                        if (error) {
                            throw error;
                        }
                    });
            } else {
                if (rows[0].score < request.body.score) {
                    connection.query(
                        `UPDATE rank_random_block_puzzle SET score = '${request.body.score}', level = '${request.body.level}', nickname_kakao = '${userData.nickName}' WHERE id_kakao = '${userData.id}'`,
                        (error, rows, fields) => {
                            if (error) {
                                throw error;
                            }
                        });
                }
            }
        });
});

module.exports = router;