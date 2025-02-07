//////////////// dark mode ////////////////

// elementos que van a cambiar con el toggler
let btnColorMode = document.querySelector("#color-mode")
let btnColorIcon = document.querySelector("#color-mode-icon")
let nav = document.querySelector(".navbar")
let formp = document.getElementById("register")

// funcion que evalua el tema al activar el boton toggler
function setColorMode() {
    let colorMode = localStorage.getItem('theme')
    colorMode == 'light' ? setDarkmode() : setLightmode()
}

// setea el local storage en "dark" y hace los cambios del modo al html 
function setDarkmode() {
    localStorage.setItem('theme', 'dark')
    document.body.classList.add("dark-mode")
    btnColorIcon.classList.replace("fa-lightbulb", "fa-moon")
    nav.classList.replace("navbar-light", "navbar-dark")
    nav.classList.replace("bg-light", "bg-dark")
    formp.classList.add("yellow-register")
}

// setea el local storage en "light" y hace los cambios del modo al html 
function setLightmode() {
    document.body.classList.remove("dark-mode")
    localStorage.setItem('theme', 'light')
    btnColorIcon.classList.replace("fa-moon", "fa-lightbulb")
    nav.classList.replace("navbar-dark", "navbar-light")
    nav.classList.replace("bg-dark", "bg-light")
    formp.classList.remove("yellow-register")
}

// dark mode toggler event listener
btnColorMode.addEventListener("click", () => {
    setColorMode()
})

// evalua si hay un tema guardado en el localstorage para que la pag recargue en el tema que estaba
let colorMode = localStorage.getItem('theme')
!colorMode ? setLightmode() : colorMode == "dark" ? setDarkmode() : "";



