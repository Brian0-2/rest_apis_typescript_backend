import {request, Request , Response} from 'express';
//Check se va a utilizar en funciones que son asincronas
import { 
    // check, 
    validationResult } from 'express-validator';
import Product from '../Models/Product.model';

export const getProducts = async (req : Request, res : Response) =>{
   
        const products = await Product.findAll({
            order: [
                ['id', 'DESC']
            ]
            // Exluir columnas de una consulta
            // ,attributes: {exclude: ['createdAt', 'updatedAt', 'availability']}
        });

        res.json({data: products});

   
}

export const getProductById = async (req : Request, res : Response) =>{
        
        const { id } = req.params;
        const product = await Product.findByPk(id);

        if(!product){
            return res.status(404).json({
                error: 'Producto no encontrado'
            })
        }

        res.json({ data: product })
}

export const createProduct = async (req : Request, res : Response) => {

        const product = await Product.create(req.body);
        // const saveProduct = await product.save();
    
        res.status(201).json({data: product});

}

export const updateProduct = async (req : Request, res : Response) => {
   
        const { id } = req.params;
        const product = await Product.findByPk(id);

        if(!product){
            return res.status(404).json({
                error: 'Producto no encontrado'
            })
        }

        //Actualizar
        await product.update(req.body);
        await product.save()

        res.json({ data: product })

}


export const updateAvailability  = async (req : Request, res : Response) => {

        const { id } = req.params;
        const product = await Product.findByPk(id);

        if(!product){
            return res.status(404).json({
                error: 'Producto no encontrado'
            })
        }

        //Actualizar
        //Si esta como true se pasa a false y si esta como false se pasa a true
        product.availability = !product.dataValues.availability;
        await product.save();

        res.json({ data: product })
}

export const deleteProduct = async (req : Request, res : Response) => {

        const { id } = req.params;
        const product = await Product.findByPk(id);

        if(!product){
            return res.status(404).json({
                error: 'Producto no encontrado'
            })
        }

        //Eliminar
        // Eliminado logico, consiste en agregar otro campo de tipo booleano para cambear la visibilidad de este porque suele estar prohibido borrar datos
        // product.visability = !product.dataValues.visability;
        await product.destroy()
        res.json({data: "Producto Eliminado"})
}