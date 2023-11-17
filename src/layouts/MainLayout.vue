<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title>
          <!-- ヘッダーのタイトル 🔻🔻🔻 -->
          AAA Special Phone
          <!-- ヘッダーのタイトル 🔺🔺🔺 -->
        </q-toolbar-title>
        <q-space />
        <!-- ヘッダーの右端ボタンスペース 🔻🔻🔻 -->
        <UserForm />
        <!-- ヘッダーの右端ボタンスペース 🔺🔺🔺 -->
      </q-toolbar>
    </q-header>
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <!-- 左のドローワースペース 🔻🔻🔻 -->
      <CustomerList />
      <!-- 左のドローワースペース 🔺🔺🔺 -->
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script>
import { defineComponent, ref } from "vue";
import UserForm from "src/components/UserForm.vue";
import CustomerList from "src/components/CustomerList.vue";

export default defineComponent({
  components: {
    UserForm,
    CustomerList,
  },
  setup() {
    const leftDrawerOpen = ref(false);
    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
