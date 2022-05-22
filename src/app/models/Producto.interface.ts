import { Categoria } from "./Categoria.interface";

export interface Producto{
    id:BigInt,
    descripcion:String,
    precio:DoubleRange,
    cantidad:BigInt,
    categoriaId:BigInt
    categoria:Categoria
}