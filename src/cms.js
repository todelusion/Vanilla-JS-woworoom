const adminApi = "https://livejs-api.hexschool.io/api/livejs/v1/admin/todelusion"
const token = {
  headers: {
    Authorization: 'ImKfpJq41QUDkE6Ab861TpRbFRq1'
  }
}
const orderPage = document.querySelector('.orderPage-list')
const orderList = document.querySelector('.orderPage-body')


/* Chart.js */

const getApiData = async() => {

  const handleGetApiData = async() => {
    const lists = await getApi()
    const outputOrders = []
    const outputProducts = []
    
    //2. 每一個參數進來代表一個訂單進來，一個訂單push完後換下一個訂單
    const handleOrders = (orders) => {
      orders.forEach(order => outputOrders.push(order))
    }    
    
    //1. 有幾個訂單就呼叫幾次handleOrders()
    lists.forEach(list => {
      handleOrders(list.products)
    })

    //3. 得到一個陣列包含全部訂單的商品
    outputOrders.forEach(outputList => {
      outputProducts.push(outputList.title)
    })

    const calcOutputProducts = outputProducts.reduce((obj, outputProduct) => {
      if(outputProduct in obj){
        obj[outputProduct]++
      }else {
        obj[outputProduct] = 1
      }
      return obj
    }, {})

    return calcOutputProducts
  }
  
  const calcOutputProducts = await handleGetApiData()
  // console.log(calcOutputProducts)

  return calcOutputProducts
}



const handleData = async() => {
  const calcOutputProducts = await getApiData()

  const countPercentage = () => {
    const percentageArr = []
    const values = Object.values(calcOutputProducts)
    const sum = values.reduce((a, b) => a + b)
    values.forEach(value => {
      percentageArr.push(Math.round((value/sum)*100))
    })
    return percentageArr
  }

  // console.log(Object.keys(calcOutputProducts))
  // console.log(countPercentage())

  const data = {
      labels: Object.keys(calcOutputProducts),
      datasets: [{
        label: '全品項營收比重',
        data: countPercentage(),
        datalabels: {
          color: 'rgb(236, 247, 255)'
        },
        backgroundColor: [
          'rgb(48, 30, 95)',
          'rgb(84, 52, 167)',
          'rgb(157, 127, 234)',
          'rgb(218, 203, 255)'
        ],
       
        hoverOffset: 10
      }]
  };
  return data
}

const handleConfig = async() => {
  const config = {
    type: 'doughnut',
    data: await handleData(),
    options: {
      plugins: {
        datalabels: {
          formatter: (value, context) => {
            return [`${value}%`]
          }
        }
        
      }
    },
    plugins: [ChartDataLabels]
  };
return config
}

const ctx = document.getElementById('myChart');

const myChart = async() => {
  const config = await handleConfig()
  return new Chart(ctx, config)
}

myChart()

/* CMS */


function init(){
  renderOrder()
}

async function getApi (){
  const res = await axios.get(`${adminApi}/orders`, token)
  return res.data.orders
}

const renderOrder = async(data) => {
  let lists
  if(data){
    lists = data
  }else {
    lists = await getApi()
  }
  const isPaid = (n) =>  n === true ? '已處理': '未處理'
  // console.log(lists)

  let output = ''
  lists.forEach(list => {
    let str = `
    <tr data-list="${list.id}" data-paid="${list.paid}">
      <td>${list.createdAt}</td>
      <td>
        <p>${list.user.name}</p>
        <p>${list.user.tel}</p>
      </td>
      <td>${list.user.address}</td>
      <td>${list.user.email}</td>
      <td>
          ${list.products.map(product => `<p data-product="${product.id}">${product.title}</p>`)}
      </td>
      <td>${list.updatedAt}</td>
      <td class="orderStatus">
        <a class="js-orderStatus whitespace-nowrap cursor-pointer">${isPaid(list.paid)}</a>
      </td>
      <td>
        <input type="button" class="delSingleOrder-Btn" value="刪除">
      </td>
    </tr>
    `
    output += str
  })
  orderList.innerHTML = output
}
const deleteOrder = async(listID) => {
  // console.log('delete')
  axios.delete(`${adminApi}/orders/${listID}`, token)
  .then(res => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "刪除成功",
      showConfirmButton: false,
      timer: 5000,
    });
    renderOrder(res.data.orders)
  })
}
const deleteOrderAll = async() => {
  axios.delete(`${adminApi}/orders`, token)
  .then(res => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "全部刪除",
      showConfirmButton: false,
      timer: 5000,
    });
    renderOrder(res.data.orders)
  })
}


init()


orderPage.addEventListener('click', (e) => {
  if(e.target.className == 'delSingleOrder-Btn'){
    let listID = e.target.closest('tr').getAttribute('data-list')
    deleteOrder(listID)
  }
  if(e.target.className == 'discardAllBtn'){
    if(orderList.firstChild === null){
      Swal.fire({
        position: "center",
        icon: "error",
        title: "至少要有一個訂單",
        showConfirmButton: false,
        timer: 5000,
      });
    }else{
      deleteOrderAll()
    }
  }
  if(e.target.classList.contains('js-orderStatus')){
    let listID = e.target.closest('tr').getAttribute('data-list')
    let listPaid = e.target.closest('tr').getAttribute('data-paid')
    let isPaid
    isPaid = listPaid === 'true' ? true : false
    isPaid = listPaid === 'false' ? false : true
    isPaid = !isPaid

    // console.log(isPaid)
    let obj = {
      data: {
        id: listID,
        paid: isPaid
      }
    }
    // console.log(obj)

    axios.put(`${adminApi}/orders`, obj, token)
    .then(res => {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "更改狀態",
        showConfirmButton: false,
        timer: 5000,
      });
      renderOrder(res.data.orders)
    })
  }
})



