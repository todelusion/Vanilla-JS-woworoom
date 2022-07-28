const productList = document.querySelector('.js-productList')
const userApi = 'https://livejs-api.hexschool.io/api/livejs/v1/customer/todelusion'
const category = document.querySelector('.js-category')
const cartList = document.querySelector('.js-cartList')
const clearCartsAllBtn = document.querySelector('.js-clearCartsAll')

productInit()
cartInit()

function productInit(){
  getProducts()
  renderProducts()
}

function cartInit(){
  getCarts()
  renderCarts()
  addToCart()
  // cartsQuantity()
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
  let res = await axios.get(`${userApi}/carts`)
  let data = res.data.carts
  return data
}

async function renderCarts(data){
  console.log(data) 
  let carts
  if(data){
    carts = data.carts
  }else{
    carts = await getCarts()
  }
  console.log(carts)
  let apiCartList = ''
  carts.forEach(item => {
    let str = `
    <tr class="border-b-2 border-gray-300" data-id="${item.id}">
      <td class="flex items-center pb-5 w-max"><img src="${item.product.images}" alt="image" width="80"></td>
      <td class="pb-5">${item.product.title}</td>
      <td class="pb-5 px-5">${item.product.price}</td>
      <td class="pb-5 px-2">
        <div class="js-quantity w-max cursor-default">
          <i class="fa-solid fa-minus text-sm cursor-pointer"></i>
          <p data-quantity="quantityValue" class="w-min inline mx-3 cursor-default">${item.quantity}</p>
          <i class="fa-solid fa-plus text-sm cursor-pointer"></i>
        </div>
      </td>
      <td class="pb-5 px-5">${item.quantity * item.product.price}</td>
      <td class="icon-delete text-center"><i class="fa-solid fa-x"></i></td>
    </tr>
    `
    apiCartList += str
  })
  cartList.innerHTML = apiCartList
  // cartsQuantity()
  return cartList
}

// 增減購物車數量
cartList.addEventListener('click', async(e)=>{
  const cartList = await renderCarts()
  const quantity = cartList.querySelectorAll('.js-quantity')
  quantity.forEach(item => {
    let p = item.getElementsByTagName('p')
    let cartID = item.parentNode.parentNode.getAttribute('data-id')
    let quantityValue = parseInt(Object.values(p)[0].textContent)
    console.log(e.target.classList)

    if(e.target.className == 'fa-plus'){
      ++ quantityValue
    }
    if(e.target.className == 'fa-minus'){
      quantityValue>1 ? -- quantityValue : alert('數量至少要一個')
    }
    console.log(quantityValue)
    // let res = await apiPatchCart(cartID, quantityValue)
    // renderCarts(res.data)
  })
})


//OLD 增減購物車數量

async function cartsQuantity(){
  const cartList = await renderCarts()
  const quantity = cartList.querySelectorAll('.js-quantity')

  quantity.forEach(item => {
    let p = item.getElementsByTagName('p')
    let cartID = item.parentNode.parentNode.getAttribute('data-id')
    let quantityValue = parseInt(Object.values(p)[0].textContent)

    item.addEventListener('click', async(e) => {
      console.log('test')
      console.log(e.target.className.content)
      let calcArr = Object.values(e.target.classList)
      if(calcArr.includes('fa-plus')){
        //注意數值型別
        ++ quantityValue
      }
      if(calcArr.includes('fa-minus')){
        quantityValue>1 ? -- quantityValue : alert('數量至少要一個')
      }
      let res = await apiPatchCart(cartID, quantityValue)
      renderCarts(res.data)
    })
  })
  
}


// API Carts Patch
async function apiPatchCart(dataID, dataQuantity){
  let obj = {
    data: {
      id: dataID,
      quantity: dataQuantity
    }
  }
  console.log(obj)
  let res = await axios.patch(`${userApi}/carts`, obj)
  return res
}


async function addToCart(){
  const productList = await renderProducts()
  const li = productList.querySelectorAll('li') 
  const addToCart = productList.querySelectorAll('.js-addToCart')
  const carts = await getCarts()
  let localCarts = []
  carts.forEach(item => {
    for(let i=0; i<item.quantity; i++){
      localCarts.push(item.product.id)
    }
  })
  //宣告－加入購物車
  //將函式帶入參數，追蹤點擊事件的數值變化，例如apiCartPost 函式
  const apiPostCart = async(item, dataIDcalc) => {
    for(let key in dataIDcalc){
      if(key == item){
        let obj = {
          data: {
            productId: `${item}`,
            quantity: dataIDcalc[key]
          }
        }  
        let res = await axios.post(`${userApi}/carts`, obj)
        let isDone = res.status === 200 ? true : false
        return isDone
      }
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
      let isDone = await apiPostCart(dataID, dataIDcalc)
      if(isDone === true ){
        Swal.fire({
          position: 'center', icon: 'success',
          title: '新增成功',
          showConfirmButton: false,
          timer: 5000
        });
        renderCarts()
        cartsQuantity()
      }else {
        return
      }
    })
  })
  return localCarts
}

clearCartsAllBtn.addEventListener('click', async() => {
  let res = await axios.delete(`${userApi}/carts`)
  if(res.status === 200){
    Swal.fire({
      position: 'center', icon: 'success',
      title: '全部刪除',
      showConfirmButton: false,
      timer: 5000
    });
    cartInit()
  }
})



