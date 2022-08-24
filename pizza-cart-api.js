document.addEventListener('alpine:init', () => {
    
    Alpine.data('pizzaCartWithAPIWidget', function () {
        return {
            init() {
                
                axios
                    .get('https://pizza-cart-api.herokuapp.com/api/pizzas')
                    .then((result) => {
                        this.pizzas = result.data.pizzas
                    })
                    .then(() => {
                        return this.createCart();
                    })
                    .then((result) => {
                        
                        this.cartId = result.data.cart_code;
                    });
            },
            createCart() {
            
                return axios.get('https://pizza-cart-api.herokuapp.com/api/pizza-cart/create?username=' + this.username)
            },
            showCart() {
                const url = `https://pizza-cart-api.herokuapp.com/api/pizza-cart/${this.cartId}/get`;
                axios
                    .get(url)
                    .then((result) => {
                        this.cart = result.data;
                    });
            },
            
           
            message: '',
            username: '',
            pizzas: [],
            cartId: '',
            cart: { total: 0 },
            payNow: false,
            paymentAmount: 0,
            paymentMessage: '',
            checkout: false,
            featuredItems: '',
            display: true,

            add(pizza) {
               
                const params = {
                    cart_code: this.cartId,
                    pizza_id: pizza.id
                }
                axios
                    .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/add', params)
                    .then(() => {
                        //this.message = alert("Pizza added to the cart!")
                        this.showCart();
                    })
                    .catch(err => alert(err));
                
            },

            remove(pizza){
                
                const params = {
                  cart_code : this.cartId,
                  pizza_id : pizza.id
                }
                axios
                  .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/remove', params)
                  .then(()=>{
                    //this.message= alert("Pizza removed from the cart")
                    this.showCart();
                  })
                  .catch(err=>alert(err));
              },

              pay(pizza){
                const params = {
                  cart_code : this.cartId,
                }
                axios
                  .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/pay', params)
                  .then(()=>{
                      if(!this.paymentAmount){
                          this.paymentMessage = 'No amount entered!'
                          setTimeout(() => {
                            this.payNow = ''
                        }, 3000);
                      }
                      else if(this.paymentAmount >= this.cart.total.toFixed(2)){
                          this.paymentMessage = 'Payment Sucessful!'
                          this.message= this.username  + " Paid!"
                          setTimeout(() => {
                              this.cart.total = ''
                              this.payNow = ''
                              this.cart = ''
                          }, 3000);
                      }else{
                          this.paymentMessage = 'Insufficient fund sorry!!!'
                          setTimeout(() => {
                              this.cart.total = ''
                              this.payNow = ''
                          }, 3000);
                      }
                  })
                  .catch(err=>alert(err));
              },
        }
    });
})
