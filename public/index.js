const socket = io();
const visitToday = document.querySelector(".today_visit");
const logout = document.querySelector(".logout");

socket.on("todayVisit", (visitNumber) => {
    visitToday.textContent = "오늘 방문자: " + visitNumber;
});

logout.addEventListener("click", () => {
    post();
    async function post() {
        let response = await fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            }
        });

        let result = await response.json();
        if (result.logout === true) {
            window.location.reload();
        }
    }
});
