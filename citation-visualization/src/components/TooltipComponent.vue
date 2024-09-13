<template>
  <div v-if="visible" :style="tooltipStyle" class="tooltip">
    <h4>{{ paperInfo.title }}</h4>
    <p><strong>Published Date:</strong> {{ paperInfo.published_date || 'N/A' }}</p>
    <p class="citation-count"><strong>Citation Count:</strong> {{ paperInfo.citationCount || 'N/A' }}</p>
    <p><strong>Abstract:</strong> {{ paperInfo.tldr || 'No summary available.' }}</p>
    <a :href="paperInfo.url" target="_blank">View Paper</a>
  </div>
</template>

<script>
export default {
  name: 'TooltipComponent',
  data() {
    return {
      visible: false,
      paperInfo: {},
      position: { x: 0, y: 0 },
    };
  },
  computed: {
    tooltipStyle() {
      return {
        position: 'absolute',
        left: `${this.position.x + 15}px`,
        top: `${this.position.y + 15}px`,
      };
    },
  },
  methods: {
    showTooltip(paperId, position) {
      this.visible = true;
      this.position = position;
      this.fetchPaperInfo(paperId);
    },
    hideTooltip() {
      this.visible = false;
      this.paperInfo = {};
    },
    fetchPaperInfo(paperId) {
      this.$axios
        .post('/get_paper_info/', { paper_id: parseInt(paperId) })
        .then((response) => {
          this.paperInfo = response.data;
        })
        .catch((error) => {
          console.error('Error fetching paper info:', error);
          this.paperInfo = {
            title: 'Error fetching paper info',
            published_date: '',
            citationCount: '',
            tldr: '',
            url: '',
          };
        });
    },
  },
};
</script>

<style scoped>
.tooltip {
  background-color: rgba(255, 255, 255, 0.95);
  border: 1px solid #ccc;
  padding: 15px;
  display: block;
  z-index: 1000;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  border-radius: 5px;
}

.tooltip h4 {
  margin: 0 0 5px;
  font-size: 18px;
}

.tooltip p {
  margin: 0;
  font-size: 14px;
}

.citation-count {
  font-weight: bold;
  color: #e74c3c;
}
</style>
