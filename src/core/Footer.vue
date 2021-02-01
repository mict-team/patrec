<template>
  <v-footer id="dashboard-core-footer">
    <v-container>
      <v-row align="center" no-gutters>
        <v-col
          v-for="(link, i) in links"
          :key="i"
          class="text-center mb-sm-0 mb-5"
          cols="auto"
        >
          <a
            :href="link.href"
            class="mr-0 grey--text text--darken-3"
            rel="noopener"
            target="_blank"
            v-text="link.text"
          />
        </v-col>

        <v-spacer class="hidden-sm-and-down" />

        <v-col cols="12" md="auto">
          <div class="body-1 font-weight-light pt-6 pt-md-0 text-center">
            &copy; {{ currentYear }}, by
            <a href="https://www.mictexplorers.com">Mict Explorers Ltd</a> for a
            better healthcare services.
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  name: "DashboardCoreFooter",

  data: () => ({
    links: [
      {
        href: "http://patrec.com.ng/feedback",
        text: "Send Feddback"
      },
      {
        href: "http://patrec.com.ng/help",
        text: "Help"
      },
      {
        href: "http://patrec.com.ng/blog",
        text: "Blog"
      },
      {
        href: "http://patrec.com.ng/license",
        text: "Licenses"
      },
      {
        href: "http://patrec.com.ng/ptc",
        text: "Privacy and Terms"
      }
    ]
  }),
  computed: {
    currentYear() {
      return String(new Date().getFullYear());
    }
  }
};
</script>

<style lang="sass">
#dashboard-core-footer
  a
    font-size: .825rem
    font-weight: 500
    text-decoration: none
    text-transform: uppercase
</style>
