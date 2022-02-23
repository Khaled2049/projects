export default {
    
    async registerBarber(context, data) {
        const userId = context.rootGetters.userId;
        const barberData = {
            id: context.rootGetters.userId,
            firstName: data.first,
            lastName: data.last,
            description: data.desc,
            hourlyRate: data.rate,
            areas: data.areas
        };
        
        const token = context.rootGetters.token;

        const response = await fetch(`${process.env.VUE_APP_FIREBASE}/barbers/${userId}.json?auth=${token}`, {
            method: 'PUT',
            body: JSON.stringify(barberData)
        });

        if(!response.ok) {
            // ERROR
            const error = new Error(response.data.message || 'Error')
            throw error;
        }

        context.commit('registerBarber', {
            ...barberData,
            id: userId
        });
    },
    async loadBarbers(context, payload) {
        if (!payload.forceRefresh && !context.getters.shouldUpdate) {
            return;
        }
        const response = await fetch(`${process.env.VUE_APP_FIREBASE}/barbers.json`); 
        const responseData = await response.json();
        if (!response.ok) {
            console.log(response);
        }

        const barbers = [];
        for (const key in responseData) {
            const barber = {
                id: key,
                firstName: responseData[key].firstName,
                lastName: responseData[key].lastName,
                description: responseData[key].description,
                hourlyRate: responseData[key].hourlyRate,
                areas: responseData[key].areas
            };
            barbers.push(barber);
        }
        context.commit('setBarbers', barbers);
        context.commit('setFetchTimeStamp');
    }
};