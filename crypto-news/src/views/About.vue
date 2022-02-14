<template>
  <div class="about">
    <b-form class="container" @submit="onSubmit" @reset="onReset">
      <h1>Set up get email alerts!</h1>
      <b-form-group
        id="input-group-1"
        label="Email address:"
        label-for="input-1"
        description="We'll never share your email with anyone else."
      >
        <b-form-input
          id="input-1"
          v-model="form.email"
          type="email"
          placeholder="Enter email"
          required
        ></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-2" label="Ticker:" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="form.ticker"
          placeholder="Enter TICKER symbol"
          required
        ></b-form-input>
      </b-form-group>
      <b-button class="mt-3" @click="getAlerts">Get Alert</b-button>
    </b-form>
    <div v-if="show">
      <h1>There is a  {{ percentageD }}% Price Difference in the Stock.</h1>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      stockEndpoint: "https://www.alphavantage.co/query",
      stockParams: {
        function : "TIME_SERIES_DAILY",
        symbol: "TSLA",
        apikey: process.env.VUE_APP_ALPHAVANTAGE,
      },
      percentageD: 0,
      form: {
        email: '',
        ticker: ''
      },
      show: false
    }
  },
  methods: {
    getAlerts(symbol) {  
      this.axios.get(this.stockEndpoint, {params: {
          function : "TIME_SERIES_DAILY",
          symbol: symbol,
          apikey: process.env.VUE_APP_ALPHAVANTAGE,
        }}).then((res) => {

          let dailyTimeSeries = res.data["Time Series (Daily)"];
          let stockData = [];
          for (let data in dailyTimeSeries) {
            stockData.push(dailyTimeSeries[data]);
          }

          let percentageD = this.calculatePercentageD(stockData);
          this.show = true;
          return percentageD;
      })
    },
    onSubmit(event) {
        event.preventDefault()
        let symbol = event.target[1].value;
        this.percentageD = this.getAlerts(symbol);  
        console.log(this.percentageD);
      },
      onReset(event) {
        event.preventDefault()
        // Reset our form values
        this.form.email = ''
        // Trick to reset/clear native browser form validation state
        this.show = false
        this.$nextTick(() => {
          this.show = true
        })
      },
    calculatePercentageD(stockData) {
        // console.log('stock', stockData);
        let percentageD = 0;
        if (stockData.length > 0) {
          let yesterdayClosingPrice = stockData[0]["4. close"];
          let dayBeforeYesterdayClosingPrice = stockData[1]["4. close"];
          let d = Math.abs(parseFloat(yesterdayClosingPrice) - parseFloat(dayBeforeYesterdayClosingPrice));
          percentageD = d / yesterdayClosingPrice * 100;
        } 
        return percentageD;
    }
  }
}
</script>