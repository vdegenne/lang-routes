export function getSelection () {
    var text = '';
    if ('getSelection' in window) {
        text = window.getSelection()?.toString() || '';
    }
    // } else if (document.selection && document.selection.type != "Control") {
    //     text = document.selection.createRange().text;
    // }
    return text;
}

export async function presearchHanjaPage (word: string) {
  const response = await (await fetch(`https://hanja.dict.naver.com/api3/ccko/search?query=${encodeURIComponent(word)}`)).json()
  console.log(response)
}

/* Search Functions */
export function naverJapSearch (word: string) {
  if (word === '') return
  window.open(`https://ja.dict.naver.com/#/search?query=${encodeURIComponent(word)}`, '_blank')
}

export function naverHanjaSearch (word: string) {
  if (word === '') return
  window.open(`https://hanja.dict.naver.com/#/search?query=${encodeURIComponent(word)}`, '_blank')
}

export function jishoSearch (word: string) {
  if (word === '') return
  window.open(`https://jisho.org/search/${encodeURIComponent(word)}`, '_blank')
}

export function googleImagesSearch (word: string) {
  if (word === '') return
  window.open(`https://www.google.com/search?q=${word}&sxsrf=ALeKk03OpIy5MDwB0ZOXkqgulfVCIk8WYw:1585268139694&source=lnms&tbm=isch&sa=X`, '_blank')
}

export function writtenChineseSearch (word: string) {
  if (word === '') return
  window.open(`https://dictionary.writtenchinese.com/#sk=${encodeURIComponent(word)}&svt=pinyin`)
}