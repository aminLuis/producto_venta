import { Component, OnInit, Input } from '@angular/core';
import { ProductoServiceService } from 'src/app/services/producto-service.service';
import { CategoriaServiceService } from 'src/app/services/categoria-service.service';
import { Producto } from 'src/app/models/Producto.interface';
import { Categoria } from 'src/app/models/Categoria.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {

  @Input() subscription!: Subscription;
  form_producto_nuevo: FormGroup;
  form_producto_editar: FormGroup;
  productos: Producto[] = [];
  categorias: Categoria[] = [];
  @Input() producto_edit!: Producto;
  descripcion_val: boolean = false;
  precio_val: boolean = false;
  cantidad_val: boolean = false;
  categoria_val: boolean = false;
  current_page: number=1;
  tableSize: number = 7;
  tableSizes: any = [3, 6, 9, 12];

  constructor(private service_producto:ProductoServiceService, 
    private service_categoria:CategoriaServiceService, 
    public form:FormBuilder) {
    
    this.form_producto_nuevo = form.group({
      descripcion:['',Validators.required],
      precio:['',Validators.required],
      cantidad:['',Validators.required],
      categoriaId:['',Validators.required]
    });

    this.form_producto_editar = form.group({
      descripcion:['',Validators.required],
      precio:['',Validators.required],
      cantidad:['',Validators.required],
      categoriaId:['',Validators.required]
    });

  }

  ngOnInit(): void {
    this.listar_productos();
    this.listar_categorias();
    this.subscription = this.service_producto.reload.subscribe(()=>{
      this.listar_productos();
    });
  }

  listar_productos(){
    this.service_producto.getProductos().subscribe(res=>{
      this.productos = res;
    })
  }

  listar_categorias(){
    this.service_categoria.getCategorias().subscribe(res=>{
      this.categorias = res;
    })
  }

  save_producto(){
    console.log(this.form_producto_nuevo.value);
    if(this.form_producto_nuevo.valid){
      this.service_producto.saveProducto(this.form_producto_nuevo.value).subscribe(producto=>{
        this.mensaje_success('Producto registrado con exito!');
        this.form_producto_nuevo.reset();
        this.reiniciar_validacion();
      });
    }else{
      this.validacion_campos();
      this.mensaje_error('Hay campo(s) vacio(s) !!');
    }

  }

  edit_producto(){

    if(this.form_producto_editar.valid){
      this.service_producto.updateProducto(this.producto_edit).subscribe(producto=>{
        this.mensaje_success('Producto actualizado con exito');
        this.reiniciar_validacion();
      });
    }else{
      this.validacion_campos();
      this.mensaje_error('Hay campo(s) vacio(s) !!');
    }
  }


  delete_producto(id:BigInt){
    Swal.fire({
      title: '¿Seguro que desea eliminar el registro?',
      text: "El registro se eliminará permanentemente",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, deseo eliminarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service_producto.deleteProducto(id).subscribe();
        Swal.fire(
          'Eliminado!',
          'El registro ha sido eliminado.',
          'success'
        )
      }
    })
  
  }


  mensaje_success(text:String){
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: text,
      showConfirmButton: false,
      timer: 1500
    })
  }

  mensaje_error(text:String){
    Swal.fire({
      icon: 'error',
      title: text,
      showConfirmButton: false,
      timer: 2000
    })
  }

  validacion_campos(){
    if(this.form_producto_nuevo.value['descripcion']=='' || this.form_producto_editar.value['descripcion']==''){
      this.descripcion_val = true;
    }else{
      this.descripcion_val = false;
    }

    if(this.form_producto_nuevo.value['precio']=='' || this.form_producto_editar.value['precio']==''){
      this.precio_val = true;
    }else{
      this.precio_val = false;
    }

    if(this.form_producto_nuevo.value['cantidad']=='' || this.form_producto_editar.value['cantidad']==''){
      this.cantidad_val = true;
    }else{
      this.cantidad_val = false;
    }

    if(this.form_producto_nuevo.value['categoriaId']=='' || this.form_producto_editar.value['categoriaId']==''){
      this.categoria_val = true;
    }else{
      this.categoria_val = false;
    }

  }

  reiniciar_validacion(){
    this.descripcion_val = false;
    this.precio_val = false;
    this.cantidad_val = false;
    this.categoria_val = false;
  }

  cargar_datos(producto:Producto){
    if(producto!=null){
      this.producto_edit = producto;
    }
  }

  onTableDataChange(event: any) {
    this.current_page = event;
    this.listar_productos();
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.current_page = 1;
    this.listar_productos();
  }

}
