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
    <base-card>
        <h1>Barbers near you!</h1>
        <button @click="sortBarbers">Sort By Nearest</button>
        <div v-for="(barber, idx) in barbers" :key="idx">
            <h2>{{ barber.name }} is {{ barber.distance }} miles away from you.</h2>
        </div>
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
            barbers: [
                {'distance': 2, name: 'John'},
                {'distance': 4, name: 'Sarah'},
                {'distance': 7, name: 'Bill'},
                {'distance': 1, name: 'Joe'},
                {'distance': 8, name: 'Adriana'},
            ],
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
            console.log(inputId);
            const isActive = event.target.checked;
            const updatedFilters = {
                ...this.filters,
                [inputId]: isActive
            };
            console.log(updatedFilters);
            this.filters = updatedFilters;
            this.$emit('change-filter', updatedFilters);
        },
        sortBarbers() {
            let barbers = this.getDistances;
            let sortedBarbersDs = this.quickSort(barbers);
            for (let d in sortedBarbersDs) {
                for (let i=0;i<sortedBarbersDs; i++) {
                    if(this.barbers[d].distance == sortedBarbersDs[i]) {
                        
                    } 
                }
            }
        },
        quickSort(array) {
            if (array.length === 1) {
                return array;
            } 
            const pivot = array[array.length - 1];
            const leftArr = [];
            const rightArr = [];
            for (let i=0; i < array.length - 1; i++) {
                if (array[i] < pivot) {
                    leftArr.push(array[i]);
                } else {
                    rightArr.push(array[i]);
                }
            }

            if (leftArr.length > 0 && rightArr > 0) {
                return [...this.quickSort(leftArr), pivot, ...this.quickSort(rightArr)];
            } else if(leftArr.length > 0) {
                return [...this.quickSort(leftArr), pivot];
            } else {
                return [pivot, ...this.quickSort(rightArr)];
            }
        }
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