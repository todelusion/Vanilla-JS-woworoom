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