<template>
    <section>
        <barber-filter @change-filter="setFilters"></barber-filter>
    </section>
    <section>
        <base-card>
            <div class="controls">
                <base-button mode="outline">Refresh</base-button>
                <base-button v-if="!isBarber" link to="/register">Register</base-button>
            </div>
            <ul v-if="hasBarbers"> 
                <barber-item v-for="barber in filteredBarbers" :key="barber.id" 
                    :id="barber.id" 
                    :first-name="barber.firstName" 
                    :last-name="barber.lastName" 
                    :rate="barber.hourlyRate" 
                    :areas="barber.areas">
                </barber-item>
            </ul>
            <h3 v-else>No Barbers found.</h3>
        </base-card>
    </section>
</template>

<script>
import BarberItem from '../../components/barbers/BarberItem.vue';
import BarberFilter from '../../components/barbers/BarberFilter.vue';

export default {
    components: {
        BarberItem,
        BarberFilter,
    },
    data() {
        return {
            activeFilters: {
                North: true,
                South: true,
                East: true,
                West: true,
            },
        }
    },
    computed: {
        isBarber() {
            return this.$store.getters['barbers/isBarber'];
        },
        filteredBarbers() {
            const barbers = this.$store.getters['barbers/barbers'];
            return barbers.filter(barber => {
                if(this.activeFilters.North && barber.areas.includes('North')) {
                    return true; 
                }
                if(this.activeFilters.South && barber.areas.includes('South')) {
                    return true; 
                }
                if(this.activeFilters.East && barber.areas.includes('East')) {
                    return true; 
                }
                if(this.activeFilters.West && barber.areas.includes('West')) {
                    return true; 
                }
                return false;
            });
        },
        hasBarbers() {
            return this.$store.getters['barbers/hasBarbers'];
        }
    },
    methods: { 
        setFilters(updatedFilters) {
            console.log(updatedFilters);
            this.activeFilters = updatedFilters;
        }
    }
}
</script>

<style scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.controls {
  display: flex;
  justify-content: space-between;
}
</style>