import { Component, OnInit, Input } from '@angular/core';
import { CategoriaServiceService } from 'src/app/services/categoria-service.service';
import { Categoria } from 'src/app/models/Categoria.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {

  @Input() subscription!: Subscription;
  categorias: Categoria[]=[];
  @Input() categoria_edit!:Categoria;
  form_categoria_nueva: FormGroup;
  form_categoria_editar:FormGroup;
  descripcion_val:boolean = false;

  constructor(private service_categoria: CategoriaServiceService, public form:FormBuilder) { 

    this.form_categoria_nueva = form.group({
      descripcion:['',Validators.required],
    });

    this.form_categoria_editar = form.group({
      descripcion:['',Validators.required],
    });

  }

  ngOnInit(): void {
    this.listar_categorias();
    this.subscription = this.service_categoria.reload.subscribe(()=>{
      this.listar_categorias();
    });
  }

  listar_categorias(){
    this.service_categoria.getCategorias().subscribe(res => {
      this.categorias = res;
      console.log(this.categorias);
    })
  }

  save_categoria(){

    if(this.form_categoria_nueva.valid){
      console.log(this.form_categoria_nueva.value);
      this.service_categoria.saveCategoria(this.form_categoria_nueva.value).subscribe(categoria=>{
        this.mensaje_success('Categoría registrada con exito!');
        this.form_categoria_nueva.reset();
        this.reiniciar_validacion();
      });
    }else{
     this.validacion_campos();
     this.mensaje_error('Hay campo(s) vacio(s) !!');
    }
  }

  edit_categoria(){
  
    if(this.form_categoria_editar.valid){
      this.service_categoria.updateCategoria(this.categoria_edit).subscribe(categoria=>{
        this.reiniciar_validacion();
        this.mensaje_success('Categoría actualizada con exito!');
      })
     
    }else{
      this.validacion_campos();
      this.mensaje_error('Hay campo(s) vacio(s) !!');
    }
  }

  delete_categoria(id:BigInt){
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
        this.service_categoria.deleteCategoria(id).subscribe();
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
    if(this.form_categoria_nueva.value['descripcion']=='' || this.form_categoria_editar.value['descripcion']==''){
      this.descripcion_val = true;
    }else{
      this.descripcion_val = false;
    }
  }

  reiniciar_validacion(){
    this.descripcion_val = false;
  }

  cargar_datos(categoria:Categoria){
    if(categoria!=null){
      this.categoria_edit = categoria;
    }
  }

}
