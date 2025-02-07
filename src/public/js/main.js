
// recibe el objeto de la seccion correspondiente donde se mostrara el mensaje de "NOT FOUND"
function opcionMenuNoDisponible(objeto) {
    let menuOptionsContainer = document.getElementById(`menu-${objeto.category}`)
    menuOptionsContainer.innerHTML = `
        <div class="menu-card">
            <div class="menu-card-info">
                <h3>¡Oops!</h3>
                <p>no disponemos de esa opción en este momento.</p>
            </div>
        </div>
    `
}

// asigna eventos a los botones de "agregar"
function botonAgregarEventListeners() {
    // traemos todos los botones de "agregar"
    let botonesAdd = document.querySelectorAll(".add-to-cart")

    // por cada boton del array
    botonesAdd.forEach(boton => {
        // cuando el usuario clickee, se añade la opcion a la orden
        boton.removeEventListener("click", eventoAgregarAlCarrito),
            boton.addEventListener("click", eventoAgregarAlCarrito)
    })
}

function eventoAgregarAlCarrito(event) {
    // recupera el id de la opcion a donde se dispare el evento
    const optionMenuID = event.target.getAttribute("data-id")
    // lo agregamos al carrito
    addToCart(optionMenuID)
    // agregamos efecto usando la libreria Toastify
    Toastify({
        text: "¡Orden agregada!",
        duration: 1500,
        className: "info",
        gravity: "bottom",
        stopOnFocus: false,
        offset: {
            x: 0,
            y: 5,
        },
        style: {
            'font-size': '12px',
            'font-weight': 600,
            padding: '8px 15px',
            color: "black",
            background: "linear-gradient(to right,  hsl(44deg 100% 56%) 0%, hsl(46deg 100% 71%) 40%,hsl(53deg 100% 83%) 100%)",
            border: '0.5px solid black',
            'border-radius': '0.8rem',
            opacity: 0.9,
            transition: 'all 0.4s cubic-bezier(0.215, 0.61, 0.355, 1)',
            cursor: 'default'
        }
    }).showToast();
}

function addToCart(menuID) {
    // creamos un carrito que contendra lo guardado en localStorage o si no, un array vacio
    let carrito = JSON.parse(localStorage.getItem('carrito')) || []

    // usamos HOF .find para traer el objeto de nuestro array que coincida con el id que tenemos
    let optionMenu = menu.find(option => option.id === menuID)

    // y buscamos si ese elemento tambien ya esta en nuestro carrito
    let ordenesEnCarrito = carrito.find(orden => orden.id === menuID)

    // si ya existe
    if (ordenesEnCarrito) {
        // le sumamos 1 a la cantidad y calculamos el precio total
        ordenesEnCarrito.quantity += 1
        ordenesEnCarrito.totalPrice = ordenesEnCarrito.quantity * ordenesEnCarrito.price
    } else {
        // sino pusheamos el objeto optionMenu que trajimos antes al carrito (le agregamos prop cantidad, y $ total)
        carrito.push({
            ...optionMenu,
            quantity: 1,
            totalPrice: optionMenu.price
        })
    }
    // guardamos en el localstorage el objeto carrito con los cambios
    localStorage.setItem('carrito', JSON.stringify(carrito));
    // mostramos el carrito
    mostrarCarrito();
}

function mostrarCarrito() {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || []

    // traemos el contenedor donde iran las ordenes
    let pedidosSeccion = document.querySelector("#contenedor-pedidos")
    // inicializamos el contenido del contenedor vacio
    pedidoHTML = ""
    // cada pedido agragado al carrito
    for (let pedido of carrito) {

        // le damos la estructura html
        pedidoHTML += `
    <div class="lista-pedido" id=${pedido.id}>
        <div class="item-pedido" id=${pedido.id}>
            <p>${pedido.name}</p>
            <p>(${pedido.quantity})</p>
            <p>$${pedido.price}</p>
            <div class="price-button">
                <b>$${pedido.totalPrice.toFixed(2)}</b>
                <button class="eliminar-orden" data-id=${pedido.id}>
                <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        </div>
    </div>

    `
    }

    // agregamos la estructura creada a la seccion contenedora
    pedidosSeccion.innerHTML = pedidoHTML

    // agregar funcionalidad para eliminar del carrito
    document.querySelectorAll('.eliminar-orden').forEach(boton => {
        boton.addEventListener('click', () => {
            let menuID = boton.getAttribute('data-id')
            eliminarDelCarrito(menuID) //llamamos a la fx elimiar declarada abajo
            Toastify({
                text: "¡Orden Eliminada!",
                duration: 1500,
                className: "info",
                gravity: "bottom",
                stopOnFocus: false,
                offset: {
                    x: 0,
                    y: 5,
                },
                style: {
                    'font-size': '12px',
                    'font-weight': 600,
                    padding: '8px 15px',
                    color: "white",
                    background: "linear-gradient(to top, hsl(0deg 79% 36%) 10%, hsl(22deg 81% 37%) 63%, hsl(36deg 85% 37%) 99%",
                    border: '0.5px solid black',
                    'border-radius': '0.8rem',
                    opacity: 0.9,
                    transition: 'all 0.4s cubic-bezier(0.215, 0.61, 0.355, 1)',
                    cursor: 'default'
                }
            }).showToast();
        });
    });

    // HOF .reduce para sumar los totales de cada pedido
    let totalCarrito = carrito.reduce((acc, pedido) => acc + pedido.totalPrice, 0);
    // traemos la seccion donde se muestra el carrito
    let seccionCarrito = document.querySelector("#seccion-carrito")
    // traemos el contenedor donde mostraremos el total
    let carritoTotalPrice = document.querySelector(".contenedor-importe-total")

    // si el carrito tiene ordenes, mostramos el total del pedido.
    if (totalCarrito > 0) {
        seccionCarrito.classList.remove("hidden-box") //removemos la clase para que se vea la seccion en pantalla
        cartButtonPopper()
        carritoTotalPrice.innerHTML = `
        <p>El total de su pedido es de: <b>$${totalCarrito.toFixed(2)}</b></p>
        <a><button>Realizar pedido </button></a>`
        let linkBoton = carritoTotalPrice.lastElementChild
        // linkBoton.setAttribute("href", "#")
        linkBoton.firstChild.id = "btn-realizar-pedido"
        linkBoton.firstChild.className = "btn btn-outline-warning btn-sm m-2"
        let icon = document.createElement("i")
        icon.className = "fa-brands fa-whatsapp"
        linkBoton.firstChild.appendChild(icon)
        linkBoton.firstChild.addEventListener("click", addOrderToHistory)
        linkBoton.firstChild.addEventListener("click", showAlert)


    } else {
        // sino esta vacio, entonces escondemos la seccion
        seccionCarrito.classList.add("hidden-box")
    }

}

function eliminarDelCarrito(menuID) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let carritoEditado
    let menuOptionToDelete = carrito.find(orden => orden.id === menuID)

    // si del objeto a eliminar, la cantidad es mayor a uno, restamos 1 del carrito y actualizamos el precioTotal de la orden
    if (menuOptionToDelete.quantity > 1) {
        menuOptionToDelete.quantity -= 1
        menuOptionToDelete.totalPrice = menuOptionToDelete.quantity * menuOptionToDelete.price
        carritoEditado = carrito
    } else {
        // sino HOF .filter() para mantener los elementos que NO coincidan con el ID que le pasamos
        carritoEditado = carrito.filter(orden => orden.id !== menuID)
    }

    localStorage.setItem('carrito', JSON.stringify(carritoEditado))
    mostrarCarrito()
}

// funcion que crea el boton para ir al carrito en el div del html correspondiente
function cartButtonPopper() {
    let containerCarrito = document.querySelector("#cart-button")
    containerCarrito.classList.add("cart-button-container")

    let carritoButton = document.createElement("button")
    carritoButton.innerHTML = '<i class="fa-solid fa-cart-shopping"> </i>'

    carritoButton.addEventListener("click", () => {
        let carritoSection = document.querySelector("#seccion-carrito")
        carritoSection.scrollIntoView()
    })

    containerCarrito.replaceChildren(carritoButton)
}

// funcion que evalua si existe "historial" en el localStorage para habilitar la pestaña de "mis pedidos"
function evaluarHistorial() {
    let historial = JSON.parse(localStorage.getItem('historialPedidos')) || []
    let pestaniaHistorial = document.getElementById("historial-pedidos")

    if (historial.length > 0) {
        pestaniaHistorial.classList.remove("disabled")
    }
}

// funcion que guarda las ordenes realizadas en el historial de pedidos del localstorage
function addOrderToHistory() {
    let carrito = JSON.parse(localStorage.getItem('carrito'))

    let historial = JSON.parse(localStorage.getItem('historialPedidos')) || []
    let count = historial.length

    //creamos un array
    let pedidoAgregado = []
    // por cada orden del pedido
    for (orden of carrito) {
        const { category, descritpion, id, img, name, price, quantity, totalPrice } = orden
        // guardamos nombre, precio, cantidad y total
        let pedido = {
            opcion: name,
            precio: price,
            cantidad: quantity,
            total: totalPrice
        }
        // y se lo pusheamos al array
        pedidoAgregado.push(pedido)
    }
    // para luego guardarlo en el historial
    historial.push({
        numPedido: ++count,
        ordenes: pedidoAgregado
    })

    // almacenamos el objeto en el localstorage
    localStorage.setItem('historialPedidos', JSON.stringify(historial));
    // habilitamos la pestaña para ver el historial
    evaluarHistorial()
}

function showAlert() {
    setTimeout(() => {swal("Pedido recibido. Recibirá un mensaje de wpp a la brevedad.")}, 2000)
    swal("Su pedido esta siendo procesado...")
    
}


// botonAgregarEventListeners()