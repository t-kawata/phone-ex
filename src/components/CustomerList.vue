<template>
  <q-tab-panels v-model="tab" animated>
    <q-tab-panel class="q-pa-none" name="one">
      <q-list padding>
        <q-item-label header>Customer List</q-item-label>
        <q-item>
          <q-input
            class="full-width"
            bottom-slots
            v-model="search"
            label="Search"
            dense
            outlined
            clearable
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </q-item>
        <div v-for="(c, index) in list" v-bind:key="index">
          <q-separator spaced inset="item" />
          <q-item
            clickable
            v-ripple
            @click="
              () => {
                onClickList(c);
              }
            "
          >
            <q-item-section top avatar>
              <q-avatar>
                <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ c.name }}</q-item-label>
              <q-item-label caption>{{ c.number }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                round
                outline
                color="dark"
                icon="call"
                :disable="!isCallable"
                @click="
                  () => {
                    onClickListCallBtn(c);
                  }
                "
              />
            </q-item-section>
          </q-item>
        </div>
        <q-separator spaced />
        <div class="q-pa-sm">
          <q-btn
            color="white"
            text-color="black"
            label="リストを追加・編集する"
            class="full-width"
            icon="add"
            @click="isOpenDialog = true"
          />
        </div>
      </q-list>
    </q-tab-panel>
    <q-tab-panel class="q-pa-none q-pb-md" style="height: 100vh" name="two">
      <q-toolbar class="text-primary">
        <q-btn flat round dense icon="arrow_back" @click="tab = 'one'" />
        <q-toolbar-title> 名前 </q-toolbar-title>
      </q-toolbar>
      <div class="bg-grey-3 q-pa-sm q-mb-md">
        <div v-if="Object.keys(customer).length === 0">
          データベースに該当する情報がありませんでした。
        </div>
        <div v-if="Object.keys(customer).length > 0">
          <table>
            <tr>
              <th style="min-width: 50px">名前</th>
              <td>{{ customer.name }}</td>
            </tr>
            <tr>
              <th>番号</th>
              <td>{{ customer.number }}</td>
            </tr>
            <tr>
              <th>情報</th>
              <td>{{ customer.info }}</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="q-px-md">
        <q-btn
          class="full-width"
          label="電話をかける"
          icon="call"
          :disable="!isCallable"
          @click="
            () => {
              onClickListCallBtn(customer);
            }
          "
        />
      </div>
    </q-tab-panel>
  </q-tab-panels>
  <q-dialog v-model="isOpenDialog" persistent>
    <q-card style="min-width: 80%">
      <q-card-section>
        <div class="text-h6">My List CSV</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input autogrow outlined v-model="listCsv" autofocus />
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn label="キャンセル" v-close-popup />
        <q-btn
          color="dark"
          label="登録する"
          v-close-popup
          @click="onClickCreate"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import { defineComponent } from "vue";
import { mapState, mapActions, mapGetters } from "pinia";
import { LocalStorage } from "quasar";
import { useCustomerStore } from "src/stores/customer-store";
import Event from "src/tools/Event";
import { UA_STATUS } from "ast-ua";

const KEY = "LIST_CSV";

const DEF_CSV =
  "" +
  "山田太郎,08012345678,株式会社AIChainのキーマン。趣味はゴルフ。論理的な思考を好む。\n" +
  "鈴木一郎,09076562343,以前たこ焼き屋をしていたことがある。焼き方の話を振るととても喜ぶ。\n" +
  "田中花子,07022223333,3つの会社を経営。株式会社AIChainの顧問弁護士も務める。\n";

export default defineComponent({
  data() {
    return {
      isOpenDialog: false,
      UAStatus: UA_STATUS.UA_NOT_PREPARED,
      listCsv: "",
      search: "",
      customer: {},
      tab: "one",
    };
  },
  methods: {
    ...mapActions(useCustomerStore, ["setCustomers", "setSearch"]),
    onClickCreate() {
      this.buildCustomers(false);
    },
    onClickList(customer) {
      this.tab = "two";
      this.customer = customer;
    },
    onClickListCallBtn(customer) {
      this.tab = "two";
      this.customer = customer;
      Event.dispatch(Event.Type.OnClickCustomerListCallBtn, this.customer);
    },
    onUAStatusChange(e) {
      const { detail: UAStatus } = e;
      this.UAStatus = UAStatus;
    },
    buildCustomers(isInit) {
      if (isInit) this.initListCsv();
      if (this.listCsv.length === 0) {
        this.setCustomers([]);
        return;
      }
      this.listCsv = this.listCsv.replace(/(\r\n|\r|\n)/g, "\n");
      LocalStorage.set(KEY, this.listCsv);
      const lines = this.listCsv.split("\n");
      const list = [];
      lines.forEach((l) => {
        const ex = l.split(",");
        if (ex.length < 3) return;
        list.push({ name: ex[0].trim(), number: ex[1].trim(), info: ex[2] });
      });
      this.setCustomers(list);
    },
    initListCsv() {
      const value = LocalStorage.getItem(KEY);
      if (value) this.listCsv = value;
      else this.listCsv = DEF_CSV;
    },
  },
  computed: {
    ...mapState(useCustomerStore, ["customers"]),
    ...mapGetters(useCustomerStore, ["list"]),
    isCallable() {
      if (this.UAStatus === UA_STATUS.WAITING) return true;
      return false;
    },
  },
  watch: {
    search(n) {
      this.setSearch(n);
    },
    isOpenDialog(n) {
      if (n) this.initListCsv();
    },
  },
  mounted() {
    Event.on(Event.Type.OnUAStatusChange, this.onUAStatusChange);
    this.buildCustomers(true);
  },
  unmounted() {
    Event.off(Event.Type.OnUAStatusChange, this.onUAStatusChange);
  },
});
</script>
