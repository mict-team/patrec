<template>
  <div>Drug lists</div>
</template>

<script>
export default {
  data: () => ({
    drawer: null,
    loadingDialog: false,
    message: "",
    failed: false,
    lists: []
  }),
  methods: {
    setList: function() {
      this.list = [{ revenue: 1, name: "hchcgrcgrcr" }];
    }
  },
  mounted() {}
};
</script>

<style></style>
