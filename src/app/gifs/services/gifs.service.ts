import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, provideHttpClient } from '@angular/common/http';
import { Gif, SearchResponse } from '../interfaces/gifs.interface';


@Injectable({providedIn: 'root'})
export class GifsService {

  public gifsList: Gif[] = []
  private _tagsHistory: string[] = []
  private GIPHY_API_KEY: string = 'DKewp9w7wySKxn44GH0ZMjnlVPTZ59TQ'
  private SERVICE_URL: string = 'https://api.giphy.com/v1/gifs'


  constructor(
    private http: HttpClient
  ) {
    this.loadLocalStorage()
  }

  get tagsHistory(){
    return [...this._tagsHistory]
  }

  private organizeHistory(tag: string){
    tag = tag.toLowerCase()

    if(this._tagsHistory.includes(tag)){
      this._tagsHistory = this._tagsHistory.filter(oldTag => oldTag !== tag)
    }

    this._tagsHistory.unshift(tag)
    this.saveLocalStorage()
  }

  private saveLocalStorage(): void {
    localStorage.setItem('history',JSON.stringify(this._tagsHistory))
  }

  private loadLocalStorage(): void {
    const localHistorty = localStorage.getItem('history')
    if(!localHistorty) return

    this._tagsHistory = JSON.parse(localHistorty)
    if(this._tagsHistory.length === 0) return
    this.searchTag(this._tagsHistory[0])
  }

  public searchTag(tag: string): void {

    if(tag.length === 0) return
    this.organizeHistory(tag)

    const params = new HttpParams()
      .set('api_key',this.GIPHY_API_KEY)
      .set('limit',30)
      .set('q',tag)

    this.http.get<SearchResponse>(`${this.SERVICE_URL}/search`,{params})
      .subscribe(resp => {
        this.gifsList = resp.data

      })
  }

}
