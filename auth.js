// 세션 검사
module.exports = (request, response, next) => {
    if (request.isAuthenticated()) {
        next();
    } else {
        response.status(301).redirect('/signin');
    }
};