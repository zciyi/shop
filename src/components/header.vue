<template>
  <div class="M-header">
    {{msg}}
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
}
</style>
