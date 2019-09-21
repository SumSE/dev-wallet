<template>
    <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
            <p class="modal-card-title">Create Wallet</p>
        </header>
        <section class="modal-card-body">
            <p>Please note 10 words</p>
            <div class="tag-container">
                <b-tag type="is-success">word01</b-tag>
                <b-tag type="is-success">word02</b-tag>
                <b-tag type="is-success">word03</b-tag>
                <b-tag type="is-success">word04</b-tag>
                <b-tag type="is-success">word05</b-tag>
            </div>
            <div class="tag-container">
                <b-tag type="is-success">word06</b-tag>
                <b-tag type="is-success">word07</b-tag>
                <b-tag type="is-success">word08</b-tag>
                <b-tag type="is-success">word09</b-tag>
                <b-tag type="is-success">word10</b-tag>
            </div>
        </section>
        <footer class="modal-card-foot">
            <button class="button" type="button" @click="$parent.close()">Close</button>
            <button class="button is-primary" @click.prevent="handleSubmit">Create</button>
        </footer>
    </div>
</template>

<style scoped lang="scss">
.tag-container {
    margin-top: 10px;
}
button {
    width: 150px;
}
</style>

<script>
import { mapActions } from 'vuex'

export default {
    props: {
        type: {
            type: String,
            required: true
        },
    },
    methods: {
        ...mapActions(['loading']),
        async handleSubmit() {
            this.loading(true)

            try {
                await this.$store.dispatch(this.type + '/createWallet')
            } catch(e) {
                this.$toast.open({
                    message: e.message,
                    type: 'is-danger'
                })
            }

            this.$parent.close()

            this.loading(false)
        }
    }
}
</script>