import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { ShAPIService } from '../services/sh-api.service';
import { DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';
import { CharacterDetailPage } from '../pages/character-detail/character-detail.page';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  results = []

  constructor(
    private ShAPI: ShAPIService,
    private db: DatabaseService,
    private router: Router,
  ) {}
  
  APIsearch(input_value){
    this.ShAPI.search(input_value).subscribe(res => {
      this.results = res.results;
      // console.table(this.results);  
  });
  }

  navToCharacterDetail(char_id) {
    this.router.navigate([`/character-detail/${char_id}`]);
  }
}
