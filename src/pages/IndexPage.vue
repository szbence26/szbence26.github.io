<template>
  <q-page class="page-root">
    <q-toolbar class="q-pa-sm bg-transparent">
      <q-space />
      <q-btn
        dense
        flat
        round
        class="lang-btn"
        @click="toggleLocale"
        aria-label="Language"
      >
        <span class="flag">{{ currentFlag }}</span>
      </q-btn>
    </q-toolbar>

    <div class="content-wrap">
      <q-card flat class="card">
        <q-card-section class="text-center">
          <div class="title">{{ msg.title }}</div>
          <div class="meta">{{ msg.date }}</div>
          <div class="meta">{{ msg.location }}</div>
          <div class="meta">{{ msg.address }}</div>

          <div class="links q-mt-md">
            <q-btn flat color="primary" @click="openMap">
              {{ msg.map }}
            </q-btn>
          </div>

          <q-separator spaced />

          <div class="program-section">
            <h3>{{ msg.programLabel }}</h3>
            <q-timeline color="timeline-accent" layout="dense">
              <q-timeline-entry
                v-for="(item, index) in msg.timeline"
                :key="index"
                :title="item.time"
                :subtitle="item.event"
                icon="bedtime"
              />
            </q-timeline>
          </div>

          <q-separator spaced />

          <div class="info">
            <div>
              <strong>{{ msg.menuLabel }}</strong> {{ msg.menu }}
            </div>
            <div>
              <strong>{{ msg.accommodationLabel }}</strong>
              {{ msg.accommodation }}
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from "vue";
import messages from "src/i18n/messages";

const locale = ref(localStorage.getItem("locale") || "hu");

const setLocale = (l) => {
  locale.value = l;
  localStorage.setItem("locale", l);
};

const toggleLocale = () => {
  setLocale(locale.value === "hu" ? "en" : "hu");
};

const msg = computed(() => messages[locale.value] || messages.hu);
const currentFlag = computed(() => (locale.value === "hu" ? "🇭🇺" : "🇬🇧"));

const openMap = () => {
  window.open(
    "https://www.google.com/maps/search/Forster+Vadászkastély,+2347+Bugyi,+Radányi+utca+14",
    "_blank"
  );
};
</script>

<style scoped>
:root {
  --c-bg: #f0d3d3; /* light neutral */
  --c-accent: #c59b6e; /* warm accent */
  --c-card: #ddbea9; /* card bg */
  --c-text: #68705c; /* text */
  --c-muted: #8b7a73; /* muted */
  --timeline-accent: #a84d79; /* purple/magenta */
}

.page-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--c-bg);
  color: var(--c-text);
}

.content-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
}

.card {
  max-width: 720px;
  width: 100%;
  background: var(--c-card);
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  padding: 24px;
}

.title {
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--c-text);
}

.meta {
  color: var(--c-text);
  margin-top: 6px;
}

.links q-btn {
  margin-top: 10px;
}

.program-section {
  margin-top: 12px;
  text-align: left;
}

.program-section h3 {
  color: var(--c-text);
  margin: 0 0 16px 0;
  font-size: 1.5rem;
}

:deep(.q-timeline__entry-dot) {
  background-color: var(--timeline-accent) !important;
}

:deep(.q-timeline__entry-dot svg) {
  color: white !important;
}

:deep(.q-timeline__dot-separator) {
  background-color: var(--timeline-accent) !important;
}

:deep(.q-timeline__entry-title) {
  color: var(--c-text) !important;
  font-weight: 600;
  font-size: 1rem;
}

:deep(.q-timeline__entry-subtitle) {
  color: var(--c-muted) !important;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

.info {
  margin-top: 12px;
  color: var(--c-text);
  line-height: 1.6;
  text-align: left;
}

/* language button */
.lang-btn {
  min-width: 40px;
  min-height: 40px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.lang-btn .flag {
  font-size: 20px;
  line-height: 1;
}
</style>
