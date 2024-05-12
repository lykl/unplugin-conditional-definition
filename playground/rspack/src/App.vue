<template>
  <div class="content">
    <!-- #ifdef MOBILE -->
    <h1>Rsbuild with Vue</h1>
    <!-- #endif -->
    <p>Start building amazing things with Rsbuild.</p>
  </div>
</template>

<style scoped>
/* #ifdef MOBILE */
.content {
}
/* #endif */
.content {
  display: flex;
  min-height: 100vh;
  line-height: 1.1;
  text-align: center;
  flex-direction: column;
  justify-content: center;
}

.content h1 {
  font-size: 3.6rem;
  font-weight: 700;
}

.content p {
  font-size: 1.2rem;
  font-weight: 400;
  opacity: 0.5;
}
</style>
