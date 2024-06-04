import {Router} from 'express'
//Body se utiliza en funciones que no son asincronas
import { body,param, validationResult } from 'express-validator';
import {createProduct, deleteProduct, getProductById, getProducts, updateAvailability, updateProduct} from './handlers/Product';
import { handleInputErrors } from './middleware';

const router =Router();
// Instalar swagger
// npm i swagger-jsdoc swagger-ui-express
// npm i -D @types/swagger-jsdoc @types/swagger-ui-express

/**
* @swagger
* components:
*      schemas:
*          Product:
*              type: object
*              properties:
*                  id:
*                      type: integer
*                      description: The product ID
*                      example: 1
*                  name:
*                      type: string
*                      description: The product name
*                      example: Monitor Curvo de 49 pulgadas
*                  price:
*                      type: number
*                      description: The product price
*                      example: 300
*                  availability:
*                      type: boolean
*                      description: The availability
*                      example: true
*/

//Routing
router.get('/', getProducts);

/**
 * @swagger
 * /api/products:
 *      get:
 *          summary: Get a list of products
 *          tags:
 *              - Products
 *          description: Return a list of products
 *          responses:
 *              200:
 *                  description: Successful response
 *                  content:
 *                      aplication/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/Product'
 */



/**
 * @swagger
 * /api/products/{id}:
 *  get:
 *      summary: Get a product by ID
 *      tags:
 *          - Products
 *      description: Return a product based on its unique ID
 *      parameters:
 *        - in: path
 *          name: id
 *          description: Te ID of the product to resive
 *          required: true
 *          schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Succesful Response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          404:
 *              description: Not found
 *          400:
 *              description: Bad Request - Invalid ID
 *
 */

router.get('/:id',
    param('id').isInt().withMessage('ID no valido'),
    handleInputErrors,
    getProductById
);

/**
 * @swagger
 * /api/products:
 *  post:
 *      summary: Creates a new product
 *      tags:
 *          - Products
 *      description: Returns a new record in the database
 *      requestBody:
 *          required: true
 *          content:
 *              aplication/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: 'Monitor Curvo 49 Pulgadas'
 *                          price:
 *                              type: number
 *                              example: 399
 *      responses:
 *          201:
 *              description: Successful response
 *              content: 
 *                  aplication/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          400:
 *              description: Bad Request - invalid input data
 *
 */


router.post('/',
        //Validacion
        body('name')
            .notEmpty().withMessage('El nombre del Producto no puede ir vacio'),
        body('price')
            .isNumeric().withMessage('Valor no valido')
            .notEmpty().withMessage('El precio del Producto no puede ir vacio')
            .custom(( value )=> value > 0).withMessage('Precio no valido'),
            handleInputErrors,
    createProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *  put:
 *      summary: Updates a product with user input
 *      tags:
 *          - Products
 *      description: Returns the updated product
 *      parameters:
 *         - in: path
 *           name: id
 *           description: The ID of the product to receive
 *           required: true
 *           schema:
 *               type: integer
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: 'Monitor Curvo 49 Pulgadas'
 *                          price:
 *                              type: number
 *                              example: 399
 *                          availability:
 *                              type: boolean
 *                              example: true
 *      responses:
 *          200:
 *              description: Successful response
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          400:
 *              description: Bad Request - Invalid ID or Invalid Input Data
 *          404:
 *              description: Product Not Found
 */


router.put('/:id',
        //Validacion
        param('id').isInt().withMessage('ID no valido'),
        body('name')
            .notEmpty().withMessage('El nombre del Producto no puede ir vacio'),
        body('price')
            .isNumeric().withMessage('Valor no valido')
            .notEmpty().withMessage('El precio del Producto no puede ir vacio')
            .custom(( value )=> value > 0).withMessage('Precio no valido'),
        body('availability')
            .isBoolean().withMessage('Valor para disponibilidad novalido'),
            handleInputErrors,
    updateProduct
);


/**
 * @swagger
 * /api/products/{id}:
 *  patch:
 *      summary: Update Product availability
 *      tags:
 *          - Products
 *      description: Returns the updated availability
 *      parameters:
 *         - in: path
 *           name: id
 *           description: The ID of the product to receive
 *           required: true
 *           schema:
 *               type: integer
 *      responses:
 *          200:
 *              description: Successful response
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          400:
 *              description: Bad Request - Invalid ID
 *          404:
 *              description: Product Not Found
 */


router.patch('/:id',
        //validacion
        param('id').isInt().withMessage('ID no valido'),
        handleInputErrors,
    updateAvailability
);

/**
 * @swagger
 * /api/products/{id}:
 *  delete:
 *      summary: Deletes a Product by a given ID
 *      tags:
 *          - Products
 *      description: Returns a confirmation Message
 *      parameters:
 *         - in: path
 *           name: id
 *           description: The ID of the product to delete
 *           required: true
 *           schema:
 *               type: integer
 *      responses:
 *          200:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *                          value: 'Producto Eliminado'
 *          400:
 *              description: Bad Request - Invalid ID
 *          404:
 *              description: Product Not Found
 */

router.delete('/:id',
        //Validacion
        param('id').isInt().withMessage('ID no valido'),
        handleInputErrors,
    deleteProduct
 );

export default router;