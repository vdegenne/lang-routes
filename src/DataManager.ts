
export class DataManager {
  public flats: {[kanji: string]: string} = {}

  constructor () {
    this.load()
  }

  load () {
    if (localStorage.getItem('lang-routes:flats')) {
      this.flats = JSON.parse(localStorage.getItem('lang-routes:flats')!.toString())
    }
  }

  save () {
    if (Object.keys(this.flats).length > 0)
      localStorage.setItem('lang-routes:flats', JSON.stringify(this.flats))
  }
}

window.dataManager = new DataManager