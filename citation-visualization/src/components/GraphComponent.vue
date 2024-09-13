<template>
  <div>
    <div id="cy" ref="cy"></div>
  </div>
</template>

<script>
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';

cytoscape.use(dagre);

export default {
  props: ['selectedPaper'],
  data() {
    return {
      cy: null,
    };
  },
  watch: {
    selectedPaper(newVal) {
      if (newVal) {
        this.loadGraph();
      }
    },
  },
  methods: {
    initializeCytoscape() {
      this.cy = cytoscape({
        container: this.$refs.cy,
        style: [/* ... styles ... */],
        layout: { name: 'dagre' },
      });

      this.cy.on('tap', 'node', (evt) => {
        // Handle node click
      });

      // Other event listeners
    },
    loadGraph() {
      // Fetch data and populate the graph
    },
  },
  mounted() {
    this.initializeCytoscape();
  },
};
</script>

<style scoped>
#cy {
  width: 100%;
  height: 800px;
}
</style>
