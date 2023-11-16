<template>
  <q-page>
    <SimplePhone />
  </q-page>
</template>
<script>
import { defineComponent } from "vue";
import SimplePhone from "src/components/SimplePhone.vue";

export default defineComponent({
  components: {
    SimplePhone,
  },
});
</script>
