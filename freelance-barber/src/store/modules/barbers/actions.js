export default {
    registerBarber(context, data) {
        const barberData = {
            id: context.rootGetters.userId,
            firstName: data.first,
            lastName: data.last,
            description: data.desc,
            hourlyRate: data.rate,
            areas: data.areas
        };
        context.commit('registerBarber', barberData);
    }
};