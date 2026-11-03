<template>
  <div>
    <b-navbar :sticky="true" toggleable="lg" type="dark" variant="info">
      <NuxtLink to="/">
        <b-navbar-brand>Calliv</b-navbar-brand>
      </NuxtLink>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <NuxtLink to="/upload"><b-nav-text>Upload</b-nav-text></NuxtLink>
          <NuxtLink to="/tables"><b-nav-text>Tables</b-nav-text></NuxtLink>
          <NuxtLink to="/matrixes"><b-nav-text>Matrixes</b-nav-text></NuxtLink>
          <NuxtLink to="/graphs"
            ><b-nav-text>Linear Regression</b-nav-text></NuxtLink
          >
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <!-- <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown text="About this App" right>
            <b-dropdown-item href="#">EN</b-dropdown-item>
            <b-dropdown-item href="#">ES</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav> -->
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.navbar-text {
  margin: 5px;
  font-weight: bold;
  color: #fff;
}
</style>
