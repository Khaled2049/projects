import mutations from './mutations.js';
import actions from './actions.js';
import getters from './getters.js';

export default {
    namespaced: true,
    state() {
        return {
            barbers: [
                {
                    id: 'b1',
                    firstName: 'Liton',
                    lastName: "Dash",
                    areas: ['West', 'East', 'North'],
                    description: 'I am the best barber in the world',
                    hourlyRate: 30, 
                },
                {
                    id: 'b2',
                    firstName: 'Komol',
                    lastName: "nunu",
                    areas: ['South', 'West'],
                    description: 'I am the 2nd best barber in the world',
                    hourlyRate: 30, 
                }
            ]
        }
    },
    mutations,
    actions, 
    getters,
}