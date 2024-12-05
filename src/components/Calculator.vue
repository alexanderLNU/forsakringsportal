<!-- eslint-disable no-console -->
<template>
    <div class="calculator">
        <h1>Premieberäknare - Bilar</h1>
        <form @submit.prevent="calculatePremium">
            <!-- Ålder -->
            <div class="form-group">
                <label for="age">Ålder</label>
                <input type="number" id="age" v-model.number="age" min="18" required />
            </div>
            <!-- Kön -->
            <div class="form-group">
                <label for="gender">Kön</label>
                <select id="gender" v-model="gender" required>
                    <option value="">Välj ditt kön</option>
                    <option value="male">Man</option>
                    <option value="female">Kvinna</option>
                </select>
            </div>
                <!-- Fabrikat -->
            <div class="form-group">
                <label for="make">Bilfabrikat</label>
                <select id="make" v-model="selectedMake" @change="fetchModels" required>
                    <option value="">Välj fabrikat</option>
                    <option v-for="make in makes" :key="make.make_id" :value="make.make_display">
                        {{ make.make_display }}
                    </option>
                </select>
            </div>
            <!-- Modell -->
            <div class="form-group" v-if="models.length > 0">
                <label for="model">Modell</label>
                <select name="model" id="model" v-model="selectedModel" required>
                    <option value="">Välj modell</option>
                    <option v-for="(model, index) in models" :key="index" :value="model.model_name">
                        {{ model.model_name }}
                    </option>
                </select>
            </div>
            <!-- Omfattning -->
             <div class="form-group">
              <div class="coverage-options">
                <input type="radio" id="trafik" value="trafik" v-model="coverageType" />
                <label for="trafik" class="coverage-label">Trafikförsäkring</label>

                <input type="radio" id="halv" value="halv" v-model="coverageType" />
                <label for="halv" class="coverage-label">Halvförsäkring</label>

                <input type="radio" id="hel" value="hel" v-model="coverageType" />
                <label for="hel" class="coverage-label">Helförsäkring</label>
              </div>
             </div>
             <!-- Tilläggsförsäkringar -->
             <div class="form-group">
              <label class="addons-header">Behöver du utöka skyddet?🛡️</label>
              <!-- Djurkollision -->
              <label class="addon-label" :class="{ 'selected': addons.animalCollision }">
                <input type="checkbox" v-model="addons.animalCollision" />
                <span>
                  🐾
                  <span>Djurkollision</span>
                </span>
              </label>

              <!-- Hyrbil -->
              <label class="addon-label" :class="{ 'selected': addons.rentalCar }">
                <input type="checkbox" v-model="addons.rentalCar" />
                <span>
                  🚗
                  <span>Hyrbil</span>
                </span>
              </label>

              <!-- Assistans -->
              <label class="addon-label" :class="{ 'selected': addons.assistance }">
                <input type="checkbox" v-model="addons.assistance" />
                <span>
                  🛠️
                  <span>Assistans</span>
                </span>
              </label>

            </div>
            <!-- Körsträcka -->
             <div class="form-group">
                <label for="annualMilage">Årlig körsträcka (km)</label>
                <select id="annualMilage" v-model.number="annualMilage" required>
                <option value="">Väl årlig körsträcka</option>
                <option :value="5000">1 - 5000 km</option>
                <option :value="10000">5000 - 10 000 km</option>
                <option :value="15000">10 001 - 15 000 km</option>
                <option :value="20000">15 001 - 20 000 km</option>
                <option :value="25000">20 001 - 25 000 km</option>
                <option :value="30000">25 001 - 30 000 km</option>
                <option :value="50000">Obegränsade mil</option>
              </select>
             </div>
             <!-- Antal skador -->
              <div class="form-group">
                <label for="claims">Antal skador de senaste 3 åren</label>
                <input type="number" id="claims" v-model.number="claims" min="0" required />
              </div>
              <!-- Postnummer -->
             <div class="form-group">
               <label for="postalCode">Postnummer</label>
               <input type="text" id="postalCode" v-model="postalCode" required />
             </div>
              <!-- Ort -->
              <div class="form-group" v-if="city">
                <label for="city">Ort</label>
                <input type="text" id="city" v-model="city" readonly />
              </div>
              <!-- Beräkna premie -->
              <button type="submit">Beräkna premie</button>
        </form>
        <!-- Resultat -->
        <div v-if="premium !== null" class="result" ref="resultSection">
          <h2>Din beräknade premie är: {{ premium }} kr/ per år</h2>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import jsonpAdapter from 'axios-jsonp';

function debounce(func, wait) {
  let timeout;
  // eslint-disable-next-line func-names
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

export default {
  name: 'Calculator',
  data() {
    return {
      // Users input
      age: null,
      gender: '',
      selectedMake: '',
      selectedModel: '',
      annualMilage: null,
      claims: 0,
      postalCode: '',
      city: '',
      premium: null,
      coverageType: '',

      addons: {
        animalCollision: false,
        rentalCar: false,
        assistance: false,
      },

      makes: [],
      models: [],
    };
  },
  created() {
    this.fetchMakes();
  },
  watch: {
    // eslint-disable-next-line func-names
    postalCode: debounce(function (newPostalCode) {
      if (newPostalCode && newPostalCode.length >= 5) {
        this.fetchCity();
      } else {
        this.city = '';
      }
    }, 500), // Väntar 500ms efter senaste inmatningen
  },
  methods: {
    async fetchMakes() {
      try {
        const response = await axios({
          url: 'https://www.carqueryapi.com/api/0.3/?cmd=getMakes',
          adapter: jsonpAdapter,
        });
        this.makes = response.data.Makes;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Fel vid hämtning av bilmärken:', error);
      }
    },
    async fetchModels() {
      this.selectedModel = '';
      this.models = [];
      if (!this.selectedMake) return;

      try {
        const response = await axios({
          url: `https://www.carqueryapi.com/api/0.3/?cmd=getModels&make=${this.selectedMake}`,
          adapter: jsonpAdapter,
        });
        if (response.data.Models && response.data.Models.length > 0) {
          this.models = response.data.Models;
        } else {
          this.models = [];
        }

        if (this.models.length > 0) {
          // eslint-disable-next-line no-console
          console.log('Första modellen:', this.models[0]);
        } else {
          // eslint-disable-next-line no-console
          console.log('Inga modeller hittades för valt fabrikat.');
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Fel vid hämtning av modeller:', error);
        this.models = [];
      }
    },
    // Get city based on postal code
    async fetchCity() {
      if (!this.postalCode || this.postalCode.length < 5) {
        this.city = '';
        return;
      }

      try {
        const response = await fetch(`https://api.zippopotam.us/se/${this.postalCode}`);
        if (!response.ok) throw new Error('Postnummer hittades inte.');

        const data = await response.json();
        if (data.places && data.places.length > 0) {
          this.city = data.places[0]['place name'];
        } else {
          this.city = '';
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Fel vid hämtning av stad:', error);
        this.city = '';
      }
    },
    // Calculate the premium
    async calculatePremium() {
      this.premium = null;

      if (!this.fetchCity && this.postalCode) {
        await this.fetchCity();
      }

      // Kontrollera igen om city fortfarande är tom efter hämtning
      if (!this.city) {
        // eslint-disable-next-line no-alert
        alert('Kunde inte hämta orten för det angivna postnumret.');
        return;
      }

      // Kontrollera att alla obligatoriska fält är ifyllda
      if (
        !this.age
        || !this.gender
        || !this.selectedMake
        || (!this.selectedModel && this.models.length > 0)
        || !this.annualMilage
        || !this.postalCode
        || !this.city
        || !this.coverageType
      ) {
        return;
      }
      let basePremium = 1000;

      // Baserat på försäkringsomfattning
      switch (this.coverageType) {
        case 'trafik':
          basePremium += 500;
          break;
        case 'halv':
          basePremium += 1500;
          break;
        case 'hel':
          basePremium += 3500;
          break;
        default:
          break;
      }

      // Justera baserat på tilläggsförsäkringar
      if (this.addons.animalCollision) {
        basePremium += 100;
      }
      if (this.addons.rentalCar) {
        basePremium += 450;
      }
      if (this.addons.assistance) {
        basePremium += 600;
      }

      // Justera baserat på ålder
      if (this.age < 25) {
        basePremium += 1500;
      } else if (this.age > 65) {
        basePremium += 500;
      }

      // Baserat på val av kön med ålder.
      if (this.gender === 'male' && this.age < 25) {
        basePremium += 1000;
      } else if (this.gender === 'female' && this.age < 25) {
        basePremium += 500;
      } else {
        basePremium += 200;
      }

      // Baserat på körsträcka
      if (this.annualMilage > 30000) {
        basePremium += 3000;
      } else if (this.annualMilage > 25000) {
        basePremium += 2200;
      } else if (this.annualMilage > 20000) {
        basePremium += 1800;
      } else if (this.annualMilage > 20000) {
        basePremium += 1400;
      } else if (this.annualMilage > 15000) {
        basePremium += 1000;
      } else if (this.annualMilage > 10000) {
        basePremium += 800;
      } else if (this.annualMilage > 5000) {
        basePremium += 600;
      } else {
        basePremium += 200;
      }

      // Baserat på antal skador
      basePremium += this.claims * 1500;

      // Baserat på fabrikat och modell
      if (this.selectedMake === 'BMW' || this.selectedMake === 'Mercedes-Benz' || this.selectedMake === 'Audi') {
        basePremium += 1000;
      } else if (this.selectedMake === 'Volvo' || this.selectedMake === 'Saab') {
        basePremium += 500;
      } else if (this.selectedMake === 'Toyota' || this.selectedMake === 'Honda') {
        basePremium -= 400;
      } else {
        basePremium += 200;
      }

      // Baserat på ort
      if (this.city.toLowerCase() === 'stockholm') {
        basePremium += 1000;
      } else if (this.city.toLowerCase() === 'göteborg') {
        basePremium += 1000;
      } else if (this.city.toLowerCase() === 'malmö') {
        basePremium += 1000;
      } else {
        basePremium += 400;
      }

      this.premium = basePremium;

      // Scrolla till resultatsektionen
      this.$nextTick(() => {
        if (this.$refs.resultSection) {
          this.$refs.resultSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    },
  },
};
</script>

<style scoped>
body {
  background-color: #f5f5f5;
  font-family: Arial, sans-serif;
}

.calculator {
  max-width: 600px;
  margin: 40px auto;
}

.calculator h1 {
  color: #003E23;
  text-align: center;
  margin-bottom: 30px;
}

form {
  background-color: #ffffff;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
}

.form-group {
  margin-bottom: 20px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #003E23;
}

input,
select {
  width: 100%;
  max-width: 600px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  margin: 0 auto;
}

input:focus,
select:focus {
  outline: none;
  border-color: #44a748;
  box-shadow: 0 0 5px rgba(68, 167, 72, 0.5);
}

button {
  background-color: #44a748;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  padding: 12px 20px;
  font-size: 18px;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #33853e;
}

.coverage-options {
  display: flex;
  justify-content: space-between;
}

.coverage-label {
  flex: 1;
  text-align: center;
  padding: 15px;
  border: 2px solid #ccc;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, border-color 0.3s ease;
  margin: 0 5px;
}

.coverage-label:hover {
  border-color: #44a748;
}

.coverage-options input[type="radio"] {
  display: none;
}

.coverage-options input[type="radio"]:checked + .coverage-label {
  background-color: #44a748;
  color: white;
  border-color: #44a748;
}

.addons {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.addon-label {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f8f8f8;
  padding: 15px;
  border: 2px solid #ccc;
  border-radius: 6px;
  cursor: pointer;
  transition: border-color 0.3s ease, background-color 0.3s ease;
  text-align: center;
}

.addon-label:hover {
  border-color: #44a748;
}

/* Göm checkboxen */
.addon-label input[type="checkbox"] {
  display: none;
}

/* Markerad box med tjock grön kant */
.addon-label input[type="checkbox"]:checked ~ .addon-label {
  border: 4px solid #276a39;
}

.addon-label input[type="checkbox"]:checked + span {
  color: #276a39;
}

.addon-label span {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  color: inherit;
}

.addons-header {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.result {
  margin-top: 30px;
  background-color: #e0f0e9;
  padding: 20px;
  border-radius: 5px;
  border: 1px solid #44a748;
}

.result h2 {
  margin: 0;
  color: #003E23;
  text-align: center;
}
.addon-label.selected {
  border: 4px solid #276a39;
}

</style>
