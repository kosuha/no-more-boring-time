const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    console.log('http://localhost:3001/api/');
    const data = [
        {
            id: 2,
            title: "포커",
            summary: "텍사스 홀덤.",
            year: 2021,
            genres: ["card"],
            medium_cover_image: "https://yts.mx/assets/images/movies/these_streets_we_haunt_2021/medium-cover.jpg"
        }
    ];
    res.send(data);
});

module.exports = router;