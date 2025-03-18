<template>
  <div class="netmask-calculator">
    <h3 class="section-title">Утилита расчета маски подсети</h3>
    <div class="input-group">
      <label for="ip-input">Введите IP-адрес:</label>
      <input id="ip-input" type="text" v-model="ipAddress" placeholder="192.168.1.1" />
      <button @click="calculateMask">Рассчитать маску</button>
    </div>
    <div v-if="subnetMask" class="result">
      <p>Маска подсети: <strong>{{ subnetMask }}</strong></p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NetmaskCalculator',
  data() {
    return {
      ipAddress: '',
      subnetMask: ''
    };
  },
  methods: {
    calculateMask() {
      const ipParts = this.ipAddress.split('.').map(Number);
      if (ipParts.length === 4 && ipParts.every(part => part >= 0 && part <= 255)) {
        const cidrToMask = {
          32: '255.255.255.255',
          31: '255.255.255.254',
          30: '255.255.255.252',
          29: '255.255.255.248',
          28: '255.255.255.240',
          27: '255.255.255.224',
          26: '255.255.255.192',
          25: '255.255.255.128',
          24: '255.255.255.0',
          23: '255.255.254.0',
          22: '255.255.252.0',
          21: '255.255.248.0',
          20: '255.255.240.0',
          19: '255.255.224.0',
          18: '255.255.192.0',
          17: '255.255.128.0',
          16: '255.255.0.0',
          15: '255.254.0.0',
          14: '255.252.0.0',
          13: '255.248.0.0',
          12: '255.240.0.0',
          11: '255.224.0.0',
          10: '255.192.0.0',
          9: '255.128.0.0',
          8: '255.0.0.0',
          7: '254.0.0.0',
          6: '252.0.0.0',
          5: '248.0.0.0',
          4: '240.0.0.0',
          3: '224.0.0.0',
          2: '192.0.0.0',
          1: '128.0.0.0',
          0: '0.0.0.0'
        };

        // Пример: здесь можно добавить логику для определения CIDR
        // Для простоты, предположим, что пользователь вводит CIDR в формате /24
        const cidr = 24; // Замените это на логику для получения CIDR от пользователя

        this.subnetMask = cidrToMask[cidr] || 'Некорректный CIDR';
      } else {
        alert('Введите корректный IP-адрес.');
        this.subnetMask = '';
      }
    }
  }
}
</script>

<style scoped>
.input-group {
  margin-bottom: 16px;
}

.result {
  margin-top: 10px;
  font-weight: bold;
}
</style>
