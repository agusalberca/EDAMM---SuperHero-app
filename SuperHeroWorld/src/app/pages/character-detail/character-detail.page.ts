import { Component, OnInit } from '@angular/core';
import { ShAPIService } from '../../services/sh-api.service';
import { DatabaseService } from '../../services/database.service';
import { ActivatedRoute } from '@angular/router';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

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
  public message = 'Checkout this photo from my favorite character';
  public faved
  constructor(
    private route: ActivatedRoute,
    private ShAPI: ShAPIService,
    private db: DatabaseService,
    private socialSharing: SocialSharing
    ) {
      this.db.databaseConn(); 
    }

  ngOnInit() {  
    this.char_id = this.route.snapshot.paramMap.get('id');
    this.ShAPI.characterByID(this.char_id).subscribe(res => {
      // console.log("data: " + JSON.stringify(res))
      this.superhero = res; 
    });
    this.isDataAvailable = true;
  }
  favorite(){
    this.db.getFavById(this.char_id).then(res => {
      alert(`favorite1() ${JSON.stringify(res)}`)
      if (res) {
        this.delete_favorite()
      }
      else{
        this.add_favorite()
      }
    }).catch(e => {
      alert(`error favorite() ${JSON.stringify(e)}`)
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

  
  shareviaWhatsapp(){
    this.socialSharing.shareViaWhatsApp(this.message,null,this.superhero.image.url)
      .then((success) =>{
          alert("Success");
       })
        .catch((e)=>{
          alert(`shareviaWhatsapp() ${JSON.stringify(e)}`);
        });
    }
    shareviaFacebook(){
    this.socialSharing.shareViaFacebook(this.message,this.superhero.image.url,null)
      .then((success) =>{
           alert("Success");
       })
       .catch((e)=>{
          alert(`shareviaFacebook() ${JSON.stringify(e)}`);
        });
    }
    shareviaInstagram(){
    this.socialSharing.shareViaInstagram(this.message,this.superhero.image.url)
      .then((success) =>{
          alert("Success");
        })
        .catch((e)=>{
          alert(`shareviaInstagram() ${JSON.stringify(e)}`);
        });
    }
    shareviaTwitter(){
    this.socialSharing.shareViaTwitter(this.message,this.superhero.image.url,null)
    .then((success) =>{
          alert("Success");
        })
        .catch((e)=>{
          alert(`shareviaTwitter() ${JSON.stringify(e)}`);
        });
    }

}
