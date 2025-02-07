// trae la seccion donde se ve el historial
let section = document.getElementById("orders-history")

let sectionTitleContainer = document.createElement("div")
sectionTitleContainer.classList.add("subtitle")
sectionTitleContainer.classList.add("history-title-container")

// le creamos un titulo y le asignamos sus atributos
let sectionTitle = document.createElement("h2")
sectionTitle.classList.add("title")
sectionTitle.innerText = "Historial de pedidos realizados:"

let botonBorrarHistorial = document.createElement("button")
botonBorrarHistorial.classList.add("btn-danger")
botonBorrarHistorial.textContent = "Borrar Historial"

sectionTitleContainer.appendChild(sectionTitle)
sectionTitleContainer.appendChild(botonBorrarHistorial)
section.appendChild(sectionTitleContainer)

// traemos el historial guardado en el localStorage
let historial = JSON.parse(localStorage.getItem('historialPedidos')) || []

// si el historial esta vacio, mostramos una cosa en el DOM, sino mostramos el historial
historial.length === 0 ? displayEmptyHistory() : displayHistory()

function displayHistory() {
    // iteramos y creamos un div por cada pedido guardado
    for (element of historial) {
        let div = document.createElement("div")
        div.className = "lista-pedido"

        let divHeader = document.createElement("h5")
        divHeader.innerText = `Pedido n°: ${element.numPedido}`

        div.append(divHeader)
        section.appendChild(div)

        // por cada orden en ese pedido guardado
        let total = 0
        for (orden of element.ordenes) {
            // creamos una etiqueta p para mostrar los datos
            let p = document.createElement("p")
            p.innerText = `x${orden.cantidad} ${orden.opcion} - $${orden.precio}`
            total += orden.total
            div.appendChild(p)
        }
        // mostramos el total del pedido al final
        let b = document.createElement("b")
        b.innerText = `Precio total: $${total}`
        div.appendChild(b)
    }

    botonBorrarHistorial.addEventListener("click", mensaje)
}

// funcion que crea el popup para que el usuario decida si borrar o no
function mensaje(historial) {
    swal({
        title: "¡Atención!",
        text: "¿Confirma que desea borrar su historial de pedidos? \nEsta accion es irreversible.",
        icon: "warning",
        buttons: ["Volver", "Aceptar"],
        dangerMode: true,
    })  
    // esperamos a la respuesta, si entra por "ok/true/si"
        .then((aceptar) => {
            if (aceptar) {
                localStorage.removeItem('historialPedidos', historial);
                setTimeout(() => { location.reload() }, 2500);
                swal("¡Tu historial ha sido eliminado!", {
                    icon: "success",
                });
            }
        });
}

// funcion que indica por DOM que el historial está vacio
function displayEmptyHistory() {
    let div = document.createElement("div")
    div.className = "lista-pedido"

    let divHeader = document.createElement("h5")
    divHeader.innerText = `Tu lista de pedidos esta vacía.`

    div.append(divHeader)
    section.appendChild(div)
}

