function changeScreen() {
    const header = document.getElementById("header");
    const grid = document.getElementById("grid");
    const keyboard = document.getElementById("keyboard");
    const login = document.getElementById("login");
    if(header.style.display !== "none" && grid.style.display !== "none" && keyboard.style.display !== "none") {
        header.style.display = "none";
        grid.style.display = "none";
        keyboard.style.display = "none";
        login.style.display = "";
    }
    else {
        header.style.display = "";
        grid.style.display = "";
        keyboard.style.display = "";
        login.style.display = "none";
    }
}

function changeScreen2() {
    const header = document.getElementById("header");
    const grid = document.getElementById("grid");
    const keyboard = document.getElementById("keyboard");
    const puntaje = document.getElementById("puntaje");
    if(header.style.display !== "none" && grid.style.display !== "none" && keyboard.style.display !== "none") {
        header.style.display = "none";
        grid.style.display = "none";
        keyboard.style.display = "none";
        puntaje.style.display = "";
    }
}