import { Component, OnInit } from '@angular/core';
import { ShAPIService } from '../../services/sh-api.service';
import { DatabaseService } from '../../services/database.service';
import { ActivatedRoute } from '@angular/router';
import { Share } from '@capacitor/share';


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
  public faved
  constructor(
    private route: ActivatedRoute,
    private ShAPI: ShAPIService,
    private db: DatabaseService,
    ) {
      // this.db.databaseConn(); 
    }

  ngOnInit() {  
    this.char_id = this.route.snapshot.paramMap.get('id');
    this.ShAPI.characterByID(this.char_id).subscribe(res => {
      // console.log("data: " + JSON.stringify(res))
      this.superhero = res; 
    });
    this.isDataAvailable = true;
    this.db.getFavById(this.char_id).then(res => {
      if (res && Object.keys(res).length == 0) {
        this.faved= false
      }
      else{
        this.faved= true
      }
    }).catch(e => {
      // alert(`error ngOnInit() ${JSON.stringify(e)}`)
    })

  }
  favorite(){
    this.db.getFavById(this.char_id).then(res => {
      alert(`favorite1() ${JSON.stringify(res)}`)
      if (res && Object.keys(res).length == 0) {
        this.add_favorite()
      }
      else{
        this.delete_favorite()
      }
    }).catch(e => {
      // alert(`error favorite() ${JSON.stringify(e)}`)
    })
  }
  add_favorite(){
    this.faved=true;
    this.db.addFav(this.char_id, this.superhero.name, this.superhero.image.url);
    console.log('add_favorite getFAVS()',this.db.getFavs())
  }
  delete_favorite(){
    this.faved=false;
    this.db.deleteFav(this.char_id);
    console.log('delete_favorite getFAVS()',this.db.getFavs())
  }
  async share(){
    await Share.share({
      title: 'Superhero World Character',
      text:  `Checkout a picture from my favorite character ${this.superhero.name}!`,
      url: this.superhero.image.url,
      dialogTitle: 'Share with buddies',
    })
  }

}
