<script lang="ts">
export default {
        data: () => ({
          hasToken: !!localStorage.getItem('token'),
        }),
        created() {
          if (!this.hasToken) {
            this.$router.push('/')
          }
        },

        methods: {
          // TODO
        }
    }
</script>

<template>
    <h2>History</h2>
</template>

<style scoped>
</style>