import Vue from 'vue'
import VeeValidate, { Validator } from 'vee-validate'
import ja from 'vee-validate/dist/locale/ja'

Vue.use(VeeValidate, { inject: false })
Validator.localize('ja', ja)