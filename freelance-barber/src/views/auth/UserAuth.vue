<template>
    <base-card>
        <form @submit.prevent="submitForm">
            <div class="form-control">
                <label for="email">Email: </label>
                <input type="email" v-model.trim="email" id="email">
            </div>
            <div class="form-control">
                <label for="password">Password: </label>
                <input type="password" v-model.trim="password" id="password">
            </div>
            <p v-if="!formIsValid">
              Please enter a valid email and password
            </p>
            <div class="buttons">
              <base-button type="button">{{ submitButtonCaption }}</base-button>
              <base-button type="button" @click="switchAuthMode" mode="flat">{{ switchModeButtonCaption }}</base-button>
            </div>
        </form>
    </base-card>
</template>
<script>

export default { 
  data() {
    return {
      email: '',
      password: '',
      formIsValid: true,
      mode: 'login',
    }
  },
  computed: {
    submitButtonCaption() {
      if (this.mode === 'login') {
        return 'login';
      } else {
        return 'signup';
      }
    },
    switchModeButtonCaption() {
      if (this.mode === 'login') {
        return 'signup';
      } else {
        return 'login';
      }
    }
  },
  methods: {
    submitForm() {
      this.formIsValid = true;
      if (this.email === '' || !this.email.includes('@') || this.password.length < 6) {
        this.formIsValid = false;
        return;
      }
    },
    switchAuthMode() {
      if(this.mode === 'login') {
        this.mode = 'signup';
      } else {
        this.mode = 'login'
      }
    }
  }
}
</script>
<style scoped>
.buttons {
  display: flex;
}
form {
  margin: 1rem;
  padding: 1rem;
}

.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

input,
textarea {
  display: block;
  width: 100%;
  font: inherit;
  border: 1px solid #ccc;
  padding: 0.15rem;
}

input:focus,
textarea:focus {
  border-color: #3d008d;
  background-color: #faf6ff;
  outline: none;
}

.errors {
  font-weight: bold;
  color: red;
}

.actions {
  text-align: center;
}
</style>