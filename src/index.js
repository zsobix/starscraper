const input = document.getElementById("search")
const clock = document.getElementById("clock")
const regex = /^(http:\/\/|https:\/\/)?(www\.)?[a-zA-Z0-9-_\.]+\.[a-zA-Z]+(:\d+)?(\/[a-zA-Z\d\.\-_]*)*[a-zA-Z.!@#$%&=-_'":,.?\d*)(]*$/
const seconds = document.getElementById("seconds")
const day = document.getElementById("date")
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const favorite = document.getElementById("addfavorite")
const buttons = document.getElementsByClassName("favorite")
const re2 = /(^https?:\/\/(?:.*\.)?.*\.[a-zA-Z]*).*/;
const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
const trashcans = document.getElementsByClassName("trash")
let latitude;
let longitude;


var date = new Date();
clock.innerHTML = String(date.getHours()).padStart(2, '0') + ":" + String(date.getMinutes()).padStart(2, '0') + ":" + String(date.getSeconds()).padStart(2, '0')
day.innerHTML = months[date.getMonth()]+" "+String(date.getDate())+", "+String(date.getFullYear())

var favorites = [];
if (localStorage.getItem("favorites") == "" || localStorage.getItem("favorites") == null) {
    localStorage.setItem("favorites", JSON.stringify(favorites));
} else {
    var favorites = JSON.parse(localStorage.getItem("favorites"));
}

if (localStorage.getItem("username") != null) {
    var username = localStorage.getItem("username");
    console.log(username)
    console.log(username != null)
    fetch(`https://stardance.jam06452.uk/api/v2/users/${username}/projects?limit=100`)
        .then(response => {
            if (response.ok) {
                response.json().then((jsonResponse) => {
                    console.log(jsonResponse)
                    var obj = jsonResponse;
                    var maxhours = 0;
                    var maxdevlogs = 0;
                    var maxfollowers = 0;
                    for (let i = 0; i < obj.projects.length; i++) {
                        var hours = parseInt(obj.projects[i].total_hours)
                        maxhours = hours+maxhours
                        var devlogs = parseInt(obj.projects[i].devlog_count)
                        maxdevlogs = devlogs+maxdevlogs
                        var followers = parseInt(obj.projects[i].followers)
                        maxfollowers = followers+maxfollowers
                    }
                    document.getElementById("stardance").innerHTML = `<i class="fa-solid fa-star"></i> Stardance Stats:<br>
                    <i class="fa-solid fa-book"></i> Total devlogs: ${maxdevlogs}<br>
                    <i class="fa-solid fa-user-plus"></i> Total followers (across all projects): ${maxfollowers}<br>
                    <i class="fa-regular fa-clock"></i> Total hours: ${maxhours} h`
                    document.getElementById("error01").style.display = "none"
                    document.getElementById("error02").style.display = "none"
                    localStorage.setItem("username", username)
            })
            } else {
                document.getElementById("error01").style.display = "block"
            }
        })
}

for (let i = 0; i < favorites.length; i++) {
    let index;
    var fav = favorites[i];
    let del_index;
    del_index = i 
    if (i == 2) {
        index = 3
    } else if (i == 3) {
        index = 4
    } else if (i == 4) {
        index = 2
        del_index = 2
    } else {
        index = i
    }
    var shorten = fav[0].substring(0,7)
    if (fav[0].length > shorten.length){
        shorten = `${shorten}...`
    }
    var img = `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${fav[1]}&size=48`
    buttons[index].innerHTML = `<a href="${fav[2]}"><div class="favbox"><img src="${img}"></div></a><p class="favtext">${shorten}</p><div class="trash"><i class="fa-solid fa-trash"></i></div>`
    buttons[index].style.opacity = "100%"
    trashcans[del_index].onclick = function() {
        favorites.splice(i, 1)
        localStorage.setItem("favorites", JSON.stringify(favorites));
        window.location.reload()
    }
}
const getDirection = function getDirection(angle) {
    // Source - https://stackoverflow.com/a/48750814
    // Posted by VisioN, modified by community. See post 'Timeline' for change history
    // Retrieved 2026-07-19, License - CC BY-SA 4.0 

    var index = Math.round(((angle %= 360) < 0 ? angle + 360 : angle) / 45) % 8;
    return directions[index]
}
function success(pos) {
    const crd = pos.coords;

    console.log(`Latitude: ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${crd.latitude}&longitude=${crd.longitude}&daily=temperature_2m_max,temperature_2m_min&current=temperature_2m,is_day,apparent_temperature,precipitation,wind_speed_10m,wind_direction_10m&forecast_days=1`)
        .then(response => {response.json().then((jsonResponse) => {
            console.log(jsonResponse)
            var obj = jsonResponse;
            document.getElementById("weather").innerHTML = `<i class="fa-solid fa-cloud-sun"></i> ${obj.current.temperature_2m}°C (feels like ${obj.current.apparent_temperature}°C), <br>
            max ${obj.daily.temperature_2m_max[0]}°C, min ${obj.daily.temperature_2m_min[0]}°C<br>
            <i class="fa-solid fa-wind"></i> ${obj.current.wind_speed_10m} km/h from ${getDirection(obj.current.wind_direction_10m)}<br>
            <i class="fa-solid fa-cloud-rain"></i> ${obj.current.precipitation} mm (approximately)`
        })})
}

function error(err) {
    document.getElementById("weather").innerHTML = `<i class="fa-solid fa-cloud-sun"></i> ERROR:<br> Location usage denied,<br> or other error... <br>`
}

window.navigator.geolocation.getCurrentPosition(success, error, {enableHighAccuracy: false, timeout: 5000, maximumAge: Infinity})



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
    if (url.value == "") {
        document.getElementById("error2").style.display = "block"
    } else if (url.checkValidity()) {
        var regMatch = url.value.match(re2)
        // name, url (just domain), url (whole url)
        if (name.value == "") {
            name.value = regMatch[1].replace(/^https?:\/\//, "")
        }
        temp_fav = [name.value, regMatch[1], regMatch[0]]
        favorites.push(temp_fav)
        for (let i = 0; i < favorites.length; i++) {
            let index;
            var fav = favorites[i];
            let del_index;
            del_index = i 
            if (i == 2) {
                index = 3
            } else if (i == 3) {
                index = 4
            } else if (i == 4) {
                index = 2
                del_index = 2
            } else {
                index = i
            }

            var shorten = fav[0].substring(0,7)
            if (fav[0].length > shorten.length){
                shorten = `${shorten}...`
            }
            var img = `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${fav[1]}&size=48`
            buttons[index].innerHTML = `<a href="${fav[2]}"><div class="favbox"><img src="${img}"></div></a><p class="favtext">${shorten}</p><div class="trash"><i class="fa-solid fa-trash"></i></div>`
            buttons[index].style.opacity = "100%"
            trashcans[del_index].onclick = function() {
                favorites.splice(i, 1)
                localStorage.setItem("favorites", JSON.stringify(favorites));
                window.location.reload()
            }
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

document.getElementById("starsave").onclick = function(){
    var username = document.getElementById("starinput").value;
    if (username == "") {
        document.getElementById("error02").style.display = "block"
    } else {
        fetch(`https://stardance.jam06452.uk/api/v2/users/${username}/projects?limit=100`)
            .then(response => {
                if (response.ok) {
                    response.json().then((jsonResponse) => {
                        console.log(jsonResponse)
                        var obj = jsonResponse;
                        var maxhours = 0;
                        var maxdevlogs = 0;
                        var maxfollowers = 0;
                        for (let i = 0; i < obj.projects.length; i++) {
                            var hours = parseInt(obj.projects[i].total_hours)
                            maxhours = hours+maxhours

                            var devlogs = parseInt(obj.projects[i].devlog_count)
                            maxdevlogs = devlogs+maxdevlogs

                            var followers = parseInt(obj.projects[i].followers)
                            maxfollowers = followers+maxfollowers
                        }
                        document.getElementById("stardance").innerHTML = `<i class="fa-solid fa-star"></i> Stardance Stats:<br>
                        <i class="fa-solid fa-book"></i> Total devlogs: ${maxdevlogs}<br>
                        <i class="fa-solid fa-user-plus"></i> Total followers (across all projects): ${maxfollowers}<br>
                        <i class="fa-regular fa-clock"></i> Total hours: ${maxhours} h`
                        document.getElementById("error01").style.display = "none"
                        document.getElementById("error02").style.display = "none"
                })
                localStorage.setItem("username", username)
                document.getElementById("starinput").value = ""
                } else {
                    document.getElementById("error01").style.display = "block"
                }
            })
    }
}

input.addEventListener("focusout", reset)
document.addEventListener("keyup", keyHandler)
document.addEventListener("keydown", keyHandler)