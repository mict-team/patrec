<template>
  <div>
    <!-- slot for parent component to activate the file changer -->
    <div @click="launchFilePicker()">
      <slot name="activator"></slot>
    </div>
    <!-- image input: style is set to hidden and assigned a ref so that it can be triggered -->

    <input
      type="file"
      ref="file"
      :name="uploadFieldName"
      @change="onFileChange($event.target.name, $event.target.files)"
      style="display:none"
      accept=".csv"
    />
    <!-- error dialog displays any potential error messages -->
    <v-dialog v-model="errorDialog" max-width="300">
      <v-card>
        <v-card-text class="subheading">{{ errorText }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="errorDialog = false">Got it!</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "csv-input",
  data: () => ({
    errorDialog: null,
    errorText: "",
    uploadFieldName: "file",
    maxSize: 1024,
    sortOrders: {},
    parse_header: [],
    parse_csv: [],
    sortKey: ""
  }),
  props: {
    // Use "value" to enable using v-model
    value: Object
  },
  methods: {
    launchFilePicker() {
      this.$refs.file.click();
    },
    onFileChange(fieldName, file) {
      //console.log(file[0])
      const { maxSize } = this;
      let csvFile = file[0];
      let csv = [];
      var vm = this;
      if (file.length > 0) {
        let csvURL = "../assets/csv-flat.png";
        if (window.FileReader) {
          var reader = new FileReader();
          reader.readAsText(csvFile);
          // Handle errors load
          reader.onload = function(event) {
            var parsecsv = event.target.result;
            csv = vm.csvJSON(parsecsv);
            vm.$emit("input", { csv, csvURL });
          };
          reader.onerror = function(evt) {
            if (evt.target.error.name == "NotReadableError") {
              vm.$toastr.error("Canno't read file !");
            }
          };
        } else {
          this.$toastr.error("FileReader are not supported in this browser.");
        }
      }
    },
    csvJSON(csv) {
      var vm = this;
      var lines = csv.split("\n");
      var result = [];
      var headers = lines[0].split(",");
      this.parse_header = lines[0].split(",");
      lines[0].split(",").forEach(function(key) {
        vm.sortOrders[key] = 1;
      });

      lines.map(function(line, indexLine) {
        if (indexLine < 1) return; // Jump header line

        var obj = {};
        var currentline = vm.lineToArray(line); //line.split(",")
        //console.log(currentline); return false;
        headers.map(function(header, indexHeader) {
          obj[
            header
              .replace("\r", "")
              .replace("\n", "")
              .toLowerCase()
          ] = currentline[indexHeader].replace("\r", "").replace("\n", "");
        });

        result.push(obj);
      });

      result.pop(); // remove the last item because undefined values

      return result; // JavaScript object
    },
    sortBy: function(key) {
      var vm = this;
      vm.sortKey = key;
      vm.sortOrders[key] = vm.sortOrders[key] * -1;
    },
    lineToArray: function(text) {
      let ret = [""],
        i = 0,
        p = "",
        s = true;
      for (let l in text) {
        l = text[l];
        if ('"' === l) {
          s = !s;
          if ('"' === p) {
            ret[i] += '"';
            l = "-";
          } else if ("" === p) l = "-";
        } else if (s && "," === l) l = ret[++i] = "";
        else ret[i] += l;
        p = l;
      }
      return ret;
    }
  }
};
</script>
