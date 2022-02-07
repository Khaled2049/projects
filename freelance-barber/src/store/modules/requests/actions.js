export default {
    contactBarber(context, payload) {
        console.log('here 2t2');
        const newRequest = {
            id: new Date().toISOString(),
            userEmail: payload.email,
            message: payload.message,
            barberId: payload.barberId
        };
        context.commit('addRequest', newRequest);
    }
}