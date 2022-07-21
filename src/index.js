const productList = document.querySelector('.js-productList')
const userApi = 'https://livejs-api.hexschool.io/api/livejs/v1/customer/todelusion'

const init = async function(){
    let res = await axios.get(`${userApi}/products`)
    let data = res.data.products
    console.log(data)
    let str = ''
    data.forEach((element) => {
        let apiProductList = `
        <li>
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
        str += apiProductList
    })
    productList.innerHTML = str
} 
init()