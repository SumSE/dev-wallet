<template>
    <div>
        <section class="hero is-light">
            <div class="hero-body">
                <div class="columns">
                    <div class="column is-12 is-clearfix">
                        <figure class="avatar">
                            <img src="~/assets/images/avator.jpg" width="80px">
                        </figure>
                        <div class="title-container">
                            <h1 class="title">
                                Welcome! XCMG
                            </h1>
                            <h2 class="subtitle">
                                about XCMG .....
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section class="section">
            <div class="columns">
                <div class="column is-6">
                    <coin title="XCMG" icon="coin" type="xcm" />
                </div>
                <div class="column is-6">
                    <coin title="ETH" icon="coin" type="eth" />
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped lang="scss">
.hero {
    .hero-body {
        padding-top: 2rem;
        padding-bottom: 2rem;
        .columns {
            .welcome {
                margin-top: 5px;
            }
        }
    }
}
.avatar {
    float: left;
    img {
        background: #fff;
        border-radius: 50%;
    }
}
.title-container {
    float: left;
    margin-top: 5px;
    margin-left: 20px;
}
</style>

<script>
import Coin from '~/components/Coin'

export default {
    async fetch ({ store, params }) {

        await store.dispatch('xcm/load')        
        //await store.dispatch('bitcoin/load')
    },
    components: {
        Coin
    }
}
</script>
