const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const passport = require('passport');
const kakaoStrategy = require('passport-kakao').Strategy;
const connection = require('./config/conn.js');
const kakaoCredentials = require('./config/kakao.json');
const session = require('express-session');
const sessionData = require('./config/session.json');
const MySQLStore = require('express-mysql-session')(session);
const sessionStoreConn = require('./config/sessionStoreConn.js');

const covid19 = require('./router/covid-19');
const randomBlockPuzzle = require('./router/random-block-puzzle');
const alienHunter = require('./router/alien-hunter');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 세션 검사
const authenticateUser = (request, response, next) => {
    if (request.isAuthenticated()) {
        next();
    } else {
        response.status(301).redirect('/signin');
    }
};

app.use(session({
    secret: sessionData.data.secret,
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore(sessionStoreConn)
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new kakaoStrategy({
    clientID: kakaoCredentials.web.client_id,
    clientSecret: kakaoCredentials.web.client_secret,
    callbackURL: kakaoCredentials.web.callback_URL
},
    (accessToken, refreshToken, profile, done) => {

        const id = profile.id;
        const userName = profile.username;
        const nickName = profile.displayName;
        const profileImageURL = profile._json.properties.thumbnail_image;

        let user = {
            id: id,
            userName: userName,
            nickName: nickName,
            profileImageURL: profileImageURL
        };

        done(null, user);
    }
));

app.get('/auth/kakao',
    passport.authenticate('kakao')
);

app.get('/auth/kakao/callback',
    passport.authenticate('kakao', { failureRedirect: '/signin' }),
    (request, response) => {
        response.redirect('/');
    }
);

app.get('/', authenticateUser, (request, response) => {
    response.sendFile(__dirname + '/index.html');
});

app.get('/signin', (request, response) => {
    response.sendFile(__dirname + '/signin.html');
});

app.use('/covid-19', covid19);
app.use('/random-block-puzzle', randomBlockPuzzle);
app.use('/alien-hunter', alienHunter);

http.listen(80, () => {
    console.log('app run!')
});