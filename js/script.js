const fetchApi = async () => {
    try{
        let respuesta = await fetch('https://fakestoreapi.com/products')
        let json = await respuesta.json()
        return json
    } catch(error){
        console.error('Error:', error)
}
}

const main = async () => {
    let contenedor = document.getElementById('contenedor')
    let productos = await fetchApi()
    console.log(productos)

    let cantidadProductos = 0
    let row = document.createElement('div')
    row.className = 'row'
    productos.forEach(producto => {
        cantidadProductos +=1
        if (cantidadProductos > 3){
            cantidadProductos = 1
            row = document.createElement('div')
            row.className = 'row'
            contenedor.appendChild(row)
        }
        
        let card = document.createElement('div')
        card.className = 'card'

        let imagen = document.createElement('img')
        imagen.src = producto.image
        imagen.className = 'card-img-top img-fluid'
        card.appendChild(imagen)

        let cardBody = document.createElement('div')
        cardBody.className = 'card-body'

        let nombre = document.createElement('h5')
        nombre.innerHTML = `Producto: ${producto.title}`
        nombre.className = 'card-title'
        cardBody.appendChild(nombre)

        let categoria = document.createElement('p')
        categoria.innerHTML = `Categoria: ${producto.category}`
        cardBody.appendChild(categoria)

        let descripcion = document.createElement('p')
        descripcion.innerHTML = `Descripcion: ${producto.description}`
        cardBody.appendChild(descripcion)

        let precio = document.createElement('p')
        precio.innerHTML = `Precio: ${producto.price}`
        card.appendChild(cardBody)

        row.appendChild(card)
    });
}

main()