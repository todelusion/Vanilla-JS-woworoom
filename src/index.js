const productList = document.querySelector('.js-productList')
const userApi = 'https://livejs-api.hexschool.io/api/livejs/v1/customer/todelusion'
const category = document.querySelector('.js-category')


init()

async function init(){
  getApi()
  renderData()

}

async function getApi(){
  let res = await axios.get(`${userApi}/products`)
  let data = res.data.products
  console.log(data)
  return data
}


async function renderData(){
  let apiProductlist = ''
  let data = await getApi()
  data.forEach((element) => {
    //依照switchCategory() function return的值顯示或消失
    let str = `
    <li data-category="${element.category}">
    <div class="relative">
      <p class="py-2 px-6 bg-black text-white w-max absolute -right-1 top-4">新品</p>
      <img src=${element.images} alt="" class="w-64 object-cover">
      <p class="js-addToCart py-2 px-6 bg-black text-white text-center cursor-pointer hover:bg-primary">加入購物車</p>
    </div>
    <div>
      <h3 class="text-lg text-ellipsis">${element.title}</h3>
      <p class="line-through text-lg text-gray-300">${element.origin_price}</p>
      <h4 class="text-2xl">${element.price}</h4>
    </div>
  </li>
    `
    apiProductlist += str
  })
  productList.innerHTML = apiProductlist
  return data
}
function switchCategory(){
  let li = productList.querySelectorAll('li')
  li.forEach((item) => {
    let DOMcategory = item.getAttribute("data-category")
    if(category.value == "all"){
      item.setAttribute('class','block')
    }else {
      item.setAttribute('class','hidden')
    }
    if(category.value == "床架" && DOMcategory == "床架"){
      item.removeAttribute('class')
      console.log(item)
    }
    if(category.value == "收納" && DOMcategory == "收納"){
      item.removeAttribute('class')
      console.log(item)
    }
    if(category.value == "窗簾" && DOMcategory == "窗簾"){
      item.removeAttribute('class')
      console.log(item)
    }
    
  })
}

//抓DOM判斷符合特定條件才能顯示的物件