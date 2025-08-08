import { saveAs } from 'file-saver'
export function exportText(filename, text){
  const blob = new Blob([text], {type:'text/plain;charset=utf-8'})
  saveAs(blob, filename)
}