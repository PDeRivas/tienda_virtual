const fetchApi = async () => {
    try {
        let respuesta = await fetch('https://fakestoreapi.com/products')
        let json = await respuesta.json()

        return json
    } catch (error) {
        console.error('Error:', error)
    }
}

const obtenerCarrito = async () => {
    const carritoString = localStorage.getItem('carrito');
    return carritoString ? JSON.parse(carritoString) : [];
};

const guardarCarrito = async (carrito) => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

let sacarCategorias = async (productos) => {
    let listaCategorias = []
    productos.forEach(producto => {
        if (!listaCategorias.includes(producto.category)) {
            listaCategorias.push(producto.category)
        }
    })
    return listaCategorias
}

let render = async (contenedor, productos, select, listadoProductos) => {
    while (listadoProductos.firstChild) {
        listadoProductos.removeChild(listadoProductos.firstChild)
    }

    listadoProductos.className = 'mx-5 row row-cols-3 d-flex justify-content-around'

    productos.forEach(producto => {
        if (producto.category == select.value || select.value == 'todos') {
            let card = document.createElement('div')

            let imagen = document.createElement('img')
            imagen.src = producto.image
            imagen.alt = producto.title
            imagen.className = 'card-img-top img-fluid imagen'
            imagen.addEventListener('click', () => {
                console.log('a')
                renderProduct(contenedor, producto, listadoProductos)
            })
            card.appendChild(imagen)

            let cardBody = document.createElement('div')
            cardBody.className = 'card-body'
            cardBody.innerHTML = ` 
            <h5 class='card-title'>${producto.title}</h5>
            <p class='card-title'>${producto.category}</p>
            <p>Precio: $${producto.price}</p>
            `
            let botonAgregarCarrito = document.createElement('button')
            botonAgregarCarrito.innerHTML = 'Agregar al Carrito'
            botonAgregarCarrito.className = 'btn btn-success'
            botonAgregarCarrito.addEventListener('click', async () => {
                agregarAlCarrito(producto)
            })
            cardBody.appendChild(botonAgregarCarrito)

            card.appendChild(cardBody)

            card.className = 'col card mx-0 my-2 shadow'

            listadoProductos.appendChild(card)
        }
    })
    contenedor.appendChild(listadoProductos)
}

let renderProduct = (contenedor, producto, listadoProductos) => {
    while (listadoProductos.firstChild) {
        listadoProductos.removeChild(listadoProductos.firstChild)
    }

    let card = document.createElement('div')
    card.innerHTML = `
    <img src='${producto.image}' alt='${producto.title}' class='card-img-top img-fluid imagen'>
    <div class='card-body'>
        <h5 class='card-title'>${producto.title}</h5>
        <p>${producto.description}</p>
        <p>Precio: $${producto.price}</p>
    </div>
    `

    let botonAgregarCarrito = document.createElement('button')
    botonAgregarCarrito.innerHTML = 'Agregar al Carrito'
    botonAgregarCarrito.className = 'btn btn-success'
    botonAgregarCarrito.addEventListener('click', async () => {
        agregarAlCarrito(producto)
    })
    card.appendChild(botonAgregarCarrito)
    listadoProductos.appendChild(card)
}

let agregarAlCarrito = async (producto) => {
    let carrito = await obtenerCarrito()
    let productoEnCarrito = false
    let posProducto = 0
    carrito.forEach(productoCarrito => {
        if (producto.id === productoCarrito.id) {
            productoEnCarrito = true
            posProducto = carrito.indexOf(carrito.find(productoPosicion => productoPosicion.id === producto.id))
        }
    })

    if (productoEnCarrito) {
        carrito[posProducto].cantidad += 1
    }

    else {
        producto.cantidad = 1
        carrito.push(producto)
    }

    await guardarCarrito(carrito)
    console.log(carrito)
}

const renderCarrito = async (contenedor, productos, select, listadoProductos) => {
    while (listadoProductos.firstChild) {
        listadoProductos.removeChild(listadoProductos.firstChild)
    }
    listadoProductos.className = 'container'
    carrito = await obtenerCarrito()

    carrito.forEach(producto => {
        card = document.createElement('div')
        card.className = 'row justify-content-center'
        card.innerHTML = `
        <div class='card mb-3 w-75'>
            <div class="row g-0">
                <div class="col-md-1">
                    <img src="${producto.image}" class="img-fluid rounded-start imagen-chica my-2" alt="...">
                </div>
                <div class="col-md-7">
                    <div class="card-body">
                        <h5 class="card-title">${producto.title}</h5>
                        <p>Cantidad: ${producto.cantidad}</p>
                    </div>
                </div>
                <div class="col-md-1 d-flex align-items-center mx-2" onClick='agregarAlCarrito(${producto})'>
                    <button class="btn btn-info">
                    Agregar Unidad
                    </button>
                </div>
                <div class="col-md-1 d-flex align-items-center mx-2">
                    <button class="btn btn-warning">
                    Remover Unidad
                    </button>
                </div>
                <div class="col-md-1 d-flex align-items-center mx-2">
                    <button class="btn btn-danger">
                    Quitar Producto
                    </button>
                </div>
            </div>
        </div>`
        listadoProductos.appendChild(card)
    })
    let rowConfirmar = document.createElement('div')
    rowConfirmar.className = 'row justify-content-center'

    let botonConfirmar = document.createElement('button')
    botonConfirmar.className = 'btn btn-success w-50'
    botonConfirmar.innerHTML = 'Finalizar Compra'
    botonConfirmar.addEventListener('click', () => {
        carrito = []
        guardarCarrito(carrito)
        render(contenedor, productos, select, listadoProductos)
    })
    rowConfirmar.appendChild(botonConfirmar)
    listadoProductos.appendChild(rowConfirmar)
}

const main = async () => {
    let productos = await fetchApi()

    let contenedor = document.getElementById('contenedor')
    let select = document.getElementById('categorias')
    let todosOption = document.createElement('option')
    todosOption.value = 'todos'
    todosOption.innerHTML = 'Todos'
    todosOption.addEventListener('click', () => {
        render(contenedor, productos, select, listadoProductos)
    })
    select.appendChild(todosOption)

    let listaCategorias = await sacarCategorias(productos)
    listaCategorias.forEach(categoria => {

        let categoriaOption = document.createElement('option')
        categoriaOption.innerHTML = categoria
        categoriaOption.addEventListener('click', () => {
            console.log(select.value)
            render(contenedor, productos, select, listadoProductos)
        })
        select.appendChild(categoriaOption)
    })

    let botonVerCarrito = document.getElementById('ver-carrito')
    botonVerCarrito.addEventListener('click', () => {
        renderCarrito(contenedor, productos, select, listadoProductos)
    })
    let listadoProductos = document.getElementById('listadoProductos')

    let titulo = document.getElementById('titulo')
    titulo.addEventListener('click', () => {
        select.selectedIndex = 0
        render(contenedor, productos, select, listadoProductos)
    })

    render(contenedor, productos, select, listadoProductos)
}

main()