import { Component, OnInit } from '@angular/core';
import { GlobleService } from '../service/globle.service';

@Component({
  selector: 'app-layouts',
  templateUrl: './layouts.component.html',
  styleUrls: ['./layouts.component.scss']
})
export class LayoutsComponent implements OnInit {

  constructor(
    public gs: GlobleService
  ) { }

  ngOnInit(): void {
  }

}
