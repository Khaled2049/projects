<template>
    <base-card>
    <h2>Find a Barber</h2>
    <span class="filter-option">
        <input type="checkbox" id="North" checked @change="setFilter"/>
        <label for="North">North</label>
    </span>
    <span class="filter-option">
        <input type="checkbox" id="South" checked @change="setFilter"/>
        <label for="South">South</label>
    </span>
    <span class="filter-option">
        <input type="checkbox" id="East" checked @change="setFilter"/>
        <label for="East">East</label>
    </span>
    <span class="filter-option">
        <input type="checkbox" id="West" checked @change="setFilter"/>
        <label for="West">West</label>
    </span>    
    </base-card>
</template>

<script>
export default {
    emits: ['change-filter'],
    data() {
        return {
            filters: {
                North: true,
                South: true, 
                East: true, 
                West: true,
            },
        }
    },
    computed: {
        getDistances() {
            let barberDistances = [];
            for (let barber in this.barbers) {
                barberDistances.push(this.barbers[barber].distance);
            }
            return barberDistances;
        }
    },
    methods: {
        setFilter(event) {
            const inputId = event.target.id;
            const isActive = event.target.checked;
            const updatedFilters = {
                ...this.filters,
                [inputId]: isActive
            };            
            this.filters = updatedFilters;
            this.$emit('change-filter', updatedFilters);
        },
        sortBarbers() {
            let barbers = this.getDistances;
            let sortedBarbersDs = this.quickSort(barbers);
            for (let d in sortedBarbersDs) {
                for (let i=0;i<sortedBarbersDs; i++) {
                    if(this.barbers[d].distance == sortedBarbersDs[i]) {
                        console.log('test');    
                    } 
                }
            }
        },
    }
}
</script>

<style scoped>
h2 {
  margin: 0.5rem 0;
}

.filter-option {
  margin-right: 1rem;
}

.filter-option label,
.filter-option input {
  vertical-align: middle;
}

.filter-option label {
  margin-left: 0.25rem;
}

.filter-option.active label {
  font-weight: bold;
}
</style>