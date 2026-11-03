<template>
  <div class="container-fluid">
    <div class="row back">
      <div class="col-12">
        <NuxtLink to="/upload">
          <h1 style="font-size: 80px">Calliv</h1>
        </NuxtLink>
      </div>
      <div class="col-12">
        <h2>
          An app made with love by
          <a href="https://www.linkedin.com/in/iasisalomon/">Iasi Salomon</a>
        </h2>
      </div>
      <div class="col-12">
        <a href="https://github.com/iasisalomon">
          <button class="btn btn-primary">My Github</button>
        </a>
        <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
          <button class="btn btn-danger">Danger Zone</button>
        </a>
      </div>
      <div class="col-12">
        <NuxtLink to="/upload">
          <button class="btn btn-success">
            <span>GET STARTED!</span>
          </button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap");
.container-fluid {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-image: url("@/static/images/main.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

h2 {
  font-family: "Dancing Script", cursive;
  font-size: 40px;
}

.back {
  background: rgba(200, 200, 200, 0.8);
  min-width: 100%;
  padding: 50px;
  margin: 0px;
}
.btn {
  padding: 10px;
  margin: 10px;
  font-weight: bold;
}

.btn-success {
  padding: 30px;
  min-width: 200px;
}

.btn-success span {
  font-size: 30px;
  font-weight: bold;
}
</style>
