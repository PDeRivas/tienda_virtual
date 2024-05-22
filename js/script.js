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

const guardarCarrito = async (carrito) =>{
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

    productos.forEach(producto => {
        if (producto.category == select.value || select.value == 'todos') {
            let card = document.createElement('div')

            let imagen = document.createElement('img')
            imagen.src = producto.image
            imagen.alt = producto.title
            imagen.className ='card-img-top img-fluid imagen'
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
            botonAgregarCarrito.addEventListener('click', async () =>{
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

    listadoProductos.appendChild(card)
}

let agregarAlCarrito = async (producto) => {
    let carrito = await obtenerCarrito()
    let productoEnCarrito = false
    let posProducto = 0
    carrito.forEach(productoCarrito => {
        if (producto.id === productoCarrito.id){
            productoEnCarrito = true
            posProducto = carrito.indexOf(carrito.find(productoPosicion => productoPosicion.id === producto.id))
        }
    })

    if (productoEnCarrito){
        carrito[posProducto].cantidad += 1
    }

    else{
        producto.cantidad = 1
        carrito.push(producto)
    }

    await guardarCarrito(carrito)
    console.log(carrito)
}

const main = async () => {
    let productos = await fetchApi()

    let contenedor = document.getElementById('contenedor')
    let select = document.getElementById('categorias')
    let listadoProductos = document.getElementById('listadoProductos')
    listadoProductos.className = 'mx-5 row row-cols-3 d-flex justify-content-around'

    let titulo = document.getElementById('titulo')
    titulo.addEventListener('click', () =>{
        select.selectedIndex = 0
        render(contenedor, productos, select, listadoProductos)
    })

    let todosOption = document.createElement('option')
    todosOption.value = 'todos'
    todosOption.innerHTML = 'Todos'
    todosOption.addEventListener('click', () => {
        console.log(select)
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

    render(contenedor, productos, select, listadoProductos)
}

main()