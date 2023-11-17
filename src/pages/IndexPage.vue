<template>
  <q-page>
    <!-- ページのコンテンツスペース 🔻🔻🔻 -->
    <SimplePhone />
    <!-- ページのコンテンツスペース 🔺🔺🔺 -->
    <!-- その他 🔻🔻🔻 -->
    <SpeedDial />
    <!-- その他 🔺🔺🔺 -->
  </q-page>
</template>
<script>
import { defineComponent } from "vue";
import SimplePhone from "src/components/SimplePhone.vue";
import SpeedDial from "src/components/SpeedDial.vue";

export default defineComponent({
  components: {
    SimplePhone,
    SpeedDial,
  },
});
</script>
