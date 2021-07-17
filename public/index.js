const socket = io();
const visitToday = document.querySelector(".today_visit");

socket.on('todayVisit', (visitNumber) => {
    visitToday.textContent = '오늘 방문자: ' + visitNumber;
});

