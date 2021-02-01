<template>
  <div class="row">
    <div class="col-md-12">
      <div class="box" v-if="design == 1">
        <input
          type="file"
          name="file-1[]"
          id="file-1"
          ref="file"
          class="inputfile inputfile-1"
          @change="
            attachFile($event.target.name, $event.target.files);
            fileCount = $event.target.files.length;
          "
        />
        <label for="file-1" ref="label"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="17"
            viewBox="0 0 20 17"
          >
            <path
              d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"
            />
          </svg>
          <span>Choose a file&hellip;</span></label
        >
      </div>

      <div class="box" v-if="design == 2">
        <input
          type="file"
          name="file-2[]"
          id="file-2"
          ref="file"
          class="inputfile inputfile-2"
          @change="
            attachFile($event.target.name, $event.target.files);
            fileCount = $event.target.files.length;
          "
        />
        <label for="file-2" ref="label"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="17"
            viewBox="0 0 20 17"
          >
            <path
              d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"
            />
          </svg>
          <span>Choose a file&hellip;</span></label
        >
      </div>

      <div class="box" v-if="design == 3">
        <input
          type="file"
          name="file-3[]"
          id="file-3"
          ref="file"
          class="inputfile inputfile-3"
          @change="
            attachFile($event.target.name, $event.target.files);
            fileCount = $event.target.files.length;
          "
        />
        <label for="file-3" ref="label"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="17"
            viewBox="0 0 20 17"
          >
            <path
              d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"
            />
          </svg>
          <span>Choose a file&hellip;</span></label
        >
      </div>

      <div class="box" v-if="design == 4">
        <input
          type="file"
          name="file-4[]"
          id="file-4"
          ref="file"
          class="inputfile inputfile-3"
          @change="
            attachFile($event.target.name, $event.target.files);
            fileCount = $event.target.files.length;
          "
        />
        <label for="file-4" ref="label"
          ><span>Choose a file&hellip;</span></label
        >
      </div>

      <div class="box" v-if="design == 5">
        <input
          type="file"
          name="file-5[]"
          id="file-5"
          ref="file"
          class="inputfile inputfile-4"
          @change="
            attachFile($event.target.name, $event.target.files);
            fileCount = $event.target.files.length;
          "
        />
        <label for="file-5" ref="label"
          ><figure>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="17"
              viewBox="0 0 20 17"
            >
              <path
                d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"
              />
            </svg>
          </figure>
          <span>Choose a file&hellip;</span></label
        >
      </div>

      <div class="box" v-if="design == 6">
        <input
          type="file"
          name="file-6[]"
          id="file-6"
          ref="file"
          class="inputfile inputfile-5"
          @change="
            attachFile($event.target.name, $event.target.files);
            fileCount = $event.target.files.length;
          "
        />
        <label for="file-6" ref="label"
          ><figure>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="17"
              viewBox="0 0 20 17"
            >
              <path
                d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"
              />
            </svg>
          </figure>
          <span></span
        ></label>
      </div>

      <div class="box" v-if="design == 7">
        <input
          type="file"
          name="file-7[]"
          id="file-7"
          ref="file"
          class="inputfile inputfile-6"
          @change="
            attachFile($event.target.name, $event.target.files);
            fileCount = $event.target.files.length;
          "
        />
        <label for="file-7" ref="label"
          ><span></span>
          <strong
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="17"
              viewBox="0 0 20 17"
            >
              <path
                d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"
              />
            </svg>
            Choose a file&hellip;</strong
          ></label
        >
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "upload-selector",
  props: {
    label: {
      type: String,
      default: ""
    },
    accept: {
      type: String,
      default: ".csv"
    },
    design: {
      type: Number,
      default: 5
    },
    multiple: {
      type: String,
      default: ""
    }
  },
  components: {},
  data() {
    return {
      files: [],
      fileCount: 0
    };
  },
  methods: {
    attachFile: function(fieldName, fileList) {
      let formData = new FormData();
      if (!fileList.length) return;

      var process = new Promise(resolve => {
        // this.files = fileList;
        // for( var i = 0; i < this.files.length; i++ ){
        //     let file = this.files[i];

        //     formData.append('files[' + i + ']', file);
        // }
        Array.from(Array(fileList.length).keys()).map(x => {
          formData.append("file", fileList[x]);
        });

        resolve(true);
      });
      process.then(resp => {
        this.$emit("sendFile", formData);
      });
    },
    processFile: function() {
      let promise = new Promise((resolve, reject) => {
        var reader = new FileReader();
        var vm = this;
        reader.onload = e => {
          resolve((vm.fileinput = reader.result));
        };
        reader.readAsText(this.files);
      });

      promise.then(
        result => {
          /* handle a successful result */
          console.log(this.fileinput);
          this.$emit("sendFile", this.fileinput);
        },
        error => {
          /* handle an error */

          console.log(error);
        }
      );
    }
  }
};
</script>
<style scoped>
.box {
  text-align: center;
}

.inputfile {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}

.inputfile + label {
  max-width: 100%;
  font-size: 1.25rem;
  /* 20px */
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  display: inline-block;
  overflow: hidden;
  padding: 0.625rem 1.25rem;
  /* 10px 20px */
}

.inputfile:focus + label,
.inputfile.has-focus + label {
  outline: 1px dotted #000;
  outline: -webkit-focus-ring-color auto 5px;
}

.inputfile + label * {
  /* pointer-events: none; */
  /* in case of FastClick lib use */
}

.inputfile + label svg {
  width: 1em;
  height: 1em;
  vertical-align: middle;
  fill: currentColor;
  margin-top: -0.25em;
  /* 4px */
  margin-right: 0.25em;
  /* 4px */
}

/* style 1 */

.inputfile-1 + label {
  color: #f1e5e6;
  background-color: #d3394c;
}

.inputfile-1:focus + label,
.inputfile-1.has-focus + label,
.inputfile-1 + label:hover {
  background-color: #722040;
}

/* style 2 */

.inputfile-2 + label {
  color: #d3394c;
  border: 2px solid currentColor;
}

.inputfile-2:focus + label,
.inputfile-2.has-focus + label,
.inputfile-2 + label:hover {
  color: #722040;
}

/* style 3 */

.inputfile-3 + label {
  color: #d3394c;
}

.inputfile-3:focus + label,
.inputfile-3.has-focus + label,
.inputfile-3 + label:hover {
  color: #722040;
}

/* style 4 */

.inputfile-4 + label {
  color: #d3394c;
}

.inputfile-4:focus + label,
.inputfile-4.has-focus + label,
.inputfile-4 + label:hover {
  color: #722040;
}

.inputfile-4 + label figure {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #d3394c;
  display: block;
  padding: 20px;
  margin: 0 auto 10px;
}

.inputfile-4:focus + label figure,
.inputfile-4.has-focus + label figure,
.inputfile-4 + label:hover figure {
  background-color: #722040;
}

.inputfile-4 + label svg {
  width: 100%;
  height: 100%;
  fill: #f1e5e6;
}

/* style 5 */

.inputfile-5 + label {
  color: #d3394c;
}

.inputfile-5:focus + label,
.inputfile-5.has-focus + label,
.inputfile-5 + label:hover {
  color: #722040;
}

.inputfile-5 + label figure {
  width: 100px;
  height: 135px;
  background-color: #d3394c;
  display: block;
  position: relative;
  padding: 30px;
  margin: 0 auto 10px;
}

.inputfile-5:focus + label figure,
.inputfile-5.has-focus + label figure,
.inputfile-5 + label:hover figure {
  background-color: #722040;
}

.inputfile-5 + label figure::before,
.inputfile-5 + label figure::after {
  width: 0;
  height: 0;
  content: "";
  position: absolute;
  top: 0;
  right: 0;
}

.inputfile-5 + label figure::before {
  border-top: 20px solid #dfc8ca;
  border-left: 20px solid transparent;
}

.inputfile-5 + label figure::after {
  border-bottom: 20px solid #722040;
  border-right: 20px solid transparent;
}

.inputfile-5:focus + label figure::after,
.inputfile-5.has-focus + label figure::after,
.inputfile-5 + label:hover figure::after {
  border-bottom-color: #d3394c;
}

.inputfile-5 + label svg {
  width: 100%;
  height: 100%;
  fill: #f1e5e6;
}

/* style 6 */

.inputfile-6 + label {
  color: #d3394c;
}

.inputfile-6 + label {
  border: 1px solid #d3394c;
  background-color: #f1e5e6;
  padding: 0;
}

.inputfile-6:focus + label,
.inputfile-6.has-focus + label,
.inputfile-6 + label:hover {
  border-color: #722040;
}

.inputfile-6 + label span,
.inputfile-6 + label strong {
  padding: 0.625rem 1.25rem;
  /* 10px 20px */
}

.inputfile-6 + label span {
  width: 200px;
  min-height: 2em;
  display: inline-block;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  vertical-align: top;
}

.inputfile-6 + label strong {
  height: 100%;
  color: #f1e5e6;
  background-color: #d3394c;
  display: inline-block;
}

.inputfile-6:focus + label strong,
.inputfile-6.has-focus + label strong,
.inputfile-6 + label:hover strong {
  background-color: #722040;
}

@media screen and (max-width: 50em) {
  .inputfile-6 + label strong {
    display: block;
  }
}
</style>
