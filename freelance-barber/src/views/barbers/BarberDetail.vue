<template>
    <section>
        <base-card>
        <h2>{{ fullName }}</h2>
        <h3>${{ hourlyRate }}/hour</h3>
        </base-card>
    </section>
    <section>
        <base-card>
        <header>
            <h2>Interested? Reach out now!</h2>
            <base-button link :to="contactLink">Contact</base-button>
        </header>
        </base-card>
    </section>
    <section>
        <base-card>
            <base-badge v-for="area in areas" :key="area" :type="area" :title="area"></base-badge>
            <router-view></router-view>
            <!-- <router-link to="/barbers/b1/contact">Contact</router-link> -->
        </base-card>
    </section>
</template>


<script>
import BaseBadge from "../../components/base/BaseBadge.vue";

export default {
    components: { 
      BaseBadge, 
    },
    props: ['id'],
    data() {
        return {
            selectedBarber: null
        };
    },
    computed: {
        fullName() {
            return this.selectedBarber.firstName + ' ' + this.selectedBarber.lastName;
        },
        contactLink() {
            return this.$store.path + '/' + this.id + '/barber';
        },
        areas() {
            return this.selectedBarber.areas;
        },
        hourlyRate() {
            return this.selectedBarber.hourlyRate;
        },
        description() {
            return this.selectedBarber.description;
        }
    },
    created() {
        this.selectedBarber = this.$store.getters['barbers/barbers'].find((barber) => barber.id === this.id);
    }
}
</script>