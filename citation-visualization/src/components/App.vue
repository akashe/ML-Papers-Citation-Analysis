<template>
  <div id="app">
    <SearchComponent @paper-selected="onPaperSelected" />
    <GraphComponent :selectedPaper="selectedPaper" />
    <TooltipComponent />
  </div>
</template>

<script>
import SearchComponent from './components/SearchComponent.vue';
import GraphComponent from './components/GraphComponent.vue';
import TooltipComponent from './components/TooltipComponent.vue';

export default {
  components: {
    SearchComponent,
    GraphComponent,
    TooltipComponent,
  },
  data() {
    return {
      selectedPaper: null,
    };
  },
  methods: {
    onPaperSelected(paper) {
      this.selectedPaper = paper;
    },
  },
};
</script>

<style>
/* Global styles */
</style>
