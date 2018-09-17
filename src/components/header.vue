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
      msg: 'Welcom'
    }
  }
}
</script>
<style>
.M-header{
  background: #1182f3;
  height: 50px;
  line-height: 50px;
  color: #fff;
}
</style>
