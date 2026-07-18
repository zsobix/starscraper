const input = document.getElementById("search")
const clock = document.getElementById("clock")
const regex = /^(http:\/\/|https:\/\/)?(www\.)?[a-zA-Z0-9-_\.]+\.[a-zA-Z]+(:\d+)?(\/[a-zA-Z\d\.\-_]*)*[a-zA-Z.!@#$%&=-_'":,.?\d*)(]*$/
const seconds = document.getElementById("seconds")
const day = document.getElementById("date")
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const favorite = document.getElementById("addfavorite")
const buttons = document.getElementsByClassName("favorite")
const re2 = /(^https?:\/\/(?:.*\.)?.*\.[a-zA-Z]*).*/;

var date = new Date();
clock.innerHTML = String(date.getHours()).padStart(2, '0') + ":" + String(date.getMinutes()).padStart(2, '0') + ":" + String(date.getSeconds()).padStart(2, '0')
day.innerHTML = months[date.getMonth()]+" "+String(date.getDate())+", "+String(date.getFullYear())

var favorites = [];
if (localStorage.getItem("favorites") == "" || localStorage.getItem("favorites") == null) {
    localStorage.setItem("favorites", JSON.stringify(favorites));
} else {
    var favorites = JSON.parse(localStorage.getItem("favorites"));
}

for (let i = 0; i < favorites.length; i++) {
    let index;
    var fav = favorites[i];
    if (i == 1) {
        index = 2
    } else if (i == 2) {
        index = 1
    } else {
        index = 0
    }
    var shorten = fav[0].substring(0,6)
    if (shorten.length == 6){
        shorten = `${shorten}...`
    }
    buttons[index].innerHTML = `<div class="favbox">${fav[0].charAt(0)}</div><p class="favtext">${shorten}</p>`
    buttons[index].style.opacity = "100%"
    buttons[index].onclick = function(){
        window.location.href = fav[2];
    };
}


const reload = function refreshCSS() {
    let links = document.getElementsByTagName('link');
    for (let i = 0; i < links.length; i++) {
        if (links[i].getAttribute('rel') == 'stylesheet') {
            let href = links[i].getAttribute('href')
                                    .split('?')[0];
            
            let newHref = href + '?version=' 
                        + new Date().getMilliseconds();
            
            links[i].setAttribute('href', newHref);
        }
    }
}


const keyHandler = function keyHandler(e) {
    if (e.key == "Enter") {
        if (input.value != "") {
            if (regex.test(input.value)) {
                if (!(input.value.startsWith("http"))) {
                    window.location.href = "https://"+input.value
                } else {
                    window.location.href = input.value
                }
            } else {
                window.location.href = "https://www.google.com/search?q="+input.value
            }
        }
    }
}

const reset = function reset() {
    input.value = ""
}

const getClock = function getClock() {
    var date = new Date();
    clock.innerHTML = String(date.getHours()).padStart(2, '0') + ":" + String(date.getMinutes()).padStart(2, '0') + ":" + String(date.getSeconds()).padStart(2, '0')
    day.innerHTML = months[date.getMonth()]+" "+String(date.getDate())+", "+String(date.getFullYear())
}



setInterval(getClock, 1000)

favorite.onclick = function(){
    document.getElementById("main").style.display = "none"
    document.getElementById("savepage").style.display = "block"

}

document.getElementById("save").onclick = function() {
    document.getElementById("error2").style.display = "none"
    document.getElementById("error1").style.display = "none"
    let temp_fav;
    var name = document.getElementById("name") 
    var url = document.getElementById("url")
    if (url.value == "" || name.value == "") {
        document.getElementById("error2").style.display = "block"
    } else if (url.checkValidity()) {
        var regMatch = url.value.match(re2)
        // name, url (just domain), url (whole url)
        temp_fav = [name.value, regMatch[1], regMatch[0]]
        favorites.push(temp_fav)
        for (let i = 0; i < favorites.length; i++) {
            let index;
            var fav = favorites[i];
            if (i == 1) {
                index = 2
            } else if (i == 2) {
                index = 1
            } else {
                index = 0
            }
            var shorten = fav[0].substring(0,6)
            if (shorten.length == 6){
                shorten = `${shorten}...`
            }
            buttons[index].innerHTML = `<div class="favbox">${fav[0].charAt(0)}</div><p class="favtext">${shorten}</p>`
            buttons[index].style.opacity = "100%"
            buttons[index].onclick = function(){
                window.location.href = fav[2];
            };
        }
        name.value = ""
        url.value = ""
        document.getElementById("savepage").style.display = "none"
        document.getElementById("main").style.display = "block"
        localStorage.setItem("favorites", JSON.stringify(favorites));
    } else {
        document.getElementById("error1").style.display = "block"
    }
}

input.addEventListener("focusout", reset)
document.addEventListener("keyup", keyHandler)
document.addEventListener("keydown", keyHandler)