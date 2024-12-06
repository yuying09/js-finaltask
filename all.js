const baseUrl = "https://livejs-api.hexschool.io/";
const apiPath = "yuying";
//抓取產品資料 
let products = [];
function getProductList() {
  axios.get(`${baseUrl}api/livejs/v1/customer/${apiPath}/products`)
    .then(function (res) {
      products = res.data.products;
      renderProductWrap(products);
    })
    .catch(function (err) {
      alert(err.response.data.message || "資料取得失敗");
    })
};
getProductList();

//渲染產品列表
const productWrap = document.querySelector(".productWrap");
function renderProductWrap(products) {
  let template = "";
  products.forEach(item => {
    template += `<li class="productCard">
            <h4 class="productType">新品</h4>
            <img src="${item.images}" alt="">
            <a href=#  class="addCardBtn" data-id="${item.id}">加入購物車</a>
            <h3>${item.title}</h3>
            <del class="originPrice">NT$${item.origin_price}</del>
            <p class="nowPrice">NT$${item.price}</p>
            </li>`
  });
  productWrap.innerHTML = template;
};

//取得購物車列表
const cartProduct = document.querySelector(".cartProduct");
let carts = [];
function getCartList() {
  axios.get(`${baseUrl}api/livejs/v1/customer/${apiPath}/carts`)
    .then(function (res) {
      carts = res.data.carts;
      renderCartList();
    })
    .catch(function (err) {
      alert(err.response.data.message || "資料取得失敗");
    })
};
getCartList();


//渲染產品列表
const totalPrice = document.querySelector(".totalPrice");
function renderCartList() {
  let template = "";
  let countTotalPrice = 0;
  carts.forEach(item => {
    let productPrice = item.product.price * item.quantity;
    countTotalPrice += productPrice;
    template += `
      <tr>
          <td>
            <div class="cardItem-title">
              <img src="${item.product.images}" alt="">
              <p>${item.product.title}</p>
            </div>
          </td>
          <td>NT$${item.product.price}</td>
          <td>${item.quantity}</td>
          <td>NT$${productPrice}</td>
          <td class="discardBtn">
            <a href="#" class="material-icons" data-id="${item.id}">
              clear
            </a>
          </td>
    </tr>`
  });
  cartProduct.innerHTML = template;
  totalPrice.textContent = "NT$" + countTotalPrice;
};



//加入購物車
function addCartItem(id) {
  axios.post(`${baseUrl}api/livejs/v1/customer/${apiPath}/carts`,
    {
      data: {
        "productId": id,
        "quantity": 1
      }
    })
    .then(function () {
      getCartList()
    })
    .catch(function (err) {
      alert(err.response.data.message || "資料取得失敗");
    })
};
productWrap.addEventListener("click", function (event) {
  if (event.target.classList.contains("addCardBtn")) {
    const productId = event.target.getAttribute("data-id");
    addCartItem(productId)
  }
})

//清空購物車
const discardAllBtn = document.querySelector(".discardAllBtn");
function deleteAllCart() {
  axios.delete(`${baseUrl}api/livejs/v1/customer/${apiPath}/carts`)
    .then(function () {
      getCartList()
    })
    .catch(function (err) {
      alert(err.response.data.message || "資料取得失敗");
    })
};
discardAllBtn.addEventListener("click", deleteAllCart);

//刪除單一商品
function deleteOderProduct(id) {
  axios.delete(`${baseUrl}api/livejs/v1/customer/${apiPath}/carts/${id}`)//帶變數進去一定要用樣板字面值//
    .then(function () {
      getCartList()
    })
    .catch(function (err) {
      alert(err.response.data.message || "資料取得失敗");
    })
};


cartProduct.addEventListener("click", function (event) {
  if (event.target.classList.contains("material-icons")) {
    const productId = event.target.getAttribute("data-id");
    deleteOderProduct(productId);
  }
});


//篩選功能
// products
const productSelect = document.querySelector(".productSelect");
function filterProducts() {
  let filterResult = [];
  products.forEach(function (item) {
    if (item.category === productSelect.value) {
      filterResult.push(item);
    } else if (productSelect.value === "全部") {
      filterResult.push(item);
    }
  });
  renderProductWrap(filterResult);
};

productSelect.addEventListener("change", filterProducts);
//筆記，為何要串API =>資安問題，存前端大家都能看得到，私人、機密的資料存在資料庫(後端管理)透過API請求資料回來