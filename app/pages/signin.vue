<template>
    <section class="hero is-success is-fullheight">
        <div class="hero-body">
            <div class="container has-text-centered">
                <div class="column is-4 is-offset-4">
                    <h3 v-if="!isSignUp" class="title has-text-grey">Sign in</h3>
                    <h3 v-if="isSignUp" class="title has-text-grey">Sign up</h3>
                    <div class="box">
                        <figure class="avatar">
                            <img src="~/assets/images/avator.jpg" width="128">
                        </figure>
                        <form>
                            <span v-if="user"></span>
                            <b-notification v-if="error" type="is-danger" :closable="false" has-icon>
                                {{ error }}
                            </b-notification>
                            <div class="field">
                                <div class="control">
                                    <b-field :type="{'is-danger': errors.has('email')}" :message="errors.first('email')">
                                        <b-input type="email" name="email" icon="email"
                                            placeholder="Email" size="is-medium"
                                            data-vv-as="Email" v-validate="'required|email'" v-model="email" />
                                    </b-field>
                                </div>
                            </div>

                            <div class="field">
                                <div class="control">
                                    <b-field :type="{'is-danger': errors.has('password')}" :message="errors.first('password')">
                                        <b-input type="password" name="password" icon="key"
                                            placeholder="Password" size="is-medium" password-reveal
                                            data-vv-as="Password" v-validate="'required|min:8'" v-model="password" />
                                    </b-field>
                                </div>
                            </div>

                            <div v-if="isSignUp" class="field">
                                <div class="control">
                                    <b-field :type="{'is-danger': errors.has('confirm-password')}"
                                        :message="[{
                                            'Confirm passwordは必須入力です' : errors.firstByRule('confirm-password', 'required'),
                                            'Confirm passwordがpasswordと一致していません' : errors.firstByRule('confirm-password', 'is')
                                        }]">
                                        <b-input type="password" name="confirm-password" icon="key" 
                                            placeholder="Confirm password" size="is-medium" password-reveal
                                            data-vv-as="Confirm password" v-validate="{ required: true, is: password }" v-model="confirmPassword" />
                                    </b-field>
                                </div>
                            </div>

                            <!-- <div class="field">
                                <label class="checkbox">
                                    <input type="checkbox">
                                    Remember me
                                </label>
                            </div> -->
                            <button v-if="!isSignUp" class="button is-block is-info is-large is-fullwidth" @click.prevent="handleSubmit">Sign in</button>
                            <button v-if="isSignUp" class="button is-block is-info is-large is-fullwidth" @click.prevent="handleSubmit">Create Account</button>
                        </form>
                    </div>
                    <p class="has-text-grey">
                        <a v-if="!isSignUp" @click="changeSignUp">Sign up</a>
                        <a v-if="isSignUp" @click="changeSignUp">Sign in</a>
                        <!-- <a href="../">Sign Up</a> &nbsp;·&nbsp; -->
                        <!-- <a href="../">Forgot Password</a> &nbsp;·&nbsp;
                        <a href="../">Need Help?</a> -->
                    </p>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped lang="scss">

html,body {
    font-family: 'Open Sans', serif;
    font-size: 14px;
    font-weight: 300;
}
.hero.is-success {
    background: #F2F6FA;
}

.hero .nav, .hero.is-success .nav {
    -webkit-box-shadow: none;
    box-shadow: none;
}

.box {
    margin-top: 5rem;
}
.avatar {
    margin-top: -70px;
    padding-bottom: 20px;
    img {
        padding: 5px;
        background: #fff;
        border-radius: 50%;
        -webkit-box-shadow: 0 2px 3px rgba(10,10,10,.1), 0 0 0 1px rgba(10,10,10,.1);
        box-shadow: 0 2px 3px rgba(10,10,10,.1), 0 0 0 1px rgba(10,10,10,.1);
    }
}

input {
    font-weight: 300;
}
p {
    font-weight: 700;
    &.subtitle {
        padding-top: 1rem;
    }
}

</style>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
    layout: 'normal',
    inject: ['$validator'],
    data() {
        return {
            isSignUp: false,
            email: '',
            password: '',
            confirmPassword: '',
            error: '',
        }
    },
    computed: {
        ...mapGetters(['isAuthenticated', 'user'])
    },
    methods : {
        ...mapActions(['setUser', 'signin', 'signup', 'loading']),
        changeSignUp() {
            this.isSignUp = !this.isSignUp
        },
        async handleSubmit() {
            let result = await this.$validator.validateAll()

            if (!result) return

            // this.$root.$loading.start()

            try {
                let info = { email: this.email, password: this.password }

                if (this.isSignUp) {
                    await this.signup(info)
                } else {
                    await this.signin(info)
                }

                this.$router.push('/') 
            } catch(e) {
                this.error = e.message
            }
        },
    }
}
</script>