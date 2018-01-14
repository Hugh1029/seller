<template>
  <div>
    <div class="shopcart">
      <div class="content" @click="toggleList">
        <!--左边区域，自适应-->
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{'hightlight': totalCount>0}">
              <i class="icon-shopping_cart" :class="{'hightlight': totalCount>0}"></i>
            </div>
            <div class="num" v-show="totalCount>0">{{totalCount}}</div>
          </div>
          <!--价格-->
          <div class="price" :class="{'hightlight': totalCount>0}">¥{{totalPrice}}</div>
          <!--描述-->
          <div class="desc">另需配送费¥{{deliveryPrice}}元</div>
        </div>
        <!--右边区域，定宽-->
        <div class="content-right" @click.stop.prevent="pay">
          <div class="pay" :class="payClass">
            {{payDesc}}
          </div>
        </div>
      </div>
      <!--小球-->
      <div class="ball-container">
        <div class="ball" v-for="ball in balls" v-show="ball.show">
          <transition name="drop">
            <div class="inner inner-hook"></div>
          </transition>
        </div>
      </div>
      <!--列表-->
      <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="food" v-for="food in selectFoods">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>¥{{food.price*food.count}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food"></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="list-mask" @click="hideList" v-show="listShow"></div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  import BScroll from 'better-scroll';
  export default {
      props: {
          deliveryPrice: {
              type: Number,
              default: 1
          },
          minPrice: {
              type: Number,
              default: 1
          },
          selectFoods: {
              type: Array,
              default() {
                  return [
                    {
                      price: 10,
                      count: 1
                    }
                  ];
              }
          }
      },
      data() {
          return {
            payClass: 'not-enough',
            fold: true,
            balls: [{
                show: false
            },
              {
                show: false
              },
              {
                show: false
              },
              {
                show: false
              },
              {
                show: false
              }
            ],
            dropBalls: []
          };
      },
      computed: {
          totalPrice() {
              let total = 0;
              this.selectFoods.forEach((food) => {
                  total += food.count * food.price;
              });
              return total;
          },
          totalCount() {
              let count = 0;
              this.selectFoods.forEach((food) => {
                  count += food.count;
              });
              return count;
          },
          payDesc() {
              if (this.totalPrice === 0) {
                  this.payClass = 'not-enough';
                  return `¥${this.minPrice}元起送`;
              } else if (this.totalPrice < this.minPrice) {
                this.payClass = 'not-enough';
                  let diff = this.minPrice - this.totalPrice;
                  return `还差${diff}元起送`;
              } else {
                this.payClass = 'enough';
                  return '去结算';
              }
          },
          listShow() {
              if (!this.totalCount) {
                  this.fold = true;
                  return false;
              }
              let show = !this.fold;
              if (show) {
                  this.$nextTick(() => {
                    if (!this.scroll) {
                      this.scroll = new BScroll(this.$refs.listContent, {
                        click: true
                      });
                    } else {
                      this.scroll.refresh();
                    }
                  });
              }
              return show;
          }
      },
    methods: {
          drop(el) {
              for (let i = 0; i < this.balls.length; i++) {
                  let ball = this.balls[i];
                  if (!ball.show) {
                      ball.show = true;
                      ball.el = el;
                      this.dropBalls.push(ball);
                      return;
                  }
              }
          },
          toggleList() {
               console.log(this.fold);
              if (!this.totalCount) {
                  return;
              }
              this.fold = !this.fold;
          },
          empty() {
              this.selectFoods.forEach((food) => {
                  food.count = 0;
              });
          },
          hideList() {
              this.fold = true;
          },
          pay() {
              if (this.totalPrice < this.minPrice) {
                  return;
              }
              window.alert(`支付${this.totalPrice}元`);
          }
    },
    components: {
          cartcontrol
    },
    transitions: {
          drop: {
            beforeEnter(el) {
              let count = this.balls.lenght;
              while (count--) {
                  let ball = this.balls[count];
                  if (ball.show) {
                      let rect = ball.el.getBoundingClientRect();
                      let x = rect.left - 32;
                      let y = -(window.innerHeight - rect.top - 22);
                      el.style.display = '';
                      el.style.wekitTransform = `translate3d(0,${y},0)`;
                      el.style.transform = `translate3d(0,${y},0)`;
                      let inner = el.getElementsByClassName('inner-hook')[0];
                      inner.style.wekitTransform = `translate3d(${x},0,0)`;
                      inner.style.transform = `translate3d(${x},0,0)`;
                  }
              }
            },
            enter(el) {
              // let rf = el.offsetHeight;
              this.$nextTick(() => {
                el.style.wekitTransform = 'translate3d(0,0,0)';
                el.style.transform = 'translate3d(0,0,0)';
                let inner = el.getElementsByClassName('inner-hook')[0];
                inner.style.wekitTransform = 'translate3d(0,0,0)';
                inner.style.transform = 'translate3d(0,0,0)';
              });
            },
            afterEnter(el) {
              let ball = this.dropBalls.shift();
              if (ball) {
                  ball.show = false;
                  el.style.display = 'none';
              }
            }
          }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .shopcart
    position: fixed
    left: 0
    bottom: 0
    z-index: 50
    width: 100%
    height: 48px
    .content
      display: flex
      background-color: #141d27
      font-size: 0
      .content-left
        flex: 1
        .logo-wrapper
          display: inline-block
          position: relative
          top: -10px
          margin: 0 18px
          padding: 6px
          width: 56px
          height 56px
          box-sizing: border-box
          vertical-align: top
          border-radius: 50%
          .logo
            width: 100%
            height: 100%
            border-radius: 100%
            background-color: #2b343c
            text-align: center
            &.hightlight
              background-color: rgb(0,160,220)
            .icon-shopping_cart
              font-size: 24px
              line-height: 44px
              color: #80858a
              &.hightlight
                color: #fff
          .num
            position: absolute
            top: 0
            right: 0
            width: 24px
            height: 16px
            line-height: 16px
            text-align: center
            border-radius: 16px
            font-size: 9px
            font-weight: 700
            color: #fff
            background-color: rgb(240,20,20)
            box-shadow: 0 4px 8px 0 rgba(0,0,0,0.4)
        .price
          display: inline-block
          vertical-align: top
          line-height: 24px
          margin-top: 12px;
          box-sizing: border-box
          padding-right: 12px
          border-right: 1px solid rgba(255,255,255,0.1)
          font-size: 16px
          font-weight: 700
          color: #80858a
          &.hightlight
            color: #fff
        .desc
          display: inline-block
          vertical-align: top
          line-height: 24px
          margin: 12px 0 0 12px
          font-size: 12px
          color: #80858a
      .content-right
        flex: 0 0 105px
        width: 105px
        .pay
          height: 48px
          line-height: 48px
          text-align: center
          font-size: 12px
          color: #80858a
          font-weight: 700
          background-color: #2b333b
          &.not-enough
            background-color: #2b333b
          &.enough
            background-color: #00b43c
            color: #fff

    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        &.drop-transition
          transition: all .4s cubic-bezier(.49,-.29,-0.75,.41)
          .inner
            width: 16px
            height: 16px
            border-radius: 50%
            background-color: rgb(0,160,220)
            transition: all .4s linear

    .shopcart-list
      position: absolute
      top: 0;
      left: 0
      z-index: -1
      width: 100%
      transform: translateY(-100%)
      .list-header
        height: 40px
        line-height: 40px
        padding: 0 18px
        border-bottom: 1px solid rgba(7,17,27,0.1)
        background-color: #f3f5f7
        .title
          float: left
          font-size: 14px
          font-weight: 200
          color: rgb(7,17,27)
        .empty
          float: right
          font-size: 12px
          color: rgb(0,160,220)
      .list-content
        background-color: #fff
        max-height: 217px
        overflow: hidden
        padding: 0 18px
        .food
          position: relative
          box-sizing: border-box
          height: 48px
          padding: 12px 0
          border-bottom: 1px solid  rgba(7,17,27,.1)
          .name
            position: absolute
            left: 0
            font-size: 14px
            color: rgb(7, 17, 27)
            line-height: 24px
          .price
            position: absolute
            right: 90px
            bottom: 12px
            line-height: 24px
            font-size: 14px
            font-weight: 700
            color: rgb(240,20,20)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: -5px
            line-height: 24px
            margin: 0
            padding: 0
    .fold-enter-active,.fold-leave-active
      transition: all .5s
    .fold-enter, .fold-leave-to
      transform: translateY(0)
    .fold-enter-to, .fold-leave
      transform: translateY(-100%)


  .list-mask
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index: 40
    opacity: 1
    background-color: rgba(7,17,27,0.6)
    backdrop-filter: blur(10px)
  .fade-enter-active, .fade-leave-active
    transition: all .5s
  .fade-enter,.fade-leave-to
    background-color: rgba(7,17,27,0)
  .fade-enter-to,.fade-leave
    background-color: rgba(7,17,27,0.6)

</style>
