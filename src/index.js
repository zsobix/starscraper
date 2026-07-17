const input = document.getElementById("search")
const button = document.getElementById("searchbutton")
const textbox = document.getElementById("textbox")
const cursor = document.getElementById("cursor")

const keyHandler = function keyHandler(e) {
    if (e.key == "Enter") {
        if (input.value != "") {
            window.location.href = "http://www.google.com/search?q="+input.value
        }
    } else if (document.activeElement == input) {
        if (input.value == "") {
            textbox.innerHTML = "Search or enter address"
        } else {
            textbox.innerHTML = input.value
        }
    }
}

const cursorInit = function cursorInit() {
    textbox.innerHTML = ""
    cursor.innerHTML = "|"
}

const reset = function reset() {
    textbox.innerHTML = "Search or enter address"
    input.value = ""
    cursor.innerHTML = ""
}


input.addEventListener("focusin", cursorInit)
input.addEventListener("focusout", reset)
document.addEventListener("keyup", keyHandler)
document.addEventListener("keydown", keyHandler)