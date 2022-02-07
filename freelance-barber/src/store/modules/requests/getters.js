export default {
    requests(state, getters, rootState, rootGetters) {
        const barberId = rootGetters.userId;
        return state.requests.filter(req => req.barberId === barberId);   
    },
    hasRequests(state, getters) {
        return getters.requests && getters.requests.length > 0;
    }
}