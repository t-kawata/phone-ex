<template>
  <q-btn flat round icon="account_circle" @click="isUserDialogOpen = true" />
  <q-dialog v-model="isUserDialogOpen" position="right">
    <q-card style="width: 500px">
      <q-card-section class="row items-center no-wrap">
        <table class="full-width">
          <tr>
            <th class="text-left">KEY</th>
            <td class="text-left">
              <q-input v-model="key" />
            </td>
          </tr>
          <tr>
            <th class="text-left">HOST</th>
            <td class="text-left">
              <q-input v-model="host" />
            </td>
          </tr>
          <tr>
            <th class="text-left">USERNAME</th>
            <td class="text-left">
              <q-input v-model="username" />
            </td>
          </tr>
          <tr>
            <th class="text-left">PASSWORD</th>
            <td class="text-left">
              <q-input v-model="password" />
            </td>
          </tr>
        </table>
      </q-card-section>
      <q-card-section>
        <q-btn
          color="dark"
          icon="phone_in_talk"
          label="着信音テストを開始する"
          class="full-width"
          @click="onClickStartRingingTest"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
import { defineComponent } from "vue";
import { LocalStorage } from "quasar";
import Event from "src/tools/Event";

export default defineComponent({
  data() {
    return {
      isUserDialogOpen: false,
      key: LocalStorage.getItem("KEY") || "",
      host: LocalStorage.getItem("HOST") || "",
      username: LocalStorage.getItem("USERNAME") || "",
      password: LocalStorage.getItem("PASSWORD") || "",
    };
  },
  methods: {
    onClickStartRingingTest() {
      Event.dispatch(Event.Type.OnClickStartRingingTest, {});
      this.isUserDialogOpen = false;
    },
  },
  watch: {
    key(n) {
      LocalStorage.set("KEY", n);
    },
    host(n) {
      LocalStorage.set("HOST", n);
    },
    username(n) {
      LocalStorage.set("USERNAME", n);
    },
    password(n) {
      LocalStorage.set("PASSWORD", n);
    },
  },
});
</script>
