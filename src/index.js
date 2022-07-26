const productList = document.querySelector('.js-productList')
const userApi = 'https://livejs-api.hexschool.io/api/livejs/v1/customer/todelusion'
const category = document.querySelector('.js-category')
const cartList = document.querySelector('.js-cartList')
const clearCartsAllBtn = document.querySelector('.js-clearCartsAll')

init()
featureCart()

function init(){
  getProducts()
  renderProducts()
}

function featureCart(){
  getCarts()
  renderCarts()
  addToCart()
}

async function getProducts(){
  let res = await axios.get(`${userApi}/products`)
  let data = res.data.products
  return data
}


async function renderProducts(){
  let apiProductlist = ''
  let data = await getProducts()
  data.forEach((element) => {
    //依照switchCategory() function return的值顯示或消失
    let str = `
    <li data-id="${element.id}" data-category="${element.category}">
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
  return productList
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
    }
    if(category.value == "收納" && DOMcategory == "收納"){
      item.removeAttribute('class')
    }
    if(category.value == "窗簾" && DOMcategory == "窗簾"){
      item.removeAttribute('class')
    }
  })
}


async function getCarts(){
  let localCarts = []
  let res = await axios.get(`${userApi}/carts`)
  let data = res.data.carts
  data.forEach(item => {
    for(let i=0; i<item.quantity; i++){
      localCarts.push(item.id)
    }
  })
  return [data, localCarts]
}

async function renderCarts(dataIDcalc){
  let [ carts, localCarts ] = await getCarts()
  let apiCartList = ''
  carts.forEach(item => {
    for(let key in dataIDcalc){
      // console.log(dataIDcalc)
      console.log(key)
      // console.log(item.id)
      if(key === item.id){
        let str = `
        <tr class="border-b-2 border-gray-300">
          <td class="flex items-center pb-5 w-max"><img src="${item.product.images}" alt="image" width="80"></td>
          <td class="pb-5">${item.product.title}</td>
          <td class="pb-5 px-5">${item.product.price}</td>
          <td class="pb-5 px-5">${dataIDcalc[key]}</td>
          <td class="pb-5 px-5">${dataIDcalc[key] * item.product.price}</td>
          <td class="icon-delete text-center"><i class="fa-solid fa-x"></i></td>
        </tr>
        `
        apiCartList += str
      }
    }

  })
  cartList.innerHTML = apiCartList
  return true
}


async function addToCart(){
  const productList = await renderProducts()
  const li = productList.querySelectorAll('li') 
  const addToCart = productList.querySelectorAll('.js-addToCart')
  let [ carts, localCarts ] = await getCarts()
  // const dataIDarr = []
  
  //宣告－加入購物車
  //使用函式帶入參數，追蹤點擊事件的數值變化，例如apiCartPost 函式
  const apiPostCart = async(dataIDcalc) => {
    for(let key in dataIDcalc){
      let obj = {
        data: {
          productId: `${key}`,
          quantity: dataIDcalc[key]
        }
      }
      

      let res = await axios.post(`${userApi}/carts`, obj)
      let isDone = res.status === 200 ? true : false
      return isDone
    }
  }

  //宣告－計算重複商品
  const calcFunc = async() => {
    const dataIDcalc = localCarts.reduce((obj,item) => {
      if(item in obj){
        obj[item]++
      }else{
        obj[item] = 1
      }
      return obj
    },{})
    return dataIDcalc
  }

  
  //執行－加入購物車
  addToCart.forEach((item, index) => {
    item.addEventListener('click', async() => {
      const dataID = li[index].getAttribute('data-id')
      localCarts.push(dataID)
      const dataIDcalc = await calcFunc()
      let isDone = await apiPostCart(dataIDcalc)
      console.log(isDone)
      renderCarts(dataIDcalc)
      // if(res === true ){
      //   location.reload()
      // }else {
      //   return
      // }
    })
  })
}

clearCartsAllBtn.addEventListener('click', () => {
  axios.delete(`${userApi}/carts`)
  .then(res => {
    location.reload()
  })
  .catch(err => console.log(err))
})



