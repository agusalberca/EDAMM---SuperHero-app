import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { SQLitePorter } from '@awesome-cordova-plugins/sqlite-porter/ngx';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Favorite } from './favorite';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private database: SQLiteObject;
  favList = new BehaviorSubject([]);
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
      private platform: Platform, 
      private sqlite: SQLite, 
      private httpClient: HttpClient,
      private sqlPorter: SQLitePorter,
      ) 
    {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'data.db',
        location: 'default'
      })
      .then((db: SQLiteObject) => {
        this.database = db;
        db.executeSql('create table if not exists favorites(char_id INTEGER PRIMARY KEY, name VARCHAR(64), image VARCHAR )', [])
          .then(() => console.log('Executed SQL'))
          .catch(e => console.log(e));
      })
      .catch(e => console.log(e));
    })
  }
    
  dbState() {
    return this.isDbReady.asObservable();
  }
  
  fetchFavs(): Observable<Favorite[]> {
    return this.favList.asObservable();
  }

  // Get list
  getFavs(){
    return this.database.executeSql('SELECT * FROM favorites', []).then(res => {
      let items: Favorite[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) { 
          items.push({ 
            char_id: res.rows.item(i).char_id,
            name: res.rows.item(i).name,  
            image: res.rows.item(i).image
           });
        }
      }
      this.favList.next(items);
    });
  }
  // Add
  addFav(char_id, name, image) {
    let data = [char_id,name, image];
    return this.database.executeSql('INSERT INTO favorites (char_id, name, image) VALUES (?, ?, ?)', data)
    .then(res => {
      this.getFavs();
    });
  }
 
  // Get single object
  getFavById(char_id): Promise<Favorite> {
    return this.database.executeSql('SELECT * FROM favorites WHERE char_id = ?', [char_id]).then(res => { 
      return {
        char_id: res.rows.item(0).char_id,
        name: res.rows.item(0).name,  
        image: res.rows.item(0).image
      }
    });
  }
  // Update
  updateFav(char_id, fav: Favorite) {
    let data = [fav.name, fav.image];
    return this.database.executeSql(`UPDATE favorites SET name = ?, image = ? WHERE char_id = ${char_id}`, data)
    .then(data => {
      this.getFavs();
    })
  }
  // Delete
  deleteFav(char_id) {
    return this.database.executeSql('DELETE FROM favorites WHERE char_id = ?', [char_id])
    .then(_ => {
      this.getFavs();
    });
  }
}

//----------------------------------------------------------------------------------------------

// export class DbService {
//   private storage: SQLiteObject;
//   songsList = new BehaviorSubject([]);
//   private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
//   constructor(
//     private platform: Platform, 
//     private sqlite: SQLite, 
//     private httpClient: HttpClient,
//     private sqlPorter: SQLitePorter,
//   ) {
//     this.platform.ready().then(() => {
//       this.sqlite.create({
//         name: 'positronx_db.db',
//         location: 'default'
//       })
//       .then((db: SQLiteObject) => {
//           this.storage = db;
//           this.getFakeData();
//       });
//     });
//   }
//   dbState() {
//     return this.isDbReady.asObservable();
//   }
 
//   fetchSongs(): Observable<Song[]> {
//     return this.songsList.asObservable();
//   }
//     // Render fake data
//     getFakeData() {
//       this.httpClient.get(
//         'assets/dump.sql', 
//         {responseType: 'text'}
//       ).subscribe(data => {
//         this.sqlPorter.importSqlToDb(this.storage, data)
//           .then(_ => {
//             this.getSongs();
//             this.isDbReady.next(true);
//           })
//           .catch(error => console.error(error));
//       });
//     }
//   // Get list
//   getSongs(){
//     return this.storage.executeSql('SELECT * FROM songtable', []).then(res => {
//       let items: Song[] = [];
//       if (res.rows.length > 0) {
//         for (var i = 0; i < res.rows.length; i++) { 
//           items.push({ 
//             id: res.rows.item(i).id,
//             artist_name: res.rows.item(i).artist_name,  
//             song_name: res.rows.item(i).song_name
//            });
//         }
//       }
//       this.songsList.next(items);
//     });
//   }
//   // Add
//   addSong(artist_name, song_name) {
//     let data = [artist_name, song_name];
//     return this.storage.executeSql('INSERT INTO songtable (artist_name, song_name) VALUES (?, ?)', data)
//     .then(res => {
//       this.getSongs();
//     });
//   }
 
//   // Get single object
//   getSong(id): Promise<Song> {
//     return this.storage.executeSql('SELECT * FROM songtable WHERE id = ?', [id]).then(res => { 
//       return {
//         id: res.rows.item(0).id,
//         artist_name: res.rows.item(0).artist_name,  
//         song_name: res.rows.item(0).song_name
//       }
//     });
//   }
//   // Update
//   updateSong(id, song: Song) {
//     let data = [song.artist_name, song.song_name];
//     return this.storage.executeSql(`UPDATE songtable SET artist_name = ?, song_name = ? WHERE id = ${id}`, data)
//     .then(data => {
//       this.getSongs();
//     })
//   }
//   // Delete
//   deleteSong(id) {
//     return this.storage.executeSql('DELETE FROM songtable WHERE id = ?', [id])
//     .then(_ => {
//       this.getSongs();
//     });
//   }
// }