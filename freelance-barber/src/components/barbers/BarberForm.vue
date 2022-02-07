<template>
    <form @submit.prevent="submitForm">
        <div class="form-control">
            <label for="firsname">Firsname</label>
            <input type="text" v-model.trim="firstName" id="firstname"> 
        </div>
        <div class="form-control">
            <label for="lastname">lastname</label>
            <input type="text" v-model.trim="lastName" id="lasttname"> 
        </div>
        <div class="form-control">
            <label for="description">Description</label>
            <input type="text" v-model.trim="description" rows="5" id="description"> 
        </div>
        <div class="form-control">
            <label for="rate">Hourly Rate</label>
            <input type="number" v-model.number="rate" rows="5" id="rate"> 
        </div>
        <div class="form-control">
            <h3>Location</h3>
            <div>
                <input type="checkbox" id="North" v-model="areas" value="North">
                <label for="North">North</label>
            </div>
            <div>
                <input type="checkbox" id="South" v-model="areas" value="South">
                <label for="South">South</label>
            </div>
            <div>
                <input type="checkbox" id="East" v-model="areas" value="East">
                <label for="East">East</label>
            </div>
            <div>
                <input type="checkbox" id="West" v-model="areas" value="West">
                <label for="West">West</label>
            </div>
        </div>
        <base-button>Register</base-button>
    </form>
</template>

<script>
export default {
    emits: ['save-data'],
    data() {
        return {
            firstName: '',
            lastName: '',
            description: '',
            rate: null,  
            areas: []
        }
    },
    methods: {
        submitForm() {
            const formData = {
                first: this.firstName,
                last: this.lastName,
                desc: this.description,
                rate: this.rate,
                areas: this.areas,
            };
            this.$emit('save-data', formData);
        }
    }
}
</script>