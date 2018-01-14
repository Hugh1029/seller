<template>
  <div class="ratingselect">
    <div class="rating-type border-1px">
      <span @click="select(2,$event)" class="block positive" :class="{'active':selectType===2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
      <span @click="select(0,$event)" class="block positive" :class="{'active':selectType===0}">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
      <span @click="select(1,$event)" class="block negative" :class="{'active':selectType===1}">{{desc.negative}}<span class="count">{{negative.length}}</span></span>
    </div>
    <div class="switch" :class="{'on':onlyContent}" @click="toggleContent">
      <span class="icon-check_circle "></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
   const POSITIVE = 0;
   const NEGATIVE = 1;
     const ALL = 2;
  export default {
    props: {
      ratings: {
        type: Array,
        default() {
          return [];
        }
      },
      selectType: {
        type: Number,
        default: ALL
      },
      onlyContent: {
        type: Boolean,
        default: false
      },
      desc: {
        type: Object,
        default() {
            return {
              all: '全部',
              positive: '满意',
              negative: '不满意'
            };
        }
      }
    },
    methods: {
        select(type, event) {
            if (!event._constructed) {
                return;
            }
            this.$emit('changSelectType', type);
        },
      toggleContent(event) {
        if (!event._constructed) {
          return;
        }
        this.$emit('toggleContent');
      }
    },
    computed: {
        positives() {
            return this.ratings.filter((rating) => {
                return rating.rateType === POSITIVE;
            });
        },
        negative() {
            return this.ratings.filter((rating) => {
              return rating.rateType === NEGATIVE;
            });
        }
    }

  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .ratingselect
    .rating-type
      padding: 18px 0
      margin: 0 18px
      vertical-align: middle
      border-bottom: 1px solid rgba(7,17,27,0.1)
      font-size: 0
      .block
        display: inline-block
        padding: 8px 12px
        border-radius: 2px
        margin-right: 8px
        font-size: 12px
        line-height: 16px
        .count
          font-size: 8px
          margin-left: 2px
        &.positive
          color: rgb(77,85,93)
          background-color: rgba(0,160,220,0.2)
          &.active
            background-color: rgb(0,160,220)
            color: #fff
        &.negative
          background-color: rgba(70,85,93,0.2)
          color: rgb(77,85,93)
          &.active
            background-color: rgb(77,85,93)
            color: #fff



    .switch
      width: 100%
      padding: 6px 18px 8px
      line-height: 24px
      border-bottom: 1px solid rgba(7,17,27,0.1)
      color: rgb(147,153,159)
      font-size: 0
      display: inline-block
      &.on
        .icon-check_circle
          color: #00c850
      .icon-check_circle
        vertical-align: top
        margin-right: 4px
        font-size: 24px
      .text
        vertical-align: top
        font-size: 12px
        line-height: 24px


</style>
