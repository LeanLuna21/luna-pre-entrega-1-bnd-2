import mongoose from "mongoose"
import itemModel from "../models/productsModel.js"

const populateDB=async(url, db)=>{
    try {
        await mongoose.connect(
            url,
            {dbName:db}
        )     
        let productos = [
            {
                "code": "ffprod-202402",
                "title": "Hamburguesa Completa",
                "price": 8700,
                "stock": 50,
                "img": "https://cache-backend-mcd.mcdonaldscupones.com/media/image/product$kqXXaUUP/200/200/original?country=ar",
                "description": "Una jugosa hamburguesa de res con queso derretido, lechuga, tomate y pepinillos en un pan tostado.",
                "type": "comidas",
                "category": "sanguche"
            },
            {
                "code": "ffprod-202403",
                "title": "Nuggets de Pollo ",
                "price": 5700,
                "stock": 50,
                "img": "https://cache-backend-mcd.mcdonaldscupones.com/media/image/product$kcX2hh1W/200/200/original?country=ar",
                "description": "Doce crujientes nuggets de pollo dorados, servidos con la salsa de tu elección.",
                "type":"comidas",
                "category": "picada"
            },
            {
                "code": "ffprod-202404",
                "title": "Hamburguesa Vegana",
                "price": 9000,
                "stock": 50,
                "img": "https://s3-eu-central-1.amazonaws.com/www.burgerking.com.ar.v2/wp-media-folder-burger-king-argentina//home/ubuntu/preview/menu-app/frontend/apps/marketing-website-wordpress-app/web/app/uploads/sites/5/WhopperVegetal_2604.png",
                "description": "Una deliciosa hamburguesa de lentejas con vegetales frescos y una salsa picante.",
                "type":"comidas",
                "category": "sanguche"
            },
            {
                "code": "ffprod-202405",
                "title": "Ensalada Cesar",
                "price": 6200,
                "stock": 50,
                "img": "https://cache-backend-mcd.mcdonaldscupones.com/media/image/product$kEXXe08B/200/200/original?country=ar",
                "description": "Lechuga romana fresca, crutones, queso parmesano y aderezo César.",
                "type": "comidas",
                "category": "ensalada"
            },
            {
                "code": "ffprod-202407",
                "title": "Sandwich de Pollo",
                "price": 7800,
                "stock": 50,
                "img": "https://cache-backend-mcd.mcdonaldscupones.com/media/image/product$ktXfGUzp/200/200/original?country=ar",
                "description": "Pechuga de pollo a la parrilla con lechuga, tomate y mayonesa en un pan tostado.",
                "type": "comidas",
                "category": "sanguche"
            },
            {
                "code": "ffprod-202413",
                "title": "Hamburguesa BBQ con Tocino",
                "price": 9200,
                "stock": 50,
                "img": "https://cache-backend-mcd.mcdonaldscupones.com/media/image/product$kQX3BMhy/200/200/original?country=ar",
                "description": "Una hamburguesa de res con salsa BBQ, tocino, queso y aros de cebolla en un pan tostado.",
                "type":"comidas",
                "category": "sanguche"
            },
            {
                "code": "ffprod-202408",
                "title": "Wrap de Pollo Cesar",
                "price": 7500,
                "stock": 50,
                "img": "https://cache-backend-mcd.mcdonaldscupones.com/media/image/product$ktX156kS/200/200/original?country=pr",
                "description": "Pollo a la parrilla, lechuga romana, queso parmesano y aderezo César envueltos en una tortilla.",
                "type":"comidas",
                "category": "wrap"
            },
            {
                "code": "ffprod-202406",
                "title": "Sándwich de Pollo Picante",
                "price": 8400,
                "stock": 50,
                "img": "https://cache-backend-mcd.mcdonaldscupones.com/media/image/product$krXaagSr/200/200/original?country=ar",
                "description": "Un filete de pollo picante a la plancha con salsa BBQ en pan de campo.",
                "type":"comidas",
                "category": "sanguche"
            },
            {
                "code": "ffprod-202409",
                "title": "Burrito Veggie",
                "price": 3400,
                "stock": 50,
                "img": "https://tacotimenw.com/wp-content/uploads/2018/10/Classic-Burrito-VEGGIE.png",
                "description": "Un rico y tradicional burrito relleno de verdura, pasta de garbanzos y huevo.",
                "type":"comidas",
                "category": "wrap"
            },
            {
                "code": "ffprod-12301",
                "title": "Coca-Cola",
                "price": 2700,
                "stock": 50,
                "img": "https://ams3.digitaloceanspaces.com/graffica/2023/02/la-ola-de-cocacola.png",
                "description": "Una bebida de cola clásica y refrescante.",
                "type":"bebidas",
                "category": "gaseosa"
            },
            {
                "code": "ffprod-12302",
                "title": "Pepsi",
                "price": 2700,
                "stock": 50,
                "img": "https://fullstop360.com/blog/wp-content/uploads/2020/09/Chapter-five-reversing-colors.jpg",
                "description": "Una popular soda con sabor a cola.",
                "type": "bebidas",
                "category": "gaseosa"
            },
            {
                "code": "ffprod-12303",
                "title": "Sprite",
                "price": 2700,
                "stock": 50,
                "img": "https://brandemia.org/contenido/subidas/2022/05/nueva-identidad-visual-de-sprite-2022.png",
                "description": "Una soda crujiente y refrescante con sabor a limón-lima.",
                "type": "bebidas",
                "category": "gaseosa"
            },
            {
                "code": "ffprod-12304",
                "title": "Fanta Naranja",
                "price": 2700,
                "stock": 50,
                "img": "https://static.vecteezy.com/system/resources/previews/007/978/621/non_2x/fanta-popular-drink-brand-logo-vinnytsia-ukraine-may-16-202-free-vector.jpg",
                "description": "Una soda afrutada y burbujeante con sabor a naranja.",
                "type": "bebidas",
                "category": "jugo"
            },
            {
                "code": "ffprod-12305",
                "title": "Jugo de Naranja",
                "price": 2500,
                "stock": 50,
                "img": "https://img.europapress.es/fotoweb/fotonoticia_20171106083335_1200.jpg",
                "description": "Un jugo de naranja exprimido, fresco y ácido.",
                "type": "bebidas",
                "category": "jugo"
            },
            {
                "code": "ffprod-12306",
                "title": "Limonada",
                "price": 3000,
                "stock": 50,
                "img": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7vTVWFDF7yg8r4ouOdEnwYGQSZHj9qVJYrA&s",
                "description": "Una limonada clásica hecha con limones frescos.",
                "type": "bebidas",
                "category": "jugo"
            },
            {
                "code": "ffprod-12307",
                "title": "Dr Pepper",
                "price": 2700,
                "stock": 50,
                "img": "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQ8IBL20hmuQ0XaKwfmfkbim5gaUg_2b7p4NODMaWqdGOziHbsv",
                "description": "Una mezcla única de 23 sabores en una soda refrescante.",
                "type": "bebidas",
                "category": "gaseosa"
            },
            {
                "code": "ffprod-12308",
                "title": "Agua",
                "price": 2200,
                "stock": 50,
                "img": "https://i.pinimg.com/originals/88/df/c0/88dfc0553c52065716ad616804d83bae.jpg",
                "description": "Una botella de agua refrescante para saciar tu sed.",
                "type": "bebidas",
                "category": "agua"
            },
            {
                "code": "ffprod-12309",
                "title": "Paso de los toros",
                "price": 2800,
                "stock": 50,
                "img": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZvD_AxAwzKlLY5hDMc6k3OHGfNi6P1y185Xwb43liJirTIFsi9ROCzVtxAWG910mBByw&usqp=CAU",
                "description": "La tradicional bebida que quita la sed.",
                "type": "bebidas",
                "category": "gaseosa"
            }
        ]

        productos = productos.map((producto, id) => producto = { id: id += 1, ...producto } )
        await itemModel.deleteMany()
        await itemModel.insertMany(productos)
        console.log(`DB POPULATED...!!!`)
        process.exit()
    } catch (error) {
        console.log(`Error: ${error.message}`)
    }
}

export default populateDB