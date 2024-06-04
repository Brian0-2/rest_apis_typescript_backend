import request from 'supertest';
import server, {connectDB} from '../server';
import db from '../config/db';

jest.mock('../config/db')

describe('connectDB', () => {
    it('should hanlde database connection error', async () => {
        //crea una funcion en el ambiente de mock y le pasamos la base de datos y 
        // le pasamos el metodo el cual queremos observar su comportamiento en este caso db, authenticate
        jest.spyOn(db,'authenticate')
            .mockRejectedValueOnce(new Error('Hubo un error al conectar a la DB'))
        const consoleSpy = jest.spyOn(console, 'log')
        await connectDB()

        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining('Hubo un error al conectar a la DB')
        )
    })
})



// describe('Nuestro primer test', () => {
//     it('debe revisar que 1 + 1 = 2', () =>{
//         expect(1 + 1).toBe(2)
//     })

//     it('debe revisar que 1 + 1 != 3', () =>{
//         expect(1 + 1).not.toBe(3)
//     })
// })