<script setup lang="ts">
import {ref} from 'vue'
import {useVuelidate} from '@vuelidate/core'
import {required} from '@vuelidate/validators'
import {useUserStore} from '@/stores/userStore'

const userStore = useUserStore()

// Login form
const showLoginModal = ref<boolean>(false)
const loginUsername = ref<string>('')
const loginPassword = ref<string>('')
const loginError = ref<string>('')
const isLoggingIn = ref<boolean>(false)

// Login validation
const loginRules = {
  loginUsername: {required},
  loginPassword: {required}
}

const loginV$ = useVuelidate(loginRules, {loginUsername, loginPassword})

const emit = defineEmits<{
  loginSuccess: []
}>()

// Login handlers
const openLoginModal = (): void => {
  showLoginModal.value = true
  loginError.value = ''
  loginUsername.value = ''
  loginPassword.value = ''
  loginV$.value.$reset()
}

const closeLoginModal = (): void => {
  showLoginModal.value = false
  loginError.value = ''
  loginUsername.value = ''
  loginPassword.value = ''
  loginV$.value.$reset()
}

const handleLogin = async (): Promise<void> => {
  loginError.value = ''

  const isFormValid = await loginV$.value.$validate()

  if (!isFormValid) {
    return
  }

  isLoggingIn.value = true

  try {
    const success = await userStore.login(loginUsername.value, loginPassword.value)

    if (success) {
      emit('loginSuccess')
      closeLoginModal()
    } else {
      loginError.value = 'Invalid username or password'
    }
  } catch (error) {
    loginError.value = 'Login failed. Please try again.'
    console.error('Login error:', error)
  } finally {
    isLoggingIn.value = false
  }
}

const handleLogout = (): void => {
  userStore.logout()
  emit('loginSuccess')
}

defineExpose({
  openLoginModal,
  handleLogout
})
</script>

<template>
    <button
      v-if="!userStore.isAuthenticated"
      class="button is-primary"
      @click="openLoginModal"
    >
      Log in
    </button>
    <button
      v-else
      class="button is-small is-danger is-light"
      @click="handleLogout"
    >
      Logout ({{ userStore.getUsername }})
    </button>

    <!-- Login Modal -->
    <div v-bind:class="{ 'is-active': showLoginModal }" class="modal">
      <div class="modal-background" @click="closeLoginModal"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Login</p>
          <button class="delete" aria-label="close" @click="closeLoginModal"></button>
        </header>
        <section class="modal-card-body">
          <div class="field">
            <label class="label">Username</label>
            <div class="control">
              <input
                class="input"
                :class="{ 'is-danger': loginV$.loginUsername.$error }"
                type="text"
                placeholder="Enter username"
                v-model="loginUsername"
                :disabled="isLoggingIn"
                @blur="loginV$.loginUsername.$touch"
              >
            </div>
            <p v-if="loginV$.loginUsername.$error" class="help is-danger">
              <span v-if="loginV$.loginUsername.required.$invalid">Username is required</span>
            </p>
          </div>

          <div class="field">
            <label class="label">Password</label>
            <div class="control">
              <input
                class="input"
                :class="{ 'is-danger': loginV$.loginPassword.$error }"
                type="password"
                placeholder="Enter password"
                v-model="loginPassword"
                :disabled="isLoggingIn"
                @blur="loginV$.loginPassword.$touch"
                @keyup.enter="handleLogin"
              >
            </div>
            <p v-if="loginV$.loginPassword.$error" class="help is-danger">
              <span v-if="loginV$.loginPassword.required.$invalid">Password is required</span>
            </p>
          </div>

          <div v-if="loginError" class="notification is-danger is-light">
            <p>{{ loginError }}</p>
          </div>
        </section>
        <footer class="modal-card-foot">
          <div class="buttons">
            <button
              class="button is-success"
              :class="{ 'is-loading': isLoggingIn }"
              :disabled="isLoggingIn"
              @click="handleLogin"
            >
              Login
            </button>
            <button class="button" @click="closeLoginModal">Cancel</button>
          </div>
        </footer>
      </div>
    </div>
</template>
