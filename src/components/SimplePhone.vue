<template>
  <div
    class="phone-page-container relative-position"
    :class="isProgressing ? 'bg-grey-2' : ''"
  >
    <div :class="isProgressing ? 'calling' : 'none'">
      <q-linear-progress dark rounded indeterminate color="cyan" />
    </div>
    <div class="phone-box">
      <div class="account-status flex">
        <span class="badge" :class="isReady ? 'ready' : 'none'">&nbsp;</span>
        <p>
          {{ isReady ? "認証が完了しました" : "認証が失敗しました" }}
          <span class="q-mx-sm" :class="audioTest ? 'green' : 'red'">
            [{{ audioTest ? "着信音テストOK" : "着信音テストNG" }}]
          </span>
        </p>
      </div>
      <q-input
        class="number-input"
        rounded
        outlined
        v-model="number"
        label="Number"
      />
      <div class="text-center q-ma-md">
        <q-btn
          v-if="isEndable"
          round
          color="dark"
          icon="call_end"
          @click="onClickHangupBtn"
          :class="isToolable ? 'q-mr-md' : ''"
        />
        <q-btn
          v-if="isToolable && !isMuted"
          round
          icon="volume_off"
          @click="onClickMuteBtn"
          class="q-mr-md"
        />
        <q-btn
          v-if="isToolable && isMuted"
          round
          icon="volume_up"
          @click="onClickUnmuteBtn"
          class="q-mr-md"
        />
        <q-btn
          v-if="isToolable && !isHolded"
          round
          icon="music_note"
          @click="onClickHoldBtn"
          class="q-mr-md"
        />
        <q-btn
          v-if="isToolable && isHolded"
          round
          icon="music_off"
          @click="onClickUnholdBtn"
          class="q-mr-md"
        />
        <q-btn v-if="isCallable" round icon="call" @click="onClickCallBtn" />
      </div>
    </div>
  </div>
  <q-dialog v-model="isDialogOpen" persistent position="right">
    <q-card style="width: 400px">
      <q-card-section class="row items-center">
        <q-avatar icon="ring_volume" class="yureru-s" />
        <span class="q-ml-sm text-h6">着信中です</span>
      </q-card-section>
      <q-card-section class="row items-center">
        <table class="full-width">
          <tr>
            <th class="text-left">発信者名</th>
            <td>{{ callerIdName }}</td>
          </tr>
          <tr>
            <th class="text-left">発信者番号</th>
            <td>{{ callerIdNum }}</td>
          </tr>
        </table>
      </q-card-section>
      <q-card-section>
        <div class="info-box bg-grey-3 q-pa-sm">
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
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          label="拒否する"
          color="dark"
          v-close-popup
          @click="onClickRejectBtn"
        />
        <q-btn label="電話に出る" v-close-popup @click="onClickAcceptBtn" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="isOpenConfirmDialog" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="phone_in_talk" color="primary" text-color="white" />
        <span class="q-ml-sm">着信音のテストを開始してもよろしいですか？</span>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn label="拒否する" color="primary" v-close-popup />
        <q-btn
          label="着信音テストを開始する"
          v-close-popup
          @click="onClickStartRingingTest"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <div style="display: none">
    <video id="__ast-remote-video"><track kind="captions" /></video>
    <video id="__ast-local-video" muted><track kind="captions" /></video>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import { LocalStorage } from "quasar";
import { mapState } from "pinia";
import { AstUA, EVENT_TYPE, UA_STATUS } from "ast-ua";
import { useCustomerStore } from "src/stores/customer-store";
import Event from "src/tools/Event";

const KEY = "PREV_USER";
const RINGING = new Audio("src/assets/ringing.mp3");

export default defineComponent({
  data() {
    return {
      number: "",
      customer: {},
      audioTest: false,
      UA: {},
      UAStatus: UA_STATUS.UA_NOT_PREPARED,
      isDialogOpen: false,
      isOpenConfirmDialog: false,
      callerIdName: "",
      callerIdNum: "",
      isHolded: false,
      isMuted: false,
    };
  },
  methods: {
    onClickCallBtn() {
      if (!this.isUAPrepared()) return;
      this.UA.call(this.number);
      return;
    },
    onClickHangupBtn() {
      if (!this.isUAPrepared()) return;
      this.UA.hangup();
      return;
    },
    onClickMuteBtn() {
      if (!this.isUAPrepared()) return;
      this.isMuted = true;
      this.UA.mute();
      return;
    },
    onClickUnmuteBtn() {
      if (!this.isUAPrepared()) return;
      this.isMuted = false;
      this.UA.unmute();
      return;
    },
    onClickHoldBtn() {
      if (!this.isUAPrepared()) return;
      this.isHolded = true;
      this.UA.hold();
      return;
    },
    onClickUnholdBtn() {
      if (!this.isUAPrepared()) return;
      this.isHolded = false;
      this.UA.unhold();
      return;
    },
    onClickAcceptBtn() {
      if (!this.isUAPrepared()) return;
      this.UA.accept();
      return;
    },
    onClickRejectBtn() {
      if (!this.isUAPrepared()) return;
      this.UA.hangup();
      return;
    },
    onClickStartRingingTest() {
      let status = true;
      this.startRinging().catch(() => {
        status = false;
      });
      setTimeout(() => {
        this.stopRinging();
        if (status) this.audioTest = true;
      }, 3500);
    },
    onClickCustomerListCallBtn(e) {
      const { detail: customer } = e;
      const { number } = customer;
      this.number = number;
      this.onClickCallBtn();
    },
    isUAPrepared() {
      if (Object.keys(this.UA).length > 0) return true;
      return false;
    },
    prevChk(user) {
      const prevUser = LocalStorage.getItem(KEY);
      if (!prevUser) return true;
      if (
        Object.keys(prevUser).length > 0 &&
        !(
          user.key !== prevUser.key ||
          user.host !== prevUser.host ||
          user.username !== prevUser.username ||
          user.password !== prevUser.password
        )
      ) {
        return false;
      }
      return true;
    },
    startRinging() {
      return RINGING.play();
    },
    stopRinging() {
      RINGING.pause();
      RINGING.currentTime = 0;
    },
    searchCustomer(name, number) {
      this.customer = {};
      if (!this.customers || this.customers.length === 0) return;
      const filtered = this.customers.filter((c) => {
        if (c.number === number) return true;
        if (c.name === name) return true;
        return false;
      });
      if (filtered.length === 0) return;
      this.customer = filtered[0];
    },
    init(isPrevChk) {
      const user = {
        key: LocalStorage.getItem("KEY") || "",
        host: LocalStorage.getItem("HOST") || "",
        username: LocalStorage.getItem("USERNAME") || "",
        password: LocalStorage.getItem("PASSWORD") || "",
      };
      if (!user.key || !user.host || !user.username || !user.password) return;
      if (isPrevChk && !this.prevChk(user)) {
        return;
      }
      LocalStorage.set(KEY, user);
      if (this.isUAPrepared()) {
        this.UA.stop();
        this.UA = null;
      }
      this.UA = new AstUA({
        host: user.host,
        key: user.key,
        username: user.username,
        password: user.password,
        remoteVideo: document.getElementById("__ast-remote-video"),
        localVideo: document.getElementById("__ast-local-video"),
        register: true,
        watchUsers: true,
        watchQueues: true,
        udp: true,
        ualog: false,
        siplog: false,
      });
      this.UA.on(EVENT_TYPE.UA_STATE_CHANGE, (e) => {
        // UAの状態が変化したら
        const { UAStatus } = e.detail;
        this.UAStatus = UAStatus;
        Event.dispatch(Event.Type.OnUAStatusChange, UAStatus);
        return;
      });

      this.UA.on(EVENT_TYPE.UA_BEING_CALLED, (e) => {
        // 着信が来たら
        this.isDialogOpen = true; // ダイアログ開いてね
        const { callerIdName, callerIdNum } = e.detail;
        this.callerIdName = callerIdName;
        this.callerIdNum = callerIdNum;
        this.searchCustomer(callerIdName, callerIdNum);
        return;
      });

      this.UA.on(EVENT_TYPE.UA_BEING_CALLED_ANSWER, () => {
        // 着信に応答したら
        // 着信音を再生停止する（実装割愛）
        return;
      });

      this.UA.on(EVENT_TYPE.UA_BEING_CALLED_END, () => {
        // 着信が終わったら
        this.isDialogOpen = false; // ダイアログ閉じてね
        return;
      });
    },
  },
  computed: {
    ...mapState(useCustomerStore, ["customers"]),
    isProgressing() {
      if (
        this.UAStatus === UA_STATUS.UA_NOT_PREPARED ||
        this.UAStatus === UA_STATUS.WAITING
      ) {
        return false;
      }
      return true;
    },
    isCallable() {
      if (this.UAStatus === UA_STATUS.WAITING) return true;
      return false;
    },
    isToolable() {
      if (
        this.UAStatus === UA_STATUS.TALKING ||
        this.UAStatus === UA_STATUS.HOLDING ||
        this.UAStatus === UA_STATUS.HOLDED
      ) {
        return true;
      }
      return false;
    },
    isEndable() {
      if (
        this.UAStatus === UA_STATUS.CALLING ||
        this.UAStatus === UA_STATUS.BRIDGING ||
        this.UAStatus === UA_STATUS.TALKING ||
        this.UAStatus === UA_STATUS.HOLDING ||
        this.UAStatus === UA_STATUS.HOLDED
      ) {
        return true;
      }
      return false;
    },
    isReady() {
      if (this.UAStatus !== UA_STATUS.UA_NOT_PREPARED) return true;
      return false;
    },
  },
  watch: {
    isDialogOpen(n) {
      if (n)
        this.startRinging().catch((e) => {
          console.log(e);
        });
      else this.stopRinging();
    },
  },
  mounted() {
    this.init(false);
    setInterval(() => {
      this.init(true);
    }, 3000);
    Event.on(
      Event.Type.OnClickCustomerListCallBtn,
      this.onClickCustomerListCallBtn
    );
    Event.on(Event.Type.OnClickStartRingingTest, this.onClickStartRingingTest);
    this.isOpenConfirmDialog = true;
  },
  unmounted() {
    Event.off(
      Event.Type.OnClickCustomerListCallBtn,
      this.onClickCustomerListCallBtn
    );
    Event.off(Event.Type.OnClickStartRingingTest, this.onClickStartRingingTest);
  },
});
</script>
<style>
.yureru-s {
  animation: yureru-s 1.5s infinite;
}
@keyframes yureru-s {
  0% {
    transform: translate(2px, 0px);
  }
  5% {
    transform: translate(-2px, 0px);
  }
  10% {
    transform: translate(2px, 0px);
  }
  15% {
    transform: translate(-2px, 0px);
  }
  20% {
    transform: translate(2px, 0px);
  }
  25% {
    transform: translate(-2px, 0px);
  }
  30% {
    transform: translate(0px, 0px);
  }
}
</style>
