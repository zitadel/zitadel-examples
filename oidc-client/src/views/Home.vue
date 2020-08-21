<template>
    <div class="home">
        <img alt="Vue logo" src="../assets/logo.png">
        <div class="home">
            <p v-if="isLoggedIn">User: {{ username }}</p>
            <button class="btn" @click="login" v-if="!isLoggedIn">Login</button>
            <button class="btn" @click="logout" v-if="isLoggedIn">Logout</button>
        </div>

    </div>
</template>
<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import AuthService from '@/services/auth.service';

    const auth = new AuthService();

    @Component({
        components: {
        },
    })

    export default class Home extends Vue {
        public currentUser: string = '';
        public accessTokenExpired: boolean | undefined = false;
        public isLoggedIn: boolean = false;

        public dataEventRecordsItems: [] = [];

        get username(): string {
            return this.currentUser;
        }

        public login() {
            auth.login();
        }

        public logout() {
            auth.logout();
        }

        public mounted() {
            auth.getUser().then((user) => {
                if (user) {
                    this.currentUser = user.profile.name;
                    this.accessTokenExpired = user.expired;
                    this.isLoggedIn = (user !== null && !user.expired);
                }
            });
        }
    }
</script>
<style>

    .btn {
        color: #42b983;
        font-weight: bold;
        background-color: #007bff;
        border-color: #007bff;
        display: inline-block;
        font-weight: 400;
        text-align: center;
        vertical-align: middle;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        background-color: transparent;
        border: 1px solid #42b983;
        padding: .375rem .75rem;
        margin: 10px;
        font-size: 1rem;
        line-height: 1.5;
        border-radius: .25rem;
        transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    }

</style>
