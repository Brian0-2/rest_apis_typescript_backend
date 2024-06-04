import request from 'supertest';
import server from '../../server';

describe('POST /api/products', () => {
    it('should display validation errors', async () =>{
        //Simular que en la peticion al servidor sea vacia
        const response = await request (server).post('/api/products'). send({})

        // Validar que me mando bad request o 400 de validacion
        expect(response.status).toEqual(400)
        //contenga el dato errors
        expect(response.body).toHaveProperty('errors')
        //el numero de errores sea igual a 4
        expect(response.body.errors).toHaveLength(4)

        //Validar que la respuesta no sea un 404 o no encontrado
        expect(response.status).not.toEqual(404)
        //Validar que la respuesta de errores no sea de 2 porque es de 4 
        expect(response.body.errors).not.toHaveLength(2)
    })


    it('should validate that the price is greater than 0', async () =>{
        //Simular que en la peticion al servidor sea vacia
        const response = await request (server).post('/api/products'). send({
            name : 'Monitor curvo',
            price: 0
        })

        // Validar que me mando bad request o 400 de validacion
        expect(response.status).toEqual(400)
        //contenga el dato errors
        expect(response.body).toHaveProperty('errors')
        //el numero de errores sea igual a 1 porque va a validar si el numero es cero
        expect(response.body.errors).toHaveLength(1)

        //Validar que la respuesta no sea un 404 o no encontrado
        expect(response.status).not.toEqual(404)
        //Validar que la respuesta de errores no sea de 2 porque es debe de ser solo de 1 
        expect(response.body.errors).not.toHaveLength(2)

    })


    it('should validate that the price is a number and greater than 0', async () =>{
        //Simular que en la peticion al servidor sea vacia
        const response = await request (server).post('/api/products'). send({
            name : 'Monitor curvo',
            price: "Hello"
        })

        // Validar que me mando bad request o 400 de validacion
        expect(response.status).toEqual(400)
        //contenga el dato errors
        expect(response.body).toHaveProperty('errors')
        //el numero de errores sea igual a 2 porque va a validar si el numero es cero y aparte es entero
        expect(response.body.errors).toHaveLength(2)

        //Validar que la respuesta no sea un 404 o no encontrado
        expect(response.status).not.toEqual(404)
        //Validar que la respuesta de errores no sea de 4 porque es debe de ser solo de 2 
        expect(response.body.errors).not.toHaveLength(4)

    })

    it('should create a new product', async () =>{
        const response = await request (server).post('/api/products'). send({
            name : "Mouse - Testing",
            price: 50
        })

        //Validar cuando es correcto
        expect(response.status).toEqual(201)
        expect(response.body).toHaveProperty('data')

        //Validar cuando es incorrecto
        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('error')


    })

})

describe('GET /api/products', () => {

    it('should check if api/products url exists', async () => {
        const response = await request(server).get('/api/products')
        expect(response.status).not.toEqual(404)

    })

    it('GET a JSON response with products', async () => {
        const response = await request(server).get('/api/products')

        expect(response.status).toEqual(200)
        expect(response.header['content-type']).toMatch(/json/)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveLength(1)

        expect(response.status).not.toEqual(404)
        expect(response.body.data).not.toHaveProperty('errors')
    })
})

describe('GET /api/products/:id', () => {
    it('should return a 404 response for a non-existent product', async () =>{
        const productId = 2000
        const response = await request(server).get(`/api/products/${productId}`)

        expect(response.status).toEqual(404)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Producto no encontrado')
    })
   
    it('should check a valid ID in the URL', async () => {
        const response = await request(server).get('/api/products/not-valid-url')
        expect(response.status).toEqual(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('ID no valido')
    })

    it('get a JSON response for a single product', async () => {
        const response = await request(server).get('/api/products/1')
        expect(response.status).toEqual(200)
        expect(response.body).toHaveProperty('data')

    })
})

describe('PUT /api/prodycts/:id', () => {

    it('should check a valid ID in the URL', async () => {
        const response = await request(server)
                                    .put('/api/products/not-valid-url')
                                    .send({
                                        name : "Monitor nuevo - Actualizado",
                                        price : 300,
                                        availability : true
                                    })
        expect(response.status).toEqual(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('ID no valido')
    })

    it('should display validation error messages when updating a product', async( ) => {
        const response = await request(server).put('/api/products/1').send({})

        expect(response.status).toEqual(400)
        expect(response.body).toHaveProperty('errors')
        // Use toBeTruthy when you don't care what a value is, you just want to ensure a value is true in a boolean context. In JavaScript, there are six falsy values: false, 0, '', null, undefined, and NaN.
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(5)

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('should validate that the price is greater than 0', async( ) => {
        const response = await request(server)
                                    .put('/api/products/1')
                                    .send({
                                        name : "Monitor nuevo - Actualizado",
                                        price : 0,
                                        availability : true
                                    })

        expect(response.status).toEqual(400)
        expect(response.body).toHaveProperty('errors')
        // Use toBeTruthy when you don't care what a value is, you just want to ensure a value is true in a boolean context. In JavaScript, there are six falsy values: false, 0, '', null, undefined, and NaN.
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('Precio no valido')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })


    it('should return a 404 response for a non-existent product', async( ) => {
        const productId = 2000;
        const response = await request(server)
                                    .put(`/api/products/${productId}`)
                                    .send({
                                        name : "Monitor nuevo - Actualizado",
                                        price : 300,
                                        availability : true
                                    })

        expect(response.status).toEqual(404)
        expect(response.body.error).toBe('Producto no encontrado')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('should update an existing product with valid data', async( ) => {
        const response = await request(server)
                                    .put('/api/products/1')
                                    .send({
                                        name : "Monitor nuevo - Actualizado",
                                        price : 300,
                                        availability : true
                                    })

        expect(response.status).toEqual(200)
        expect(response.body).toHaveProperty('data')

        expect(response.status).not.toBe(404)
        expect(response.body).not.toHaveProperty('errors')
    })


})

describe('PATCH /api/prodycts/:id', () => {

    it('should return a 404 response a non-existing product',async () => {
        const productId = 3000;
        const response = await request(server).patch(`/api/products/${productId}`)

        expect(response.status).toEqual(404)
        expect(response.body.error).toBe('Producto no encontrado')
        
        expect(response.status).not.toEqual(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('should update the product availability', async () => {
        const response = await request(server).patch('/api/products/1')

        expect(response.status).toEqual(200)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data.availability).toBe(false)

        expect(response.status).not.toEqual(404)
        expect(response.status).not.toEqual(400)
        expect(response.body).not.toHaveProperty('error')
    })

})


describe('DELETE /api/products/id:', () => {
    it('should check a valid ID', async ()=> {
        const response = await request(server).delete('/api/products/not-valud-url')

        expect(response.status).toEqual(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors[0].msg).toBe('ID no valido')


        expect(response.status).not.toEqual(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('should return a 404 response for a not-existent product', async () => {
        const productId = 2000;
        const response = await request(server).delete(`/api/products/${productId}`)
        expect(response.status).toEqual(404)
        expect(response.body.error).toBe('Producto no encontrado')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')

    })

    it('should delete a product', async () => {
        const response = await request(server).delete('/api/products/1')
        
        expect(response.status).toEqual(200)
        expect(response.body.data).toEqual('Producto Eliminado')

        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(400)

    })
})