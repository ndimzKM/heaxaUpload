
files = document.getElementById('files')

for (var i = 0; i < files.children.length; i++) {
  singleFile = files.children[i]
  //console.log(singleFile.id)
  fileInfo = singleFile.children
  //console.log(fileInfo)
  fileHandle = fileInfo[2]
  iTag = document.createElement('i')
  if(fileHandle.children[3].textContent === 'File Info'){
    test = fileHandle.children[3]
    test.addEventListener('click', function(e){
      mainDiv = e.target.parentElement.parentElement.parentElement;
      fileInformation = mainDiv.children[5];
      anotherSide = document.getElementById('main-file-info');
      iTag.className = fileInformation.parentElement.firstChild.className
      iTag.id = 'file-info-id'
      //console.log(iTag)
      iTag.style.display = 'block'
      anotherSide.parentElement.appendChild(iTag)
      anotherSide.innerHTML = fileInformation.innerHTML
      anotherSide.parentElement.style.display = 'block'
    })
  }
  iTag.style.display = 'none'
}

moreInfo = document.getElementsByClassName('file-options');
for (var i = 0; i < moreInfo.length; i++) {
  moreInfo[i].addEventListener('click', function (e) {
    childElems = e.target.parentElement
    if (childElems.children[2].className == '') {
      childElems.children[2].className = 'displayUl'
    } else {
      childElems.children[2].className = ''
    }
  })
  //childElems.children[2].style.display = 'none'
}
