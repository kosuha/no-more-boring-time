const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    console.log('http://localhost:3001/api/');
    const data = [
        {
            id: 1,
            title: "랜덤블록퍼즐",
            summary: "테트리스 같은 게임.",
            year: 2021,
            genres: ["puzzle"],
            medium_cover_image: "https://yts.mx/assets/images/movies/these_streets_we_haunt_2021/medium-cover.jpg"
        }
    ];
    res.send(data);
});

module.exports = router;