<template>
  <div v-if="isOpen" class="fixed inset-0 flex justify-center items-center z-50">
    <div class="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div class="dialog-content bg-white rounded shadow-md p-4 w-full mx-4">
        <form @submit.prevent="submitForm">
          <label>
            <div class="w-full p-2">
              {{ updatedContent }}
            </div>
          </label>
          <div class="flex flex-row space-x-4">
            <button class="btn flex-grow" type="button" @click="closeDialog">Close</button>
            <button class="btn flex-grow" type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      required: true
    },
    isOpen: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      updatedContent: this.content
    }
  },
  methods: {
    submitForm() {
      this.$emit('update', this.updatedContent)
      this.closeDialog()
    },
    closeDialog() {
      this.$emit('close')
    }
  }
}
</script>
