<template>
  <div class="container-fluid">
    <Header />
    <StandardInput />
    <div class="row">
      <div class="col-12"><Linear /></div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header";
import StandardInput from "@/components/StandardInput";
import Linear from "@/components/graphs/Linear";
export default {
  components: { Header, StandardInput, Linear },
};
</script>

<style></style>
