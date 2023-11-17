<template>
  <q-page-sticky :position="position" :offset="[18, 18]">
    <q-fab
      color="dark"
      :icon="fabIcon"
      :direction="fabDirection"
      vertical-actions-align="right"
      v-model="isFabOpen"
    >
      <q-fab-action @click="onClickAdd" icon="add" />
      <q-fab-action
        v-for="(d, i) in dials"
        v-bind:key="i"
        color="grey-2"
        text-color="dark"
        icon="person"
        :label="d.name"
        v-touch-hold:500.mouse="
          () => {
            onHoldDown(d);
          }
        "
        @click="
          () => {
            onClick(d);
          }
        "
      />
    </q-fab>
  </q-page-sticky>
  <q-dialog v-model="isDialogOpen" position="right">
    <q-card style="width: 500px">
      <q-card-section class="row items-center no-wrap">
        <div class="full-width q-px-sm">
          <q-input outlined v-model="name" label="Name">
            <template v-slot:prepend>
              <q-icon name="account_circle" />
            </template>
          </q-input>
        </div>
        <div class="full-width q-px-sm">
          <q-input outlined v-model="number" type="number" label="Number">
            <template v-slot:prepend>
              <q-icon name="call" />
            </template>
          </q-input>
        </div>
      </q-card-section>
      <q-card-section
        v-if="name.length > 0 && number.length > 0"
        class="q-pt-none"
      >
        <q-btn
          color="dark"
          icon="person"
          :label="`スピードダイヤルを${isEditing ? '更新' : '登録'}する`"
          class="full-width"
          @click="onClickRegister"
        />
        <q-btn
          v-if="isEditing"
          color="dark"
          icon="close"
          label="削除する"
          class="full-width q-mt-xs"
          @click="onClickRemove"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
import { defineComponent } from "vue";
import { LocalStorage } from "quasar";
import Event from "src/tools/Event";

const KEY = "SPEED_DIALS";

export default defineComponent({
  props: {
    position: {
      type: String,
      required: false,
      default: "bottom-right",
    },
  },
  data() {
    return {
      isFabOpen: false,
      isDialogOpen: false,
      isEditing: false,
      name: "",
      number: "",
      dials: LocalStorage.getItem(KEY) || [],
      dial: {},
    };
  },
  methods: {
    onClickAdd() {
      this.isEditing = false;
      this.isDialogOpen = true;
      this.name = "";
      this.number = "";
    },
    onClickRegister() {
      this.isDialogOpen = false;
      if (this.name.length === 0 || this.number.length === 0) return;
      if (!this.isEditing) {
        this.dials.push({
          id: this.getNextID(),
          name: this.name,
          number: this.number,
        });
      } else {
        this.dials = this.update(this.dial.id, this.name, this.number);
      }
      LocalStorage.set(KEY, this.dials);
      this.name = "";
      this.number = "";
      this.isFabOpen = true;
    },
    onClickRemove() {
      this.dials = this.delete(this.dial.id);
      LocalStorage.set(KEY, this.dials);
      this.isDialogOpen = false;
      this.isFabOpen = true;
    },
    onClick(d) {
      d.info = "dummmy";
      Event.dispatch(Event.Type.OnClickCustomerListCallBtn, d);
    },
    onHoldDown(d) {
      this.dial = d;
      this.isEditing = true;
      this.isDialogOpen = true;
      this.isFabOpen = false;
      this.name = d.name;
      this.number = d.number;
    },
    update(id, name, number) {
      return this.dials.map((obj) => {
        if (obj.id === id) {
          return { ...obj, name: name, number: number };
        }
        return obj;
      });
    },
    delete(id) {
      return this.dials.filter((obj) => {
        return obj.id !== id;
      });
    },
    getNextID() {
      if (!this.dials) return 1;
      if (this.dials.length === 0) return 1;
      return this.getMaxID() + 1;
    },
    getMaxID() {
      let maxId = this.dials[0].id;
      for (var i = 1; i < this.dials.length; i++) {
        if (this.dials[i].id > maxId) maxId = this.dials[i].id;
      }
      return maxId;
    },
  },
  computed: {
    fabIcon() {
      if (this.position === "bottom-right") return "keyboard_arrow_up";
      if (this.position === "bottom-left") return "keyboard_arrow_up";
      if (this.position === "top-right") return "keyboard_arrow_down";
      if (this.position === "top-left") return "keyboard_arrow_down";
      return "keyboard_arrow_up";
    },
    fabDirection() {
      if (this.position === "bottom-right") return "up";
      if (this.position === "bottom-left") return "up";
      if (this.position === "top-right") return "down";
      if (this.position === "top-left") return "down";
      return "up";
    },
  },
});
</script>
