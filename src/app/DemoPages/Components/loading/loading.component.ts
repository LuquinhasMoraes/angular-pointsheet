import { Component, OnInit } from '@angular/core';
import Loading from 'src/app/Models/Loading.model';
import { LoadingService } from 'src/app/shared/Services/Loading/loading.service';



@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.sass']
})
export class LoadingComponent implements OnInit {

  loading: Loading;

  constructor(private loadingService: LoadingService) {

    this.loadingService.getLoading().subscribe(_loading => {
      console.log(_loading);
      
      this.loading = _loading;
    });

  }

  ngOnInit() {
  }

}
