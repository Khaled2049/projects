export default {
    registerBarber(state, payload) {
        state.barbers.push(payload);
    },
    setBarbers(state, payload) {
        state.barbers = payload;
    },
    setFetchTimeStamp(state) {
        state.lastFetch = new Date().getTime();
    }
};