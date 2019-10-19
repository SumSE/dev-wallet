<template>
    <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
            <p class="modal-card-title">Account</p>
        </header>
        <section class="modal-card-body">
            <div class="level">
                <div class="level-item has-text-centered">
                    <div>
                        <p class="heading">ADDRESS</p>
                        <p class="title">{{ address }}</p>
                    </div>
                </div>
            </div>
            <div class="level">
                <div class="level-item has-text-centered">
                    <div>
                        <p class="heading">QRCODE</p>
                        <p class="title">
                            <qriously :value="address" :size="200" />
                        </p>
                    </div>
                </div>
            </div>
        </section>
        <footer class="modal-card-foot">
            <button class="button" type="button" @click="$parent.close()">Close</button>
            <button class="button is-primary" @click="copyToClipboard">Copy</button>
        </footer>
    </div>
</template>

<style scoped lang="scss">
button {
    width: 150px;
}
</style>
<script>
export default {
    props: {
        address: {
            type: String,
            required: true
        },
    },
    methods: {
        copyToClipboard() {
            if(navigator && navigator.clipboard && navigator.clipboard.writeText)
            {
                navigator.clipboard
                    .writeText(this.address)
                    .then(() => {
                        this.$buefy.toast.open({
                            message: "Copied the address",
                            type: 'is-success'
                        })
                    })                
                    .catch(e => {
                        console.error(e)
                        throw new Error('Failed to copy to clipboard')
                    })            
            } else {
                this.$buefy.toast.open({
                    message: "copying to clipboard on other than Windows environment is still under development",
                    type: 'is-warning'
                })
            }
        }
    }
}
</script>