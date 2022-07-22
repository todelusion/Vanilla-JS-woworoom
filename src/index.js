const productList = document.querySelector('.js-productList')
const userApi = 'https://livejs-api.hexschool.io/api/livejs/v1/customer/todelusion'
const category = document.querySelector('.js-category')

const init = async function(){
renderData()
}

const getApi = async function(){
  let res = await axios.get(`${userApi}/products`)
  let data = res.data.products
  return data
}

const renderData = async function(){
  let apiProductlist = ''
  let data = await getApi()
  console.log(data)
  data.forEach((element) => {
    //依照switchCategory() function return的值顯示或消失
    let str = `
    <li class="${switchCategory()}">
    <div class="relative">
      <p class="py-2 px-6 bg-black text-white w-max absolute -right-1 top-4">新品</p>
      <img src=${element.images} alt="" class="w-64 object-cover">
      <p class="py-2 px-6 bg-black text-white text-center">加入購物車</p>
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
  return apiProductlist
}
const switchCategory = async function(){
  let switchData = await getApi()
  console.log(switchData)
  // return
  // if(category.value == "all"){
  //   console.log('all')
  // }
  // if(category.value == "床架"){
  //   console.log('床架')
  // }
  // if(category.value == "收納"){
  //   console.log('收納')
  // }
  // if(category.value == "窗簾"){
  //   console.log('窗簾')
  // } 
}
renderData()

//現在做到