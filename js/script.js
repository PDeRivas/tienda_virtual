const fetchApi = async () => {
    try {
        let respuesta = await fetch('https://fakestoreapi.com/products')
        let json = await respuesta.json()

        return json
    } catch (error) {
        console.error('Error:', error)
    }
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

let render = (contenedor, productos, select, listadoProductos) => {
    while (listadoProductos.firstChild) {
        listadoProductos.removeChild(listadoProductos.firstChild)
    }

    productos.forEach(producto => {
        if (producto.category == select.value || select.value == 'todos') {
            let card = document.createElement('a')
            card.innerHTML = `
            <img src='${producto.image}' alt='${producto.title}' class='card-img-top img-fluid imagen'>
            <div class='card-body'>
                <h5 class='card-title'>Producto: ${producto.title}</h5>
                <p class='card-title'>Categoria: ${producto.category}</p>
                <p>Precio: $${producto.price}</p>
            </div>
            `
            card.href = "#"
            card.className = 'col card mx-0 my-2 shadow'
            card.addEventListener('click', () => {
            })

            listadoProductos.appendChild(card)
        }
    })
    contenedor.appendChild(listadoProductos)
}

const main = async () => {
    let productos = await fetchApi()

    let contenedor = document.getElementById('contenedor')
    let select = document.getElementById('categorias')
    let listadoProductos = document.getElementById('listadoProductos')
    listadoProductos.className = 'mx-5 row row-cols-3 d-flex justify-content-around'

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

    render(contenedor, productos, select, listadoProductos)
}

main()