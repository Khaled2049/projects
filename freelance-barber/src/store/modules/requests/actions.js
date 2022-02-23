export default {
    async contactBarber(context, payload) {
        const newRequest = {
            userEmail: payload.email,
            message: payload.message,
            // barberId: payload.barberId
        };

        const response = await fetch(`${process.env.VUE_APP_FIREBASE}/requests/${payload.barberId}.json`, {
            method: 'POST',
            body: JSON.stringify(newRequest)
        });

        const responseData = await response.json();
        if (!response.ok) {
            const error = new Error(responseData.message || 'Failed to send Request');
            throw error;
        }

        newRequest.id = responseData.name;
        newRequest.barberId = payload.barberId;

        context.commit('addRequest', newRequest);
    },

    async fetchRequests(context) {
        const barberId = context.rootGetters.userId;
        const token = context.rootGetters.token;
        console.log(token);
        const response = await fetch(`${process.env.VUE_APP_FIREBASE}/requests/${barberId}.json?auth=${token}`);
        const responseData = await response.json();

        if(!response.ok) {
            const error = new Error(responseData.message || 'Failed to get requests');
            throw error;
        }
        
        const requests = [];
        for (const key in responseData) {
            const request = {
                id: key,
                barberId: barberId,
                userEmail: responseData[key].userEmail,
                message: responseData[key].message
            }
            requests.push(request);
        }
        context.commit('setRequests', requests);
    }
}