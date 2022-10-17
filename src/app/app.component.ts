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
    var postParam = []
    for(var i=0; i<this.refID;i++)
    {
      var gTermElement = document.getElementById("GlossaryTerms"+i) as HTMLSelectElement;
      var dAssetElement = document.getElementById("DataAssets"+i) as HTMLSelectElement;
      var selectedTerm = gTermElement.options[gTermElement.selectedIndex].value;
      var selectedAsset = dAssetElement.options[dAssetElement.selectedIndex].value;

      var selTermGuid;
      var selAssetGuid;
      for(var term in this.gTerms)
      {
        if(selectedTerm == this.gTerms[term].name)
        {
          selTermGuid = this.gTerms[term].guid;
        }
      }
      for(var asset in this.dAssets)
      {
        if(selectedAsset == this.dAssets[asset].name)
        {
          selAssetGuid = this.dAssets[asset].guid;
        }
      }
      postParam.push({
        gTerm : selTermGuid,
        dAsset : selAssetGuid
      });
    }

    const headers = { 'Content-Type': 'application/json'};
    this.http.post("/api/AssignTerms",JSON.stringify(postParam),{'headers':headers}).subscribe((response: any) => {
      console.log(response)
      }, 
      (error: any) => {
          console.log(error);
      });
    
  }

  addAssignment()
  {
    const component = this.viewContainerRef.createComponent(SelectComponent,{'index': 0});
    component.instance.gTerms = this.gTerms;
    component.instance.dAssets = this.dAssets;
    component.instance.refID = this.refID;
    this.refID++;
  }
}