<template>
  <div class="container-fluid">
    <Header />
    <TableNav item1="Sorted Data" item2="Data Average" />
    <SortedDataTable v-if="activeTableNav === 1" />
    <AverageDataTable v-if="activeTableNav === 2" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Header from "@/components/Header";
import AverageDataTable from "@/components/tables/AverageDataTable";
import SortedDataTable from "@/components/tables/SortedDataTable";
import TableNav from "@/components/tables/TableNav";
export default {
  components: { Header, SortedDataTable, AverageDataTable, TableNav },
  computed: {
    ...mapGetters("tables", ["activeTableNav"]),
  },
  methods: {},
};
</script>

<style></style>
