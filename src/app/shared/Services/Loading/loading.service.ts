import { Injectable } from '@angular/core';
import Loading from 'src/app/Models/Loading.model';
import { BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  loadingSettings: BehaviorSubject<Loading> = new BehaviorSubject<Loading>(null);

  constructor() { }

  setLoading(isShow: boolean, value: Loading = null) {
    if(value != null) {
      this.loadingSettings.next(value);
    } else {
      const loading: Loading = new Loading()
      loading.isShow = isShow;
      this.loadingSettings.next(loading);
    }
  }

  getLoading() {
    return this.loadingSettings.asObservable();
  }
}
