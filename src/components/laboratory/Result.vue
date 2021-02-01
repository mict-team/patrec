<template>
    <v-container>
        <v-toolbar row wrap>
            <v-btn color="red" @click="$router.go(-1)"
                ><v-icon white-text>keyboard_arrow_left</v-icon><span>Cancel</span></v-btn
            >
            <v-toolbar-title>Test result for {{ tobeFilled.name }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="saveResult">Post test result</v-btn>
        </v-toolbar>
        <v-card>
            <v-container grid-list-sm class="pa-4">
                <v-layout row wrap>
                    <table class="table">
                        <tbody>
                            <tr><th width="5%" style="text-align:right">Department:</th><td>{{tobeFilled.dept}}</td></tr>
                            <tr><th style="text-align:right">Date:</th><td>{{tobeFilled.date_of_request}}</td></tr>
                            <tr><th style="text-align:right">Request:</th><td>{{tobeFilled.test}}</td></tr>
                            <tr><th style="text-align:right">By:</th><td>{{tobeFilled.doctor}}</td></tr>
                            <tr><th style="text-align:right">Patient:</th><td>{{tobeFilled.name}} {{ tobeFilled.dob | toAge }}yrs {{ tobeFilled.gender }}</td></tr>
                        </tbody>
                    </table>
                </v-layout>
            </v-container>
        </v-card>
        <h3>Test Result</h3>
        <v-card>
            <v-container grid-list-sm class="pa-4">
                <v-layout row wrap>
                    
                    <v-flex xs4>
                        <label>Test conducted & signed by</label>
                        <input type="text" v-model="test.user" class="form-control" />
                    </v-flex>
                    <v-flex xs8>
                        <label>Test Result</label>
                        <input type="text" v-model="test.result" class="form-control" />
                    </v-flex>
                    <v-flex xs12>
                        <label>Remark of the test</label>
                        <textarea
                            class="form-control"
                            col="100%"
                            row="15%"
                            v-model="test.remark"
                        ></textarea>
                    </v-flex>
                    <v-flex xs9>
                        <base-image-input v-model="avatar">
                            <div slot="activator">
                                <input
                                    type="file"
                                    class="form-control"
                                    v-ripple
                                    multiple
                                    placeholder="Select result image (If available)"
                                />

                                <div v-ripple v-if="avatar" class="mb-3">
                                    <img
                                    :src="avatar.imageURL"
                                    alt="avatar"
                                    
                                    />
                                </div>
                            </div>
                        </base-image-input>
                        <div id="dwt-container"></div>
                    </v-flex>
                    <v-flex xs3>
                        <v-btn class="danger" @click="scanDocs">Scan Result</v-btn>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-card>
    </v-container>
</template>

<script>
import { URL, LS, SHA256 } from "../../shared/config.js";
import { STATE, LGAS } from "../../shared/state.js";
import { mapState, mapActions } from "vuex";
import UploadFile from "../shared/UploadFile";
import scanner from "scanner";
var scanRequest = {
    "use_asprise_dialog": true, // Whether to use Asprise Scanning Dialog
    "show_scanner_ui": false, // Whether scanner UI should be shown
    "twain_cap_setting": { // Optional scanning settings
        "ICAP_PIXELTYPE": "TWPT_RGB" // Color
    },
    "output_settings": [{
        "type": "return-base64",
        "format": "jpg"
    }]
};
export default {
    data:()=>{
        return {
            testResult: false,
            tobeFilled: [],
            users:[],
            section: -1,
            test: {
                user: "",
                result: "",
                remark: "",
                file: ""
            },
            avatar: null,
            scannedImage:[],
        }
    },
    props: {
        source: String
    },
    watch: {
        avatar: {
            handler: function() {
                this.saved = false;
            },
            deep: true
        }
    },
    components: {
        UploadFile
    },
    computed: {
        ...mapState([
            "domain",
            "outlet",
            "search",
            "departments",
            "platforms",
            "settings",
            "today"
        ]),
        isImagesScanned(){
            return this.scannedImage.length>0
        }
    },
    methods:{
        ...mapActions(["setDomain", "setSearch", "checkStorage", "setToday"]),
        uploadImage() {
            setTimeout(() => this.saveResult(), 1000);
        },
        
        saveResult: function() {
            this.$Progress.start()
            let payload={
                id: this.tobeFilled.id,
                user: this.test.user,
                result: this.test.result,
                remark: this.test.remark,
                file: this.avatar.base64,

            }

            this.post(`/patient/lab-request`, payload)
            .then(response => {
                if (response.status > 0) {
                    this.$toastr.success(`Test result posted successfully.`);
                    this.testResult = false;
                    this.$router.push('/requests');
                } else {
                    this.$toastr.error(`Test result could not be posted.Kindly try again later.`);
                }
            })
            .finally(() => {
                this.$Progress.finish()
            });
        },
        scanDocs: function() {
            scanner.scan(this.displayImagesOnPage, scanRequest);
        },
        displayImagesOnPage(successful, mesg, response) {
            if (!successful) { // On error
                console.error('Failed: ' + mesg);
                return;
            }
            if (successful && mesg != null && mesg.toLowerCase().indexOf('user cancel') >= 0) { // User cancelled.
                console.info('User cancelled');
                return;
            }
            var scannedImages = scanner.getScannedImages(response, true, false); // returns an array of ScannedImage
            for (var i = 0;
                (scannedImages instanceof Array) && i < scannedImages.length; i++) {
                this.scannedImage = scannedImages[i];
                /*var elementImg = scanner.createDomElementFromModel({
                    'name': 'img',
                    'attributes': {
                        'class': 'scanned',
                        'src': scannedImage.src
                    }
                });*/
                (document.getElementById('images') ? document.getElementById('images') : document.body).appendChild(elementImg);
            }
        }
    },
    mounted(){
        this.tobeFilled=LS.get("testR");
    }
}
</script>

<style>

</style>