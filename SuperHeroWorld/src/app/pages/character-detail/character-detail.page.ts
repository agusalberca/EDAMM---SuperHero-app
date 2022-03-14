import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ShAPIService } from '../../services/sh-api.service';
import { DatabaseService } from '../../services/database.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-character-detail',
  templateUrl: './character-detail.page.html',
  styleUrls: ['./character-detail.page.scss'],
})
export class CharacterDetailPage implements OnInit {

  public superhero;

  public superheroImage;
  public char_id;
  public isDataAvailable = false;

  constructor(
    private route: ActivatedRoute,
    private ShAPI: ShAPIService,
    private db: DatabaseService,
    ) {
      this.char_id = this.route.snapshot.paramMap.get('id');
    this.ShAPI.characterByID(this.char_id).subscribe(res => {
      // console.log("res" + JSON.stringify(res))
      this.superhero = res; 
    });
    this.isDataAvailable = true;
    }

  ngOnInit() {  
    this.char_id = this.route.snapshot.paramMap.get('id');
    this.ShAPI.characterByID(this.char_id).subscribe(res => {
      console.log("name: " + JSON.stringify(res.name))
      console.log("biography: " + JSON.stringify(res.biography))
      this.superhero = res; 
      this.superhero.id = res.id;
      this.superhero.image = res.image.url;
      this.superhero.biography = JSON.parse(res.biography);

    });
    this.isDataAvailable = true;
  }

  
}
