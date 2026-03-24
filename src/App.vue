<script setup lang="ts">
import { routers } from '@/constants/routers.ts'
import LoginForm from '@/components/Form/LoginForm.vue'
</script>

<template>
  <header>
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="container is-fluid">
        <div class="navbar-menu">
          <div class="navbar-start">
            <RouterLink
              v-for="link in routers"
              :key="link.name"
              class="navbar-item"
              :to="link.to"
              >{{ link.name }}</RouterLink
            >
          </div>
          <div class="navbar-end">
            <div class="navbar-item">
              <div class="buttons">
                <LoginForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>
  <main class="container is-fluid app-main">
    <RouterView />
  </main>
</template>
