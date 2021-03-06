import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { NavController, AlertController } from '@ionic/angular';
import { EncryptService } from 'src/app/services/encrypt.service';
import { GenerateXMLService } from 'src/app/services/generate-xml.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DataUserService } from 'src/app/services/data-user.service';


@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
})
export class RegistrarPage implements OnInit {

  myform: FormGroup;
  matching_passwords_group: FormGroup;
  xmlRegistrarUsuario = null;
  password = '';
  constructor(
    private dataservice: DataService,
    public formBuilder: FormBuilder,
    public navCtrl: NavController,
    private generarXML: GenerateXMLService,
    private encrypt: EncryptService,
    public alertController: AlertController,
    private utilidades: UtilitiesService,
    private authservice: AuthenticationService,
    private dataUserService: DataUserService,
  ) {
    this.myform = this.formBuilder.group({
      dirIp: ['', Validators.compose([Validators.required])],
      nombreApp: ['Clipio', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      contrasena: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      confirmacionContrasena: ['', Validators.compose([Validators.required, Validators.minLength(8)])]
    });
  }

  ngOnInit() {
  }

  async saveData() {
      let codigo;
      this.dataUserService.setIP(this.myform.value.dirIp);
      this.dataUserService.setEmail(this.myform.value.email);
      this.myform.value.contrasena = btoa(this.encrypt.encrypt(this.myform.value.contrasena));
      this.myform.value.confirmacionContrasena = btoa(this.encrypt.encrypt(this.myform.value.confirmacionContrasena));
      this.xmlRegistrarUsuario = this.generarXML.setXMLRegistrar(this.myform);
      this.dataservice.capturarDatosUsuario();
      if (this.myform.valid) {
         await this.dataservice.registrarUsuario(this.xmlRegistrarUsuario, this.myform.get('email').value)
         .then(async data => {
            codigo = await this.utilidades.alertEspecifica( "Registro Usuario ", data);
            if (codigo === '1028' || codigo === '1044') {
              this.authservice.login(this.myform.value.dirIp, this.myform.value.email);
            }
         });

      }

    }

  checkPass() {
    // Store the password field objects into variables ...
    const objPass2 = <HTMLInputElement>document.getElementById('confirmacionContrasena');
    const pass2 = (objPass2).value;
    // Store the Confimation Message Object ...
    let message = document.getElementById('confirmMessage');
    // Set the colors we will be using ...
    let goodColor = "#66cc66";
    let badColor = "#ff6666";
    // Compare the values in the password field 
    // and the confirmation field

    if (this.password === pass2 && (this.password !== "" || pass2 !=="")) {
      //The passwords match. 
      //Set the color to the good color and inform
      //the user that they have entered the correct password 
      message.style.color = goodColor;
      message.innerHTML = "*Contraseñas iguales";
    } else {
      //The passwords do not match.
      //Set the color to the bad color and
      //notify the user.
      message.style.color = badColor;
      message.innerHTML = "*Las contraseñas son incorrectas";
    }
  }
  async exitosoAlert() {
    const alert = await this.alertController.create({
      header: 'Informacion',
      message: 'Se ha registrado correctamente.',
      buttons: ['OK']
    });
    await alert.present();
  }
  async fracasoAlert() {
    const alert = await this.alertController.create({
      header: 'Informacion',
      message: 'No se ha podido registrar.',
      buttons: ['OK']
    });
    await alert.present();
  }
}
