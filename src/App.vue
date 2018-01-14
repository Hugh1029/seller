<template>
  <div id="app">
    <div class="header">
      <v-header :seller="seller"></v-header>
    </div>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/rating">评价</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <div class="content">
      <router-view :seller="seller"></router-view>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import header from './components/header/header.vue';
  // import {urlParse} from 'common/js/util';
  const ERR_OK = 0;
  export default{
    components: {
      'v-header': header
    },
    data() {
        return {
            seller: {
                // id: (() => {
                //  let queryParam = urlParse();
                //  console.log(queryParam);
                //  return queryParam.id;
               //  })()*/
            }
        };
    },
    created() {
        this.$http.get('/api/seller').then(response => {
          // console.log(response.body);
          response = response.body;
          if (response.errno === ERR_OK) {
              this.seller = response.data;
          }
        });
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "./common/stylus/mixin.styl"
  #app
    .tab
      display: flex
      width: 100%
      height: 40px
      line-height: 40px

  .tab-item
    flex: 1
    text-align: center
    border-1px(rgba(7,17,27,0.1))

  & > a
    display: block
    font-size: 14px
    color: rgb(77, 85, 93)
    &.active
      color: rgb(240, 20, 20)

</style>
