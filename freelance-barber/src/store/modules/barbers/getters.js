export default {
    barbers(state) {
        return state.barbers;
    },

    hasBarbers(state) {
        return state.barbers && state.barbers.length > 0;
    },

    isBarber(_, getters, _2, rootGetters) {
        const barbers = getters.barbers;
        const userId = rootGetters.userId;
        return barbers.some(barber => {
            return barber.id === userId; 
        })
    }
};