<template>
    <div>
      <div ref="chart"></div>
    </div>
  </template>
  
  <script>
  export default {
    props: ['data'],
    mounted() {
      this.chart = c3.generate({
        bindto: this.$refs.chart,
        data: {
          json: this.data,
          keys: {
            x: 'name',
            value: ['count']
          },
          type: 'bar'
        },
        axis: {
          x: {
            type: 'category'
          }
        },
        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 500
              },
              chartOptions: {
                legend: {
                  position: 'bottom'
                }
              }
            }
          ]
        }
      });
    },
    beforeDestroy() {
      this.chart.destroy();
    }
  }
  </script>
  