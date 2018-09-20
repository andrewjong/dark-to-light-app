import {Component, OnInit} from '@angular/core';
import {CarService} from "../services/carservice";
import {Car} from "../domain/car";

export class PrimeCar implements Car {
  constructor(public vin?, public year?, public brand?, public color?) {}
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  providers:[CarService]
})

export class HomeComponent implements OnInit {


  stringinterpolation = "hi this is string interpolation"


  displayDialog: boolean;

  car: Car = new PrimeCar();

  selectedCar: Car;

  newCar: boolean;

  cars: Car[];

  cols: any[];
  tabletoggled = false;
  heroes = ['Windstorm', 'Bombasto', 'Magneta', 'Tornado'];

  constructor(private carService: CarService) { }

  ngOnInit() {
    this.carService.getCarsSmall().then(cars => this.cars = cars);

    this.cols = [
      { field: 'vin', header: 'Vin' },
      { field: 'year', header: 'Year' },
      { field: 'brand', header: 'Brand' },
      { field: 'color', header: 'Color' }
    ];
  }

  showDialogToAdd() {
    this.newCar = true;
    this.car = new PrimeCar();
    this.displayDialog = true;
  }

  save() {
    const cars = [...this.cars];
    if (this.newCar) {
      cars.push(this.car);
    } else {
      cars[this.findSelectedCarIndex()] = this.car;
    }
    this.cars = cars;
    this.car = null;
    this.displayDialog = false;
  }

  delete() {
    const index = this.findSelectedCarIndex();
    this.cars = this.cars.filter((val, i) => i !== index);
    this.car = null;
    this.displayDialog = false;
  }

  onRowSelect(event) {
    this.newCar = false;
    this.car = {...event.data};
    this.displayDialog = true;
  }

  findSelectedCarIndex(): number {
    return this.cars.indexOf(this.selectedCar);
  }

  toggletable() {
    this.tabletoggled = !this.tabletoggled
    if(this.tabletoggled) this.stringinterpolation = 'You toggled the table'
    else this.stringinterpolation = 'his this is string interpolation'
  }
}
