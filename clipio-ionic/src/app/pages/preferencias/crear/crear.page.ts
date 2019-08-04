import { Component, Output, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { GenerateXMLService } from 'src/app/services/generate-xml.service';
import { DataService } from 'src/app/services/data.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.page.html',
  styleUrls: ['./crear.page.scss'],
})
export class CrearPage implements OnInit {

  /* Formulario para captura de datos del ECA */
  crearECAForm: FormGroup;

  /* Para capturar los datos que vienen del componente lector QR */
  onReadEvent = new EventEmitter();
  onReadAction = new EventEmitter();

  /* Datos Evento */
  direccionEvento = null;
  datastreamEvento = null;
  dsFormatEvento = null;
  nombreDispEvento = null;
  idDispEvento = null;
  ipDispEvento = null;

  /* Datos Accion */
  direccionAccion = null;
  datastreamAccion = null;
  dsFormatAccion = null;
  nombreDispAccion = null;
  idDispAccion = null;
  ipDispAccion = null;


  constructor(private router: Router, public formBuilder: FormBuilder,
              public alertController: AlertController, private xmlService: GenerateXMLService, private dataService: DataService) {

    /*Creacion Formulario para Captura de ECA */
    const dataStreamEvento = this.formBuilder.group({
      comparador: [null, Validators.required],
      valor: [null, Validators.required],
      significado: [null, Validators.required],
    });

    const dataStreamAccion = this.formBuilder.group({
      comparador: [null, Validators.required],
      valor: [null, Validators.required],
      significado: [null, Validators.required],
    });

    this.crearECAForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      evento: dataStreamEvento,
      accion: dataStreamAccion,
    });
  }

  ngOnInit() { }

  async guardarDireccionEvento(dir: string) {
    /* Si la direccion leída no contiene los siguientes caracteres se considera inválida */
    if (dir.indexOf('/Identificator?osid=') === -1) {
      console.log('Direccion no válida');
      const alert = await this.alertController.create({
        header: 'Atención!',
        message: 'El QR leído no contiene una direccion válida',
        buttons: ['OK']
      });

      await alert.present();
    } else {
      this.direccionEvento = dir;
    }
  }

  async guardarDireccionAccion(dir: string) {
    /* Si la direccion leída no contiene los siguientes caracteres se considera inválida */
    if (dir.indexOf('/Identificator?osid=') === -1) {
      console.log('Direccion no válida');
      const alert = await this.alertController.create({
        header: 'Atención!',
        message: 'El QR leído no contiene una direccion válida',
        buttons: ['OK']
      });
      await alert.present();

    } else {
      this.direccionAccion = dir;
    }
  }

  /* Eliminacion de evento seleccionado en el formulario */
  eliminarEvento() {
    this.direccionEvento = null;
    this.datastreamEvento = null;
    this.dsFormatEvento = null;
    this.nombreDispEvento = null;
    this.idDispEvento = null;
    this.ipDispEvento = null;
    this.crearECAForm.get('evento').reset();
  }

  /* Eliminacion de accion seleccionada en el formulario */
  eliminarAccion() {
    this.direccionAccion = null;
    this.datastreamAccion = null;
    this.dsFormatAccion = null;
    this.nombreDispAccion = null;
    this.idDispAccion = null;
    this.ipDispAccion = null;
    this.crearECAForm.get('accion').reset();
  }

  async handlerAsignarEvento($event) {
    if ($event === null) {
      const alert = await this.alertController.create({
        header: 'Atención!',
        message: 'No se encontró información del dispositivo',
        buttons: ['OK']
      });
      await alert.present();
      this.eliminarEvento();
    } else {
      this.datastreamEvento = $event.nombre;
      this.dsFormatEvento = $event.dsFormat;
      this.nombreDispEvento = $event.nombreDisp;
      this.idDispEvento = $event.idDisp;
      this.ipDispEvento = $event.ipDisp;

      /* En caso que el evento sea un actuador se asigna "igual" como comparador,
      de lo contrario este valor se captura en el formulario */
      if (this.dsFormatEvento === 'bool' || this.dsFormatEvento === 'boolean') {
        this.crearECAForm.get('evento').get('comparador').setValue('igual');
      }
    }
  }

  async handlerAsignarAccion($event) {
    if ($event === null) {
      const alert = await this.alertController.create({
        header: 'Atención!',
        message: 'No se encontró información del dispositivo',
        buttons: ['OK']
      });
      await alert.present();
      this.eliminarAccion();
    } else {
      this.datastreamAccion = $event.nombre;
      this.dsFormatAccion = $event.dsFormat;
      this.nombreDispAccion = $event.nombreDisp;
      this.idDispAccion = $event.idDisp;
      this.ipDispAccion = $event.ipDisp;

      /* Se asigna "igual" como comparador porque la accion siempre es un actuador */
      this.crearECAForm.get('accion').get('comparador').setValue('igual');
    }
  }

  capturarDatos() {
    /* Se capturan los datos guardados y formulario y se envian los necesarios para crear el xml */
    const xmlCreacion = this.xmlService.crearECA(this.crearECAForm,
      // Datos de Accion
      { datastream: this.datastreamAccion,
        dsFormat: this.dsFormatAccion,
        nombreDispositivo: this.nombreDispAccion,
        idDispositivo: this.idDispAccion,
        ipDispositivo: this.ipDispAccion
      },
      // Datos de Evento
      { datastream: this.datastreamEvento,
        dsFormat: this.dsFormatEvento,
        nombreDispositivo: this.nombreDispEvento,
        idDispositivo: this.idDispEvento,
        ipDispositivo: this.ipDispEvento
      }
      );
    this.dataService.crearECA(xmlCreacion);
  }
  /*
  pruebaDatosXML() {
    this.xmlService.crearECA({
        nombre: 'MI ECA example',
        evento: {
          comparador: 'igual',
          valor: '1',
          significado: 'Hace calors',
        },
        accion: {
          comparador: 'igual',
          valor: '1',
          significado: 'Prendete sesamo',
        }
      },
      {
        datastream: 'temperatura',
        dsFormat: 'string',
        nombreDispositivo: 'Regulador de tempartura',
        idDispositivo: '708637323',
        ipDispositivo: '192.168.0.23'
      },
      {
        datastream: 'ventilador',
        dsFormat: 'bool',
        nombreDispositivo: 'Regulador de tempartura',
        idDispositivo: '708637323',
        ipDispositivo: '192.168.0.23'
      }
      );
  }*/
}
