<template>
    <div>
        <nav class="navbar is-dark" role="navigation" aria-label="main navigation">
            <div class="navbar-brand">
                <nuxt-link to="/" class="navbar-item">
                    <b-icon icon="coins" size="is-medium" type="is-white"></b-icon>
                    <div class="logo-title">XCMG</div>
                </nuxt-link>
                <a role="button" class="navbar-burger" data-target="navMenu" 
                    @click="toggleMenu" :class="{ 'is-active': isMenuActive }"
                    aria-label="menu" aria-expanded="false">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

            <div class="navbar-menu" id="navMenu" :class="{ 'is-active': isMenuActive }">
                <div class="navbar-start">
                    <nuxt-link to="/" class="navbar-item">
                        Home
                    </nuxt-link>
                    <a href="mailto:cloudmining@support-cm.com" class="navbar-item">Contact</a>
                </div>

                <div class="navbar-end">
                    <div class="navbar-item">
                        <article class="media">
                            <figure class="media-left">
                                <p class="image is-32x48">
                                    <img src="https://bulma.io/images/placeholders/32x32.png">
                                </p>
                            </figure>
                            <div class="media-content">
                                <div class="content avator-name">
                                    <p>{{ userName }}</p>
                                </div>
                            </div>
                        </article>
                    </div>
                    <div class="navbar-item">
                        <button class="button is-dark" @click.prevent="handleSignout">
                            <b-icon icon="logout"></b-icon>
                            <span>Signout</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
        <section v-if="user && !user.emailVerified">
            <div class="box">
                <div class="field">
                    A confirmation email was sent.
                    Please click the link on the email to start using the wallet.
                </div>
                <div class="field">
                    <button v-if="!mailSent" class="button is-block is-info" @click.prevent="handleResend">Request to resend</button>
                </div>
            </div>
        </section>
        <section v-if="user && user.emailVerified">
            <nuxt />
        </section>
        <b-loading :is-full-page="true" :active.sync="isLoading" :can-cancel="false"></b-loading>
    </div>
</template>

<style scoped lang="scss">
.logo-title {
    margin-left: 0.5em;
    margin-right: 1em;
    font-size: 1.5em;
    font-weight: bold;
}
.avator-name {
    padding-top: 2px;
}
</style>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
    data() {
        return { mailSent: false }
    },
    mounted() {
        this.resetMenu()
    },
    computed: {
        ...mapGetters(['isMenuActive', 'isLoading', 'user', 'userInfo']),
        userName() { return this.userInfo ? this.userInfo.name : this.user.email.split('@')[0] }
    },
    methods : {
        ...mapActions(['toggleMenu', 'resetMenu', 'signout']),
        async handleSignout() {
            try {
                await this.signout()

                this.$router.push('/signin') 
            } catch(e) {
                console.log(e);
            }
        },
        async handleResend()
        {
            await this.user.sendEmailVerification({ url: window.location.origin })

            this.mailSent = true
        }
    }
}
</script>
