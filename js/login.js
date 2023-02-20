//匯入 Vue CDN 套件
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.45/vue.esm-browser.min.js';

const app = createApp({
  data() {
    return {
      user: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    login() {
      axios.post(`${url}/admin/signin`, this.user)
      .then(res => {
        const { expired, token } = res.data;
        document.cookie = `hexToken=${token}; expires=${new Date(expired)};`; //透過 new Date()將到期日轉為時間格式

        // 轉址到產品頁面
        window.location = "./product.html";
      }).catch(err => {
        alert(err.data.message);
      })
    }
  }
})

app.mount('#app');