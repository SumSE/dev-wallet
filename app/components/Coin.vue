<template>
  <article class="tile is-child box">
    <p class="title">
      <b-icon v-if="icon" :icon="icon" size="is-medium" type="is-primary" />
      {{ title }}
    </p>
    <p class="subtitle">Kind of coin</p>
    <div class="level">
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">BALANCE</p>
          <p class="title">
            {{ balance.toLocaleString() }}
            <span
              v-if="!!balanceUSD"
            >({{ balanceUSD.toLocaleString("en-US", {style: "currency", currency: "USD"}) }})</span>
          </p>
        </div>
      </div>
    </div>
    <div class="level">
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">ACTION</p>
          <div class="columns" v-if="!address">
            <div class="column">
              <button class="button is-primary" @click="openCreateWalletModal">
                <b-icon icon="wallet"></b-icon>
                <span>Create Wallet</span>
              </button>
            </div>
          </div>
          <div class="columns" v-if="address">
            <div class="column">
              <button disabled class="button is-primary" @click="openSendModal">
                <b-icon icon="send"></b-icon>
                <span>Send</span>
              </button>
            </div>
            <div class="column">
              <button class="button is-primary" @click="openReceiveModal">
                <b-icon icon="call-received"></b-icon>
                <span>Receive</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="heading-container">
      <p class="heading">TRANSACTION</p>
    </div>
    <b-table :data="transactions">
      <template slot-scope="props">
        <b-table-column
          field="date"
          label="Date"
          width="120"
          centered
        >{{ props.row.date.toDate().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) }}</b-table-column>

        <b-table-column label="Type" width="80" centered>
          <span class="tag is-success">{{ props.row.type == 1 ? 'send' : 'receive' }}</span>
        </b-table-column>

        <b-table-column
          field="from_to"
          label="From/To"
          centered
          class="from_to"
        >{{ props.row.from_to }}</b-table-column>

        <b-table-column field="name" label="Name" centered class="from_to">{{ props.row.name }}</b-table-column>

        <b-table-column
          field="value"
          label="Value"
          width="100"
          numeric
        >{{ props.row.value.toLocaleString() }}</b-table-column>
      </template>

      <template slot="empty">
        <section class="section">
          <div class="content has-text-grey has-text-centered">
            <p>
              <b-icon icon="emoticon-sad" size="is-large"></b-icon>
            </p>
            <p>No transaction history.</p>
          </div>
        </section>
      </template>
    </b-table>
  </article>
</template>

<style scoped lang="scss">
.table .tag {
  width: 100%;
}
button {
  width: 150px;
}
</style>

<script>
import { mapActions } from "vuex";
import CreateWalletModal from "~/components/CreateWalletModal";
import ReceiveModal from "~/components/ReceiveModal";
import SendModal from "~/components/SendModal";

export default {
  props: {
    title: {
      type: String,
      required: true
    },
    icon: {
      type: String
    },
    type: {
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      balanceUSD: 0
    };
  },
  computed: {
    address() {
      return this.$store.getters[this.type + "/address"];
    },
    balance() {
      const bal = this.$store.getters[this.type + "/balance"];
      this.updateBalanceUSD(bal);
      return bal;
    },
    transactions() {
      return this.$store.getters[this.type + "/transactions"];
    }
  },
  methods: {
    ...mapActions(["getBalanceUSD"]),
    async updateBalanceUSD(bal) {
      this.balanceUSD = await this.getBalanceUSD(bal)
    },
    openCreateWalletModal() {
      this.$buefy.modal.open({
        parent: this,
        component: CreateWalletModal,
        hasModalCard: true,
        props: {
          type: this.type
        }
      });
    },
    openReceiveModal() {
      this.$buefy.modal.open({
        parent: this,
        component: ReceiveModal,
        hasModalCard: true,
        props: {
          address: this.address
        }
      });
    },
    openSendModal() {
      this.$buefy.modal.open({
        parent: this,
        component: SendModal,
        hasModalCard: true,
        width: 520,
        props: {
          type: this.type
        }
      });
    }
  }
};
</script>
