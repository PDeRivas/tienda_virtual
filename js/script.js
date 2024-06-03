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
}

let removerUnidad = async (producto) => {
    let carrito = await obtenerCarrito()
    let posProducto = carrito.indexOf(carrito.find(productoPosicion => productoPosicion.id === producto.id))
    carrito[posProducto].cantidad -= 1

    if (carrito[posProducto].cantidad == 0){
        carrito.splice(posProducto, 1)
    }

    await guardarCarrito(carrito)
}

let removerDelCarrito = async (producto) =>{
    let carrito = await obtenerCarrito()
    let posProducto = carrito.indexOf(carrito.find(productoPosicion => productoPosicion.id === producto.id))
    carrito.splice(posProducto, 1)

    await guardarCarrito(carrito)
}

const renderCarrito = async (contenedor, productos, select, listadoProductos) => {
    while (listadoProductos.firstChild) {
        listadoProductos.removeChild(listadoProductos.firstChild)
    }
    listadoProductos.className = 'container'
    carrito = await obtenerCarrito()

    let total = 0

    carrito.forEach(producto => {
        let cardRow = document.createElement('div')
        cardRow.className = 'row justify-content-center'

        let card = document.createElement('div')
        card.className = 'card mb-3 w-75'

        let cardInnerRow = document.createElement('div')
        cardInnerRow.className = 'row g-0'

        let colImage = document.createElement('div')
        colImage.className = 'col-md-1'
        let image = document.createElement('img')
        image.className = 'img-fluid rounded-start imagen-chica my-2'
        image.src = producto.image
        image.alt = producto.title
        colImage.appendChild(image)
        cardInnerRow.appendChild(colImage)

        let productDetail = document.createElement('div')
        productDetail.className = 'col-md-4'

        let cardBody = document.createElement('div')
        cardBody.className = 'card-body'

        let titulo = document.createElement('h5')
        titulo.className = 'card-title'
        titulo.innerHTML = producto.title

        let cantidad = document.createElement('p')
        cantidad.innerHTML = `Cantidad: ${producto.cantidad}`
        
        let totalProducto = producto.price * producto.cantidad
        total += totalProducto
        let totalProductoTag = document.createElement('p')
        totalProductoTag.innerHTML = `Total: $${totalProducto}`

        cardBody.appendChild(titulo)
        cardBody.appendChild(cantidad)
        cardBody.appendChild(totalProductoTag)
        productDetail.appendChild(cardBody)
        cardInnerRow.appendChild(productDetail)

        let divAgregarUnidad = document.createElement('div')
        divAgregarUnidad.className = 'col-md-2 d-flex align-items-center mx-2'
        let botonAgregarUnidad = document.createElement('button')
        botonAgregarUnidad.className = 'btn btn-info'
        botonAgregarUnidad.innerHTML = 'Agregar Unidad'
        botonAgregarUnidad.addEventListener('click', async ()=>{
            await agregarAlCarrito(producto)
            renderCarrito(contenedor, productos, select, listadoProductos)
        })
        divAgregarUnidad.appendChild(botonAgregarUnidad)
        cardInnerRow.appendChild(divAgregarUnidad)

        let divRemoverUnidad = document.createElement('div')
        divRemoverUnidad.className = 'col-md-2 d-flex align-items-center mx-2'
        let botonRemoverUnidad = document.createElement('button')
        botonRemoverUnidad.className = 'btn btn-warning'
        botonRemoverUnidad.innerHTML = 'Remover Unidad'
        botonRemoverUnidad.addEventListener('click', async ()=>{
            await removerUnidad(producto)
            renderCarrito(contenedor, productos, select, listadoProductos)
        })
        divRemoverUnidad.appendChild(botonRemoverUnidad)
        cardInnerRow.appendChild(divRemoverUnidad)

        let divRemoverProducto = document.createElement('div')
        divRemoverProducto.className = 'col-md-2 d-flex align-items-center mx-2'
        let botonRemoverProducto = document.createElement('button')
        botonRemoverProducto.className = 'btn btn-danger'
        botonRemoverProducto.innerHTML = 'Remover Producto'
        botonRemoverProducto.addEventListener('click', async ()=>{
            await removerDelCarrito(producto)
            renderCarrito(contenedor, productos, select, listadoProductos)
        })
        divRemoverProducto.appendChild(botonRemoverProducto)
        cardInnerRow.appendChild(divRemoverProducto)

        card.appendChild(cardInnerRow)
        cardRow.append(card)
        listadoProductos.appendChild(cardRow)
    })

    let rowTotal = document.createElement('div')
    rowTotal.className = 'row justify-content-center mt-3 mb-3'

    let totalTag = document.createElement('p')
    totalTag.className = 'text-center'
    totalTag.innerHTML = `Total: $${total}`

    rowTotal.appendChild(totalTag)
    listadoProductos.appendChild(rowTotal)

    let rowConfirmar = document.createElement('div')
    rowConfirmar.className = 'row justify-content-center mt-3 mb-3'

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

    let rowCancelar = document.createElement('div')
    rowCancelar.className = 'row justify-content-center mb-3'

    let botonVolver = document.createElement('button')
    botonVolver.className = 'btn btn-secondary w-50'
    botonVolver.innerHTML = 'Volver'
    botonVolver.addEventListener('click', () => {
        render(contenedor, productos, select, listadoProductos)
    })
    rowCancelar.appendChild(botonVolver)
    listadoProductos.appendChild(rowCancelar)
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