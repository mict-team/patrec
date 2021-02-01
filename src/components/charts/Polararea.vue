<script>
import { Polararea, mixins } from "vue-chartjs";

export default {
  extends: Polararea,
  mixins: [mixins.reactiveProp],
  props: {
    chartData: {
      type: Object,
      default: null
    },
    labels: {
      type: Object,
      default: null
    }
  },
  mounted() {
    var option = {
      responsive: true,
      legend: {
        position: "right"
      },
      title: {
        display: true,
        text: "Chart.js Polar Area Chart"
      },
      scale: {
        ticks: {
          beginAtZero: true
        },
        reverse: false
      },
      animation: {
        animateRotate: false,
        animateScale: true
      }
    };
    this.renderChart(this.chartdata, {
      responsive: true,
      maintainAspectRatio: false
    });
  }
};
</script>
