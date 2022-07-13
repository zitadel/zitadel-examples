<template>
  <div class="about">
    <h1>This is an authenticated user page</h1>
    <div class="about" v-if="$oidc.isAuthenticated">
      <p class="username">
        <strong>{{ user.name }}</strong>
      </p>

      <button v-on:click="$oidc.signOut">Signout</button>

      <ul class="claims">
        <li v-for="c in claims" :key="c.key">
          <strong>{{ c.key }}</strong
          >: {{ c.value }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  computed: {
    user(): any {
      return { ...this.$oidc.userProfile, accessToken: this.$oidc.accessToken };
    },
    claims() {
      if (this.user) {
        return Object.keys(this.user).map((key) => ({
          key,
          value: this.user[key],
        }));
      }
      return [];
    },
  },
};
</script>

<style>
.username {
  font-size: 1.5rem;
  color: white;
}

.about {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

button {
  border-radius: 6px;
  background-color: white;
  color: black;
  padding: 0.5rem 1rem;
  font-weight: 500;
  border: none;
  margin: 1rem 0 2rem 0;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

button:hover {
  background-color: #dedede;
}
</style>
