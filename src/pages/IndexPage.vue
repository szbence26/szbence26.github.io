<template>
  <q-page class="flex row q-pa-xl" style="background-color: #8fbf95">
    <div class="flex-break col-12">
      <div class="q-pa-md q-gutter-md">
        <div class="row justify-between">
          <q-parallax :height="500" :speed="200.5">
            <template v-slot:media>
              <q-img src="src/assets/pic1.jpg" />
            </template>
            <h1 class="text-white">Sára és Bence</h1>
          </q-parallax>
        </div>
      </div>
      <div v-for="c in content" :key="c.text" :class="c.class" :style="c.style">
        <div v-if="c.type === 'text'">{{ c.text }}</div>
        <!-- <div  class="col-6">
        </div> -->
        <!-- <q-img
          v-else-if="c.type === 'image'"
          :src="c.src"
          :style="c.style"
          :ratio="c.ratio"
        /> -->
        <!-- <div v-else-if="c.type === 'image'" class="q-pa-md q-gutter-md">
          <div class="row justify-between">
            <q-parallax :src="c.src">
              <h1 class="text-white">Basic</h1>
            </q-parallax>
          </div>
        </div> -->
        <a v-else-if="c.type === 'link'" :href="c.href" target="_blank"
          >{{ c.text }}
        </a>
        <q-timeline
          v-else-if="c.type === 'timeline'"
          color="secondary"
          :style="c.style"
        >
          <q-timeline-entry
            v-for="e in c.entry"
            :key="e.title"
            :title="e.title"
            :subtitle="e.subtitle"
            :icon="e.icon"
          />
        </q-timeline>
        <q-list v-else-if="c.type === 'list'">
          <q-item-section
            v-for="section in c.sections"
            :key="section.header"
            style="margin: 0"
          >
            <q-separator spaced />
            <q-item-label overline>{{ section.header }}</q-item-label>
            <q-item-label v-for="i in section.items" :key="i">{{
              i
            }}</q-item-label>
          </q-item-section>
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import content from "../resources/content";
import colors from "../resources/colors";
// const title = "Sára és Bence";
const date = "2024. szeptember 21.";
const location = "Helyszín: Session Hotel Ráckeve";
const location2 = "2300 Ráckeve, Termál sétány 1";
</script>
