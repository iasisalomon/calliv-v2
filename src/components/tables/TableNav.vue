<template>
  <div>
    <b-nav pills>
      <b-nav-item :active="activeTableNav === 1" @click="active1()">{{ item1 }}</b-nav-item>
      <b-nav-item :active="activeTableNav === 2" @click="active2()">{{ item2 }}</b-nav-item>
    </b-nav>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
export default {
  props: {
    item1: {
      type: String,
      default: "Navigation Item",
    },
    item2: {
      type: String,
      default: "Navigation Item",
    },
    item3: {
      type: String,
      default: "Navigation Item",
    },
  },
  computed: {
    ...mapGetters("tables", ["activeTableNav"]),
  },
  methods: {
    active1() {
      this.$store.dispatch("tables" + "/changeActiveTableNav", 1)
    },
    active2() {
      this.$store.dispatch("tables" + "/changeActiveTableNav", 2)
    },
  },
}
</script>

<style></style>
