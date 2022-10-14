import { HttpClient } from '@angular/common/http';
import { Component, ViewContainerRef } from '@angular/core';
import { SelectComponent } from './select/select.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent{

  assets = '';
  gTerms = [];
  dAssets = [];
  refID = 0;

  constructor(private http: HttpClient, private viewContainerRef: ViewContainerRef) {
    this.http.get('/api/getAllAssets').subscribe((resp: any) => {
      this.assets = resp;
      this.processAssets(resp);
    });
  }

  processAssets(allAssets) {
    this.gTerms =[];
    this.dAssets=[];

    for(var i=0; i<allAssets.length; i++)
    {
      if(allAssets[i].type == "GlossaryTerm")
      {
        this.gTerms.push(allAssets[i]);
      }
      else{
        this.dAssets.push(allAssets[i]);
      }
    }
  }

  callAPI()
  {
    for(var i=0; i<this.refID;i++)
    {
      var gTermElement = document.getElementById("GlossaryTerms"+i) as HTMLSelectElement;
      var dAssetElement = document.getElementById("DataAssets"+i) as HTMLSelectElement;
      var selectedTerm = gTermElement.options[gTermElement.selectedIndex].value;
      var selectedAsset = dAssetElement.options[dAssetElement.selectedIndex].value;
      console.log("GET ...?gterm="+selectedTerm+"&dasset="+selectedAsset);

      const headers = { 'content-type': 'application/json'};
      this.http.post("/api/PostTest","{'name':TestParam}",{'headers':headers}).subscribe(data => {
    
      });
    }
  }

  addAssignment()
  {
    const component = this.viewContainerRef.createComponent(SelectComponent,{'index':0});
    component.instance.gTerms = this.gTerms;
    component.instance.dAssets = this.dAssets;
    component.instance.refID = this.refID;
    this.refID++;
  }
}