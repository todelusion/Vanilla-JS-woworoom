const productList = document.querySelector('.js-productList')
const userApi = 'https://livejs-api.hexschool.io/api/livejs/v1/customer/todelusion'
const category = document.querySelector('.js-category')
const cartList = document.querySelector('.js-cartList')

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

async function getCarts(){
  let res = await axios.get(`${userApi}/carts`)
  let data = res.data.carts
  return data
}

async function renderCarts(){
  let apiCartList = ''
  let carts = await getCarts()
  console.log(carts)
  carts.forEach(item => {
    let str = `
    <td class="flex items-center pb-5 w-max"><img src="${item.product.images}" alt="image" width="80"></td>
    <td class="pb-5">${item.product.description}</td>
    <td class="pb-5 px-5">${item.product.price}</td>
    <td class="pb-5 px-5">${item.quantity}</td>
    <td class="pb-5 px-5">${item.quantity * item.product.price}</td>
    <td class="icon-delete text-center"><i class="fa-solid fa-x"></i></td>
    `
    apiCartList += str
  })
  cartList.innerHTML = apiCartList
}


async function addToCart(){
  const productList = await renderProducts()
  const li = productList.querySelectorAll('li') 
  const addToCart = productList.querySelectorAll('.js-addToCart')
  let cartListArr = []
  console.log(li)
  addToCart.forEach((item, index) => {
    item.addEventListener('click', () => {
      dataID = li[index].getAttribute('data-id')
      cartListArr.push(dataID)
      console.log(cartListArr)
    })
  })
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
