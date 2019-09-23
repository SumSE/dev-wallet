<template>
    <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
            <p class="modal-card-title">Create Wallet</p>
        </header>
        <section class="modal-card-body">
            <p>Please note 10 words</p>
            <div class="tag-container">
                <b-tag type="is-success" v-for="(word, index) in wordItems1" :key='index'>{{word}}</b-tag>
            </div>
            <div class="tag-container">
                <b-tag type="is-success" v-for="(word, index) in wordItems2" :key='index'>{{word}}</b-tag>
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
span.tag
{
    margin-right: 2px;
}
</style>

<script>
import words from "~/plugins/words"
import { mapActions } from 'vuex'
export default {
    props: {
        type: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            wordItems1: this.random5Words(),
            wordItems2: this.random5Words()
        }
    },
    methods: {
        ...mapActions(['loading']),
        async handleSubmit() {
            this.loading(true)

            try {
                await this.$store.dispatch(this.type + '/createWallet', [this.wordItems1.concat(this.wordItems2)])
            } catch(e) {
                this.$toast.open({
                    message: e.message,
                    type: 'is-danger'
                })
            }

            this.$parent.close()

            this.loading(false)
        },
        random5Words() {
            var ret = []
            var w = words()
            for(var i = 0; i < 5; i++)
            {
                ret.push(
                    w[Math.floor(Math.random() * w.length)]
                )
            }
            return ret
        }        
    }
}
</script>