//匯入 Vue CDN 套件
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.45/vue.esm-browser.min.js';

// 全域需要使用到，元件化時才會用到
let productModal = {};
let delProductModal = {};


// 1. 建立元件
// 2. 生成 vue 元件
// 3. 渲染至畫面上
const app = createApp({
  data() {
    return {
      products: [],
      tempProduct: {
        imagesUrl: []
      },
      isNew: false, // 確認是編輯或新增所使用; 新增-> isNew:true, 編輯-> isNew:false 
    }
  },
  methods: {
    // 驗證登入狀態
    checkLogin() {
      axios.post(`${url}/api/user/check`)
      .then(res => {
        this.getAllProducts();
      }).catch(err => {
        console.log(err);
      })
    },
    // 取得產品列表
    getAllProducts() {
      axios.get(`${url}/api/${api_path}/admin/products/all`)
        .then((res)=> {
          this.products = res.data.products;
        }).catch((err) => {
          alert(err.data.message);
        })
    },
    // 新增圖片
    createImagesUrl() {
      if(!this.tempProduct.imagesUrl) {
        this.tempProduct.imagesUrl = [];
      }
      this.tempProduct.imagesUrl.push('');
    },
    // 刪除圖片
    deleteImagesUrl() {
      this.tempProduct.imagesUrl.pop();
    },
    // 新增 & 編輯 產品 (新增和編輯的邏輯相同)
    updateProduct() {
      // POST : 用於新增產品
      // PUT : 用於編輯產品
      let urlPath = `${url}/api/${api_path}/admin/product`;
      // 用 this.isNew 判斷 API 要怎麼運行
      let http = 'post';
      if (!this.isNew) {
        urlPath = `${url}/api/${api_path}/admin/product/${this.tempProduct.id}`;
        http = 'put';
      }
      axios[http](urlPath, { data:this.tempProduct })
        .then(() => {
          this.getAllProducts();
          productModal.hide(); //關閉 Modal
        }).catch((err) => {
          alert(err.data.message);
        })
    },
    // 刪除產品
    deleteProduct() {
      axios.delete(`${url}/api/${api_path}/admin/product/${this.tempProduct.id}`)
      .then((res)=> {
        alert(res.data.message);
        delProductModal.hide(); //關閉 Modal
        this.getAllProducts();
      }).catch((err) => {
        alert(err.data.message);
      })
    },
    //打開 Modal
    openModal(status, product) {
      if(status === 'create'){ //建立產品
        productModal.show();
        this.isNew = true;
        // 帶入初始化資料
        this.tempProduct = {
          imagesUrl: [],
        }
      } else if(status === 'modify') { //編輯產品
        this.isNew = false;
        // 會帶入當前要編輯的資料
        productModal.show();
        this.tempProduct = { ...product }; //使用展開語法 ... , 則不會直接異動到原先資料
      } else if(status === 'delete') { // 刪除產品
        this.tempProduct = { ...product }; // 主要作為取得 id 使用
        delProductModal.show();
      }
    }
  },
  mounted() {
    // 將 cookie 取出來 (MDN 文件提供的方式)
    const cookieValue = document.cookie
    .split('; ')
    .find((row) => row.startsWith('hexToken='))
    ?.split('=')[1];
    // 透過 axios 將token(即取出的cookie值) 發送到headers
    axios.defaults.headers.common['Authorization'] = cookieValue;
    this.checkLogin();

    // Bootstrap 方法取得 modal
    productModal = new bootstrap.Modal('#productModal');
    delProductModal = new bootstrap.Modal('#delProductModal');
  }
})

app.mount('#app');