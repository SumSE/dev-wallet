<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Update User</p>
    </header>
    <section class="modal-card-body">
      <form>
        <b-notification v-if="error" type="is-danger" :closable="false" has-icon>{{ error }}</b-notification>

        <div class="field">
          <div class="control">
            <b-field :type="{'is-danger': errors.has('name')}" :message="errors.first('name')">
              <b-input
                name="name"
                icon="account"
                @change.native="suppressMultibytesOnChange"
                @keydown.native="suppressMultibytesOnKeyDown"
                placeholder="Name"
                size="is-medium"
                data-vv-as="Name"
                v-validate="'required|suppressMultibytes'"
                v-model="userInfo.name"
                inputmode="latin"
                pattern="[A-Za-z\d\-_,\.\/ ]+"
              />
            </b-field>
          </div>
        </div>

        <div class="field">
          <div class="control">
            <b-field
              :type="{'is-danger': errors.has('placeOfResidence')}"
              :message="errors.first('placeOfResidence')"
            >
              <b-input
                name="placeOfResidence"
                icon="pin"
                @change.native="suppressMultibytesOnChange"
                @keydown.native="suppressMultibytesOnKeyDown"
                placeholder="Address"
                size="is-medium"
                data-vv-as="placeOfResidence"
                v-validate="'required|suppressMultibytes'"
                v-model="userInfo.placeOfResidence"
                inputmode="latin"
                pattern="[A-Za-z\d\-_,\.\/ ]+"
              />
            </b-field>
          </div>
        </div>

        <div class="field">
          <div class="control">
            <b-field :type="{'is-danger': errors.has('phone')}" :message="errors.first('phone')">
              <b-input
                type="tel"
                name="phone"
                icon="phone"
                @change.native="suppressMultibytesOnChange"
                @keydown.native="suppressMultibytesOnKeyDown"
                placeholder="Phone"
                size="is-medium"
                data-vv-as="Phone"
                v-validate="'required|suppressMultibytes'"
                v-model="userInfo.phone"
                inputmode="latin"
                pattern="[A-Za-z\d\-_,\.\/ ]+"
              />
            </b-field>
          </div>
        </div>

        <div class="field">
          <div class="control">
            <b-field
              :type="{'is-danger': errors.has('birthday')}"
              :message="errors.first('birthday')"
            >
              <b-datepicker
                inputmode="latin"
                pattern="[A-Za-z\d\-_,\.\/ ]+"
                placeholder="Birthday"
                icon="calendar-today"
                size="is-medium"
                name="birthday"
                data-vv-as="Birthday"
                v-validate="'required'"
                v-model="userInfo.birthday"
                @change.native="suppressMultibytesOnChange"
                @keydown.native="suppressMultibytesOnKeyDown"
                editable
              ></b-datepicker>
            </b-field>
          </div>
        </div>
      </form>
    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$parent.close()">Close</button>
      <button class="button is-primary" @click.prevent="handleSubmit">Save</button>
    </footer>
  </div>
</template>

<script>
import { Validator } from 'vee-validate'
import { mapActions } from 'vuex'

Validator.extend('suppressMultibytes', {
  getMessage: field => 'The ' + field + ' cannot contain any multibytes characters.',
  validate: value => ! /[^A-Za-z\d\-_,\.\/ ]/.test(value)
});

export default {
    inject: ['$validator'],
    props: {
        userInfo: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            error: '',
        }
    },
    methods: {
        ...mapActions(['loading', 'updateUserInfo']),
        async handleSubmit()
        {
            this.loading(true)

            try {
                await this.updateUserInfo(this.userInfo)
            } catch(e) {
                this.$buefy.toast.open({
                    message: e.message,
                    type: 'is-danger'
                })
            }

            this.$parent.close()

            this.loading(false)

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
        }        
    }
}
</script>

<style lang="scss" scoped>
.modal-card {
    /deep/ {
        .dropdown.is-active .dropdown-menu, .dropdown.is-hoverable:hover .dropdown-menu {
            display: contents;
        }
    }
}
</style>
