const productList = document.querySelector(".js-productList");
const userApi =
  "https://livejs-api.hexschool.io/api/livejs/v1/customer/todelusion";
const category = document.querySelector(".js-category");
const cartList = document.querySelector(".js-cartList");
const clearCartsAllBtn = document.querySelector(".js-clearCartsAll");
const total = document.querySelector(".js-total");
const submitCarts = document.querySelector(".js-submitCarts");
const submitModal = document.querySelector(".js-submitModal")

let showModal = false

productInit();
cartInit();

function productInit() {
  getProducts();
  renderProducts();
}

function cartInit() {
  getCarts();
  renderCarts();
  addToCart();
  // cartsQuantity()
}

async function getProducts() {
  let res = await axios.get(`${userApi}/products`);
  let data = res.data.products;
  return data;
}

async function renderProducts() {
  let apiProductlist = "";
  let data = await getProducts();
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
    `;
    apiProductlist += str;
  });
  productList.innerHTML = apiProductlist;
  return productList;
}

function switchCategory() {
  let li = productList.querySelectorAll("li");
  li.forEach((item) => {
    let DOMcategory = item.getAttribute("data-category");
    if (category.value == "all") {
      item.setAttribute("class", "block");
    } else {
      item.setAttribute("class", "hidden");
    }
    if (category.value == "床架" && DOMcategory == "床架") {
      item.removeAttribute("class");
    }
    if (category.value == "收納" && DOMcategory == "收納") {
      item.removeAttribute("class");
    }
    if (category.value == "窗簾" && DOMcategory == "窗簾") {
      item.removeAttribute("class");
    }
  });
}

async function getCarts() {
  let res = await axios.get(`${userApi}/carts`);
  let data = res.data.carts;
  return data;
}

async function renderCarts(data) {
  let carts;
  if (data) {
    carts = data.carts;
  } else {
    carts = await getCarts();
  }
  let apiCartList = "";
  const cartsTotalArr = [];
  carts.forEach((item) => {
    let str = `
    <tr class="border-b-2 border-gray-300" data-id="${item.id}">
      <td class="flex items-center pb-5 w-max"><img src="${
        item.product.images
      }" alt="image" width="80"></td>
      <td class="pb-5">${item.product.title}</td>
      <td class="pb-5 px-5">${item.product.price}</td>
      <td class="pb-5 px-2">
        <div class="js-quantity w-max cursor-default">
          <i class="fa-solid fa-minus text-sm cursor-pointer"></i>
          <p data-quantity="quantityValue" class="w-min inline mx-3 cursor-default">${
            item.quantity
          }</p>
          <i class="fa-solid fa-plus text-sm cursor-pointer"></i>
        </div>
      </td>
      <td class="pb-5 px-5">${item.quantity * item.product.price}</td>
      <td class="icon-delete text-center"><i class="fa-solid fa-x"></i></td>
    </tr>
    `;
    apiCartList += str;
    cartsTotalArr.push(item.quantity * item.product.price);
  });
  cartList.innerHTML = apiCartList;
  cartsTotal(cartsTotalArr);
  return cartList;
}

// 修改購物車數量
cartList.addEventListener("click", async (e) => {
  let classListArr = Object.values(e.target.classList);
  // async function search(){
  //   quantity.forEach((item) => {
  //     p = item.getElementsByTagName('p')
  //     cartID = item.parentNode.parentNode.getAttribute('data-id')
  //     quantityValue = parseInt(Object.values(p)[0].textContent)
  //     classListArr = Object.values(e.target.classList)
  //   })
  // }
  if (classListArr.includes("fa-plus") || classListArr.includes("fa-minus")) {
    let cartID =
      e.target.parentNode.parentNode.parentNode.getAttribute("data-id");
    let quantityValue = Object.values(
      e.target.parentNode.getElementsByTagName("p")
    )[0].textContent;
    if (classListArr.includes("fa-plus")) {
      ++quantityValue;
    }
    if (classListArr.includes("fa-minus")) {
      quantityValue > 1 ? --quantityValue : quantityValue = quantityValue;
    }
    let res = await apiPatchCart(cartID, quantityValue);
    if (res.status === 200) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "修改成功",
        showConfirmButton: false,
        timer: 5000,
      });
      renderCarts(res.data);
    }
  }
});

// API Carts Patch
async function apiPatchCart(dataID, dataQuantity) {
  let obj = {
    data: {
      id: dataID,
      quantity: dataQuantity,
    },
  };
  let res = await axios.patch(`${userApi}/carts`, obj);
  return res;
}

//加入購物車
async function addToCart() {
  const productList = await renderProducts();
  const li = productList.querySelectorAll("li");
  const addToCart = productList.querySelectorAll(".js-addToCart");

  //宣告－加入購物車
  //將函式帶入參數，追蹤點擊事件的數值變化，例如apiCartPost 函式
  const apiPostCart = async (item, dataIDcalc) => {
    for (let key in dataIDcalc) {
      if (key == item) {
        let obj = {
          data: {
            productId: `${item}`,
            quantity: dataIDcalc[key],
          },
        };
        let res = await axios.post(`${userApi}/carts`, obj);
        let isDone = res.status === 200 ? true : false;
        return isDone;
      }
    }
  };

  //宣告－計算重複商品
  const calcFunc = async (localCarts) => {
    const carts = await getCarts();

    carts.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        localCarts.push(item.product.id);
      }
    });
    const dataIDcalc = localCarts.reduce((obj, item) => {
      if (item in obj) {
        obj[item]++;
      } else {
        obj[item] = 1;
      }
      return obj;
    }, {});
    return dataIDcalc;
  };

  //執行－加入購物車
  addToCart.forEach((item, index) => {
    item.addEventListener("click", async () => {
      const dataID = li[index].getAttribute("data-id");
      let localCarts = [];
      localCarts.push(dataID);
      const dataIDcalc = await calcFunc(localCarts);
      let isDone = await apiPostCart(dataID, dataIDcalc);
      if (isDone === true) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "新增成功",
          showConfirmButton: false,
          timer: 5000,
        });
        renderCarts();
      } else {
        return;
      }
    });
  });
}

//移出購物車
cartList.addEventListener("click", (e) => {
  if (e.target.classList.contains("fa-x")) {
    let cartID = e.target.closest("tr").getAttribute("data-id");
    axios.delete(`${userApi}/carts/${cartID}`).then((res) => {
      Swal.fire({
        position: "center",
        icon: "success",
        title: `成功刪除`,
        showConfirmButton: false,
        timer: 5000,
      });
      renderCarts();
    });
  }
});

//清空購物車
clearCartsAllBtn.addEventListener("click", async () => {
  let res = await axios.delete(`${userApi}/carts`);
  if (res.status === 200) {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "全部刪除",
      showConfirmButton: false,
      timer: 5000,
    });
    cartInit();
  }
});

//計算購物車總額
function cartsTotal(cartsTotalArr) {
  if (cartsTotalArr.length > 0) {
    const cartsTotal = cartsTotalArr.reduce((a, b) => a + b);
    total.textContent = `總金額：${cartsTotal}`;
  } else {
    total.textContent = `總金額：0`;
  }
}


/*  f/submit orders  */

//宣告－關閉送出訂單視窗
const closeModalfunc = () => {
  const closeModal = document.querySelector(".js-closeModal")
  if(closeModal !== null){
    closeModal.addEventListener("click", (e) => {
      if(e.target.classList.contains("js-closeModal")){
        showModal = !showModal
        closeModal.remove()
      }
    })
  }else {
    return
  }

}

//宣告－送出訂單
const submitModalfunc = () => {
  const closeModal = document.querySelector(".js-closeModal")
  const submitOrders = document.querySelector(".js-submitOrders")
  
  submitOrders.addEventListener('click', (e) => {
    const name = document.querySelector(".js-name").value
    const tel = document.querySelector(".js-tel").value
    const email = document.querySelector(".js-email").value
    const address = document.querySelector(".js-address").value
    const payment = document.querySelector(".js-payment").value
  
    const obj = {
      data: {
        user: {
          name: "",
          tel: "",
          email: "",
          address: "",
          payment: ""
        }
      }
    }
    
    if(name && tel && email && address && payment){
      obj.data.user.name = name
      obj.data.user.tel = tel
      obj.data.user.email = email
      obj.data.user.address = address
      obj.data.user.payment = payment
    }else{
      Swal.fire({
        position: "center",
        icon: "error",
        title: "還有資料沒填喔！",
        showConfirmButton: false,
        timer: 5000,
      });
      return
    }

    console.log(obj)

    axios.post(`${userApi}/orders`, obj)
    .then(res => {
      console.log(res)
      Swal.fire({
        position: "center",
        icon: "success",
        title: "資料送出！",
        showConfirmButton: false,
        timer: 5000,
      });
      showModal = !showModal
      closeModal.remove()
    })
    .catch(err => {
      console.log(err)
      Swal.fire({
        position: "center",
        icon: "error",
        title: "資料格式有誤！",
        showConfirmButton: false,
        timer: 5000,
      })
    })
  

  })
}
  

//宣告－顯示送出訂單視窗
const showModalfunc= async () => {
  showModal = !showModal
  if(showModal == true){
    submitModal.innerHTML = `
    <div class="js-closeModal fixed top-0 flex h-screen w-full flex-col items-center justify-center bg-black/50">
      <div
          class="flex w-full max-w-xl flex-col items-center rounded-2xl bg-white py-14"
          >
            <h2 class="mb-8 text-3xl">填寫預訂資料</h2>
            <form class="mb-16 w-full max-w-sm">
              <ul>
                <li class="relative mb-7 w-full">
                  <label class="mb-2 block">姓名</label>
                  <input
                    type="text"
                    placeholder="請輸入姓名"
                    class="js-name block w-full rounded-lg border-2 px-3 py-2"
                  />
                  <p class="absolute -right-12 top-1/2 text-red-600">必填</p>
                </li>
                <li class="relative mb-7 w-full">
                  <label class="mb-2 block">電話</label>
                  <input
                    type="tel"
                    placeholder="請輸入電話"
                    class="js-tel block w-full rounded-lg border-2 px-3 py-2"
                  />
                  <p class="absolute -right-12 top-1/2 text-red-600">必填</p>
                </li>
                <li class="relative mb-10 w-full">
                  <label class="mb-2 block">Email</label>
                  <input
                    type="email"
                    placeholder="請輸入Email"
                    class="js-email block w-full rounded-lg border-2 px-3 py-2"
                  />
                  <p class="absolute -right-12 top-1/2 text-red-600">必填</p>
                </li>
                <li class="relative mb-10 w-full">
                  <label class="mb-2 block">寄送地址</label>
                  <input
                    type="text"
                    placeholder="請輸入寄送地址"
                    class="js-address block w-full rounded-lg border-2 px-3 py-2"
                  />
                  <p class="absolute -right-12 top-1/2 text-red-600">必填</p>
                </li>
                <li class="relative mb-7 w-full">
                  <select
                    name="payment"
                    class="js-payment w-full rounded-lg border-2 py-2 px-3"
                  >
                    <option value="ATM">ATM</option>
                    <option value="信用卡">信用卡</option>
                    <option value="超商付款">超商付款</option>
                  </select>
                  <p class="absolute -right-12 top-1/2 text-red-600">必填</p>
                </li>
              </ul>
            </form>
            <button class="js-submitOrders rounded-md bg-black hover:bg-primary px-16 py-3 text-xl text-white duration-150">
              送出預訂資料
            </button>
          </div>
    </div>
  
    `
  }
  closeModalfunc()
  submitModalfunc()
}


//觸發－訂單視窗
submitCarts.addEventListener("click", async() => {
  let res = await renderCarts()
  if(res.firstChild === null){
    Swal.fire({
      position: "center",
      icon: "error",
      title: `請選購至少一件商品！`,
      showConfirmButton: false,
      timer: 5000,
    })
  }else{
    showModalfunc()
  }
});



