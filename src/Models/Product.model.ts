import {Table,Column,Model, DataType, Default} from 'sequelize-typescript'

//Definimos el nombre de la tabla
@Table({
    tableName: 'products'
})

class Product extends Model {

    //Definimos el tipo de dato
    @Column({
        type: DataType.STRING(100)
    })
    //Definimos el nombre del campo
    declare name :string;

    @Column({
        //postgreSQL no soporta float(n.n) solo soporta FLOAT
        type: DataType.FLOAT
    })
    declare price: number;

    @Default(true)
    @Column({
        type: DataType.BOOLEAN
    })
    declare availability: boolean;

}

export default Product;