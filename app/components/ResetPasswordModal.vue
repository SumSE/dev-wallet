<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">Reset your password</p>
    </header>
    <section class="modal-card-body">
      <b-notification v-if="error" type="is-danger" :closable="false" has-icon>{{ error }}</b-notification>
      <p>Enter your email address and we will send you a link to reset your password.</p>
      <form @submit.prevent="handleSubmit">
        <div class="field">
          <div class="control">
            <b-field :type="{'is-danger': errors.has('newEmail')}" :message="errors.first('newEmail')">
              <b-input
                type="email"
                name="newEmail"
                icon="email"
                placeholder="Enter your email address"
                size="is-medium"
                data-vv-as="Email"
                v-validate="'required|email'"
                v-model="newEmail"
              />
            </b-field>
          </div>
        </div>
      </form>
    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$parent.close()">Cancel</button>
      <button class="button is-primary" @click.prevent="handleSubmit">Send</button>
    </footer>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { Validator } from "vee-validate";

export default {
  inject: ["$validator"],
  props: {
    email: {
      type: String
    }
  },
  data() {
    return {
      error: "",
      newEmail: this.email
    };
  },
  methods: {
    ...mapActions(["loading", "resetPassword"]),
    async handleSubmit() {
      let result = await this.$validator.validate('newEmail');

      if (!result) return;

      this.loading(true);

      try {
        await this.resetPassword(this.newEmail);
      } catch (e) {
        this.$buefy.toast.open({
          message: e.message,
          type: "is-danger"
        });
      }

      this.$parent.close();

      this.loading(false);
    }
  }
};
</script>
