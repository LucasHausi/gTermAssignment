import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  message = '';
  assets = '';

  constructor(private http: HttpClient) {
    this.http.get('/api/getAllAssets').subscribe((resp: any) => {
      this.assets = resp;
      console.log(JSON.stringify(resp))
    });
  }

  
}