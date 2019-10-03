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
                                            'This field is required.' : errors.firstByRule('confirm-password', 'required'),
                                            '\'Confirm password\' does not match the \'Password\'.' : errors.firstByRule('confirm-password', 'is')
                                        }]">
                                        <b-input type="password" name="confirm-password" icon="key" 
                                            placeholder="Confirm password" size="is-medium" password-reveal
                                            data-vv-as="Confirm password" v-validate="{ required: true, is: password }" v-model="confirmPassword" />
                                    </b-field>
                                </div>
                            </div>

                            <div v-if="isSignUp" class="field">
                                <div class="control">
                                    <b-field :type="{'is-danger': errors.has('name')}" :message="errors.first('name')">
                                        <b-input name="name" icon="account" @change.native="suppressMultibytesOnChange"
                                        @keydown.native="suppressMultibytesOnKeyDown"
                                            placeholder="Name" size="is-medium"
                                            data-vv-as="Name" v-validate="'required|suppressMultibytes'" v-model="name" inputmode="latin" pattern="[A-Za-z\d\-_,\.\/ ]+" />
                                    </b-field>
                                </div>
                            </div>

                            <div v-if="isSignUp" class="field">
                                <div class="control">
                                    <b-field :type="{'is-danger': errors.has('placeOfResidence')}" :message="errors.first('placeOfResidence')">
                                        <b-input name="placeOfResidence" icon="pin" @change.native="suppressMultibytesOnChange"
                                        @keydown.native="suppressMultibytesOnKeyDown"
                                            placeholder="Address" size="is-medium"
                                            data-vv-as="placeOfResidence" v-validate="'required|suppressMultibytes'" v-model="placeOfResidence" inputmode="latin" pattern="[A-Za-z\d\-_,\.\/ ]+" />
                                    </b-field>
                                </div>
                            </div>

                            <div v-if="isSignUp" class="field">
                                <div class="control">
                                    <b-field :type="{'is-danger': errors.has('phone')}" :message="errors.first('phone')">
                                        <b-input type="tel" name="phone" icon="phone" @change.native="suppressMultibytesOnChange"
                                        @keydown.native="suppressMultibytesOnKeyDown"
                                            placeholder="Phone" size="is-medium"
                                            data-vv-as="Phone" v-validate="'required|suppressMultibytes'" v-model="phone" inputmode="latin" pattern="[A-Za-z\d\-_,\.\/ ]+" />
                                    </b-field>
                                </div>
                            </div>

                            <div v-if="isSignUp" class="field">
                                <div class="control">
                                    <b-field :type="{'is-danger': errors.has('birthday')}" :message="errors.first('birthday')">

                                        <b-datepicker
                                            inputmode="latin" pattern="[A-Za-z\d\-_,\.\/ ]+"
                                            placeholder="Birthday"
                                            icon="calendar-today"
                                            size="is-medium"
                                            name="birthday" 
                                            data-vv-as="Birthday" 
                                            v-validate="'required'" 
                                            v-model="birthday"
                                            @change.native="suppressMultibytesOnChange"
                                            @keydown.native="suppressMultibytesOnKeyDown"
                                            editable>
                                        </b-datepicker>
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
                        <a @click="forgotPassword">·&nbsp;Forgot Password</a>
                        <!-- <a href="../">·&nbsp;Need Help?</a> -->
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

<script type="text/javascript">
import { mapActions, mapState, mapGetters } from 'vuex'
import { Validator } from 'vee-validate'
import ResetPasswordModal from "~/components/ResetPasswordModal";

Validator.extend('suppressMultibytes', {
  getMessage: field => 'The ' + field + ' cannot contain any multibytes characters.',
  validate: value => ! /[^A-Za-z\d\-_,\.\/ ]/.test(value)
});

export default {
    layout: 'normal',
    inject: ['$validator'],
    data() {
        //var twoDigit = function(value) {
        //  return ('0' + value).slice(-2);
        //};
        //var _today = new Date();
        return {
            isSignUp: false,
            name: '',
            placeOfResidence: '',
            phone: '',
            birthday: null,/*[
                _today.getFullYear(),
                twoDigit(_today.getMonth()+1),
                twoDigit(_today.getDate())
            ].join('-'),*/
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
                let extraInfo = {
                    name: this.name, 
                    placeOfResidence: this.placeOfResidence,
                    phone: this.phone,
                    birthday: this.birthday
                }

                let info = {
                    email: this.email, 
                    password: this.password, 
                    extraInfo: extraInfo
                }

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
        suppressMultibytesOnChange(event)
        {
            var str = event.target.value
            while(str.match(/[^A-Za-z\d\-_,\.\/ ]/))
            {
                str = str.replace(/[^A-Za-z\d\-_,\.\/ ]/g, "")
            }
            event.target.value = str            
        },
        suppressMultibytesOnKeyDown(event)
        {
            if(/[^A-Za-z\d\-_,\.\/ ]/.test(event.key))
            {
                event.preventDefault()
                return false
            }
        },
        async forgotPassword()
        {
            this.$buefy.modal.open({
                parent: this,
                component: ResetPasswordModal,
                hasModalCard: true,
                props: {
                    email: this.email
                }
            });
        }
    }
}
</script>