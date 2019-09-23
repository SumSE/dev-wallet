<template>
    <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
            <p class="modal-card-title">Send Coin</p>
        </header>
        <section class="modal-card-body">
            <div class="heading-container">
                <p class="heading">DESTINATION</p>
                <div class="heading-body">
                    <div class="field save">
                        <b-checkbox v-model="save" v-if="!isSelect">
                            Register in the address book
                        </b-checkbox>
                    </div>

                    <div class="field" v-if="save">
                        <div class="control">
                            <b-field label="Address Name" :type="{'is-danger': errors.has('name')}" :message="errors.first('name')">
                                <b-input name="name" icon="account" size="is-medium"
                                    data-vv-as="Address Name" v-validate="'required'" v-model="name" />
                            </b-field>
                        </div>
                    </div>

                    <div class="field" v-if="!isSelect">
                        <div class="control">
                            <b-field label="Wallet Address" :type="{'is-danger': errors.has('address')}" :message="errors.first('address')">
                                <b-input name="address" icon="key" size="is-medium"
                                    data-vv-as="Wallet Address" v-validate="'required'" v-model="address" />
                            </b-field>
                        </div>
                    </div>

                    <div class="field" v-if="isSelect">
                        <div class="control">
                            <label class="label">Wallet Address</label>
                            <span class="address">{{ address }}</span>
                        </div>
                    </div>

                    <div class="field">
                        <div class="control">
                            <b-field label="Value" :type="{'is-danger': errors.has('value')}" :message="errors.first('value')">
                                <b-input type="number" step=0.0001 name="value" icon="coin" size="is-medium"
                                    data-vv-as="Value" v-validate="'required|decimal:4'" v-model="value" />
                            </b-field>
                        </div>
                    </div>
                </div>
            </div>

            <div class="heading-container">
                <p class="heading">ADDRESS BOOK</p>
                <b-table
                    :data="books"
                    :selected.sync="selected"
                    @select="select"
                    focusable>
                    <template slot-scope="props">
                        <b-table-column field="address" label="Wallet Address" width="200" centered class="from_to">
                            {{ props.row.address }}
                        </b-table-column>

                        <b-table-column field="name" label="Name" width="100" centered class="from_to">
                            {{ props.row.name }}
                        </b-table-column>
                    </template>
                </b-table>
            </div>
        </section>
        <footer class="modal-card-foot">
            <button class="button" type="button" @click="$parent.close()">Close</button>
            <button class="button is-primary" @click.prevent="handleSubmit">Send</button>
            <button class="button is-danger" @click="clear">Clear Selection</button>
        </footer>
    </div>
</template>

<style scoped lang="scss">
button {
    width: 150px;
}
.field {
    &.save {
        margin-top: 20px;
        // margin-bottom: 30px;
        text-align: center;
    }
}
.heading-container {
    margin-bottom: 30px;
    .heading-body {
        margin-left: 2.5em;
        margin-right: 2.5em;
        .address {
            font-size: 1.0rem;
            margin-left: 10px;
            word-wrap: break-word;
        }
    }
}
</style>

<script>
import { mapActions } from 'vuex'

export default {
    inject: ['$validator'],
    props: {
        type: {
            type: String,
            required: true
        },
    },
    data() {
        return {
            save: false,
            name: '',
            address: '',
            value: '',
            selected: null,
            isSelect: null     // selectedでv-ifが反応しない
        }
    },
    computed: {
        books () {
            return this.$store.getters[this.type + '/books']
        }
    },
    methods: {
        ...mapActions(['loading']),
        select(data) {
            this.address = data.address
            this.name = data.name
            this.isSelect = true
            this.save = false
        },
        clear() {
            this.address = ''
            this.name = ''
            this.isSelect = false
            this.selected = null
        },
        async handleSubmit() {
            let result = await this.$validator.validateAll()

            if (!result) return

            this.loading(true)

            try {
                if (this.save) {
                    await this.$store.dispatch(this.type + '/saveBook', { address: this.address, name: this.name })
                }

                await this.$store.dispatch(this.type + '/send', { address: this.address, value: this.value })
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