<script>
import { Bar, mixins } from "vue-chartjs";

export default {
  extends: Bar,
  mixins: [mixins.reactiveProp],
  props: {
    chartData: {
      type: Object,
      default: null
    }
  },
  mounted() {
    this.renderChart(this.chartdata, {
      responsive: true,
      maintainAspectRatio: false
    });
  }
};
</script>
