<script>
import { Bubble, mixins } from "vue-chartjs";

export default {
  extends: Bubble,
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
