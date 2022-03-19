import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  constructor(private db: DatabaseService,
              private router: Router,) 
              {
                this.db.databaseConn();
                this.db.getFavs()
              }
  ngOnInit() {  
    
  }

  navToCharacterDetail(char_id) {
    this.router.navigate([`/character-detail/${char_id}`]);
  }
}
