import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ambiente-edificio',
  templateUrl: './ambiente-edificio.page.html',
  styleUrls: ['./ambiente-edificio.page.scss'],
})
export class AmbienteEdificioPage implements OnInit {
  ambientes = [];
  edificio = null;
  constructor(private activatedRoute: ActivatedRoute, public router: Router) { }

  ngOnInit() {
    this.edificio = this.activatedRoute.snapshot.paramMap.get('edificio');
    this.ambientes.push('Room');
    this.ambientes.push('Flat');
    this.ambientes.push('Storey');
    this.ambientes.push('Garden');
    this.ambientes.push('Garage');
    this.ambientes.push('bathRoom');
    this.ambientes.push('diningRoom');
    this.ambientes.push('storageRoom');
    this.ambientes.push('Lobby');
    this.ambientes.push('liviningRoom');
    this.ambientes.push('bedRoom');
    this.ambientes.push('Kitchen');
    console.log(this.ambientes[0]);
  }
  routeCrearHabitacion(ambiente) {
    this.router.navigate(['crear-habitacion', this.edificio, ambiente]);
  }

}
