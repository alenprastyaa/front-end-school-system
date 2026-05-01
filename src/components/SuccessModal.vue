<template></template>

<script setup>
import { pushToast } from "@/composables/useToast";

const show = (msg, customTitle = "Sukses!") => {
  pushToast({
    title: customTitle,
    message: msg,
    type: "success",
  });
};

const closeModal = () => {};

defineExpose({ show, closeModal });
</script>
