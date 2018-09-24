<template>
  <div class="M-header">
    <span class="M-headerCon">{{msg}}</span>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'CARSYDA'
    }
  }
}
</script>
<style>
.M-header{
  background: #0D0D0D;
  height: 50px;
  line-height: 50px;
  color: #fff;
  text-align: left;
  
}
.M-headerCon{
    display: inline-block;
    text-align: center;
    min-width: 160px;
  }
</style>
