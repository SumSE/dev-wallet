import Vue from 'vue'
import VeeValidate, { Validator } from 'vee-validate'
import en from 'vee-validate/dist/locale/en'

Vue.use(VeeValidate, { inject: false })
Validator.localize('en', en)