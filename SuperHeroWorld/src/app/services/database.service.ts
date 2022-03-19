import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private database: SQLiteObject;
  favList : Array <any>;

  constructor(
      private platform: Platform, 
      private sqlite: SQLite, 
      private httpClient: HttpClient,
      ) 
    {
    this.databaseConn();
    }
    
  databaseConn(){
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'database.db',
        location: 'default'
      })
      .then((db: SQLiteObject) => {
        this.database = db;
        db.executeSql('CREATE TABLE IF NOT EXISTS favorites(char_id INTEGER PRIMARY KEY, name VARCHAR(255), image VARCHAR(255) )', [])
          .then((res) => {
            console.log('Executed SQL');
            alert(JSON.stringify(res));
          } )
          .catch(e =>{
                      console.log(e);
                      alert(`executeSql ${JSON.stringify(e)}`)
                      });
      })
      .catch(e => {
                  console.log(e);
                  alert(`sqlite.create ${JSON.stringify(e)}`)
                  });
    })
  }

  // Get list
  getFavs(){
    this.favList = []
    this.database.executeSql('SELECT * FROM favorites', []).then((res) => {
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) { 
          this.favList.push({ 
            char_id: res.rows.item(i).char_id,
            name: res.rows.item(i).name,  
            image: res.rows.item(i).image
           });
        }
      }
    },(e) => {
      alert(`getFavs() ${JSON.stringify(e)}`);
    });
    return this.favList;
  }

  // Add
  addFav(char_id, name, image) {
    this.database.executeSql(`
    INSERT INTO favorites (char_id, name, image) VALUES ('${char_id}', '${name}', '${image}')`, [])
    .then(res => {
      alert("Added new element");
      this.getFavs();
    }, (e) => {
      alert(`addFav() ${JSON.stringify(e)}`);
    });
  }
 
  // Get single object
  getFavById(char_id): Promise<any> {
    return this.database.executeSql('SELECT * FROM favorites WHERE char_id = ?', [char_id])
    .then(res => { 
      return {
        
        char_id: res.rows.item(0).char_id,
        name: res.rows.item(0).name,  
        image: res.rows.item(0).image
      }
    });
  }
  // Update
  // updateFav(char_id, fav: Favorite) {
  //   let data = [fav.name, fav.image];
  //   return this.database.executeSql(`UPDATE favorites SET name = ?, image = ? WHERE char_id = ${char_id}`, data)
  //   .then(data => {
  //     this.getFavs();
  //   })
  // }
  // Delete
  deleteFav(char_id) {
    return this.database.executeSql(`
    DELETE FROM favorites WHERE char_id = ${char_id}`, [])
    .then(() => {
      alert("Fav deleted!");
      this.getFavs();
    }).catch(e => {
      alert(`deleteFav() ${JSON.stringify(e)}`)
    });
  }
}
