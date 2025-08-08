<template>
  <div class="my-5">
    <div class="flex items-center justify-between">
      <h2 class="text-1xl font-semibold mb-4 dark:text-white">
        <slot name="title"></slot>
      </h2>
      <div class="flex gap-2">
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>
