let Class = document.querySelector('.Class')
let btn = document.querySelectorAll('.btn')
let list = document.querySelector('.list')
let title = document.querySelector('.title')
let pageid = document.querySelector('.pageid')
let dataNum = document.querySelector('.dataNum')
let Data = []
let nowData = [];
let perpage = 12;
//監聽
Class.addEventListener('change', determine)
for (let i = 0; i < btn.length; i++) {
  btn[i].addEventListener('click', determine)
}
dataNum.addEventListener('change', function dataNumChoice(e) {
  updatePage(nowData, 1, e.target.value)
})
pageid.addEventListener('click', switchPage)
//取資料
fetch('https://api.kcg.gov.tw/api/service/get/9c8e1450-e833-499c-8320-29b36b7ace5c').then(res => res.json()).then(data => {
  Data = data.data.XML_Head.Infos.Info;
  updatePage(Data, 1, perpage);
  nowData = Data;
})
function updatePage(pageData, currentPage, perpage) {
  let totalPage = Math.ceil(pageData.length / perpage);
  let minData = (currentPage - 1) * perpage + 1;
  let maxData = currentPage * perpage;
  let tempData = [];
  pageData.forEach((item, index) => {
    let num = index + 1;
    if (num >= minData && num <= maxData) {
      tempData.push(item)
    }
  });
  // for(i=0;i<tempData.length;i++){
  // console.log(tempData[i].Class1,tempData[i].Name);
  // }
  let PAGE = {
    totalPage,
    currentPage,
    hasPage: currentPage > 1,
    hasNext: currentPage < totalPage,
  };
  // console.table(PAGE)
  initialPage(tempData);
  pageBtn(PAGE);
}
function determine(e) {
  //判斷符合條件的資料，重整頁面
  if (e.target.value == '所有資料') {//所有資料
    updatePage(Data, 1, perpage);
    title.innerHTML = '所有資料';
    return
  }
  let select = +e.target.value;
  let tempData = [];
  for (let i = 0; i < Data.length; i++) {
    if (Data[i].Class1 == select || Data[i].Class1 == select + 1 || Data[i].Class1 == select + 2) {
      tempData.push(Data[i]);
    }
  }
  // console.log(tempData)
  nowData = tempData;
  updatePage(nowData, 1, perpage);
  title.innerHTML = select;
}
function initialPage(e) {
  //初始頁面資料，顯示
  let str = '';
  for (let i = 0; i < e.length; i++) {
    str += `
      <div class="article">
        <div class="photo" style="background-image:url(${e[i].Picture1})">
          <h4 class="Name">${e[i].Name}</h4>
        </div>
        <p class="Opentime">
          <i class="far fa-clock"></i>
          <span>${e[i].Opentime}</span>
        </p>
        <p class="Add">
          <i class="fas fa-home"></i>
          <span>${e[i].Add}</span>
        </p>
        <p class="Tel">
          <i class="fas fa-phone"></i>
          <span>${e[i].Tel}</span>
        </p>
      </div>`;
  }
  list.innerHTML = str;
}
function pageBtn(e) {
  let str = '';
  let total = e.totalPage
  if (e.hasPage) {
    str += `<li class="page-item"><a class="page-link" href="#" data-page="${Number(e.currentPage) - 1}">|←</a></li>`;
  }
  for (let i = 1; i <= total; i++) {
    if (Number(e.currentPage) == i) {
      str += `<li class="page-item active"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
    } else {
      str += `<li class="page-item"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
    }
  }
  if (e.hasNext) {
    str += `<li class="page-item"><a class="page-link" href="#" data-page="${Number(e.currentPage) + 1}">→|</a></li>`;
  }
  // console.log(str)

  //顯示資料數量
  let str2 = '';
  for (let i = 1; i <= 8; i++) {
    str2 += `<option value="${i * 6}">${i * 6}</option>`
  }
  str2 += `<option value="顯示數量" disabled selected>顯示數量</option>`
  dataNum.innerHTML = str2;
  pageid.innerHTML = str;
}
function switchPage(e) {
  // e.preventDefault();
  if (e.target.nodeName !== 'A') return;
  // console.log(nowData, e.target.dataset.page, perpage)
  updatePage(nowData, e.target.dataset.page, perpage);
}