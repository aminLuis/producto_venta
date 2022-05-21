import { Component, OnInit, Input } from '@angular/core';
import { CategoriaServiceService } from 'src/app/services/categoria-service.service';
import { Categoria } from 'src/app/models/Categoria.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {

  @Input() subscription!: Subscription;
  categorias: Categoria[]=[];

  constructor(private service: CategoriaServiceService) { }

  ngOnInit(): void {
    this.listar_categorias();
  }

  listar_categorias(){
    this.service.getCategorias().subscribe(res => {
      this.categorias = res;
      console.log(this.categorias);
    })
  }

}
