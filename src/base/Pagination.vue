<template>
    <v-toolbar row wrap>
        <v-row class="mt-6">
            <v-col cols="12" md="4">
                <div class="input-group">
                    <input type="text" class="form-control" placeholder="Search" v-model="searchStr" />
                    <span style="background-color:#ccc;">
                    <button class="btn" @click="bysearch"><v-icon>search</v-icon></button>
                    </span>
                </div>
            </v-col>
            <v-col cols="12" md="1"></v-col>
            <v-col cols="12" md="5">
                <v-btn class="danger" fab small title="All records" @click="getAll"><v-icon color="white">mdi-cellphone-screenshot</v-icon></v-btn>
                <span class="ml-2 mt-3">{{getPage}} of {{getTotal}}</span>
                <v-btn class="ml-2" min-width="0" fab small text title="Mark as unread" :disabled="page<=1" @click="previosPage"><v-icon>keyboard_arrow_left</v-icon></v-btn>
                <v-btn class="ml-2" min-width="0" fab small text title="Mark as unread" :disabled="page>=getTotal" @click="nextPage"><v-icon>keyboard_arrow_right</v-icon></v-btn>
            </v-col>
            <v-col cols="12" md="2">
                <v-select
                    v-model="size"
                    :items="items"
                    label="Select page size"
                    dense
                    solo
                    @change="changePageSize"
                ></v-select>
            </v-col>
        </v-row>
    </v-toolbar>
</template>

<script>
export default {
    data:()=>{
        return{
            page: 1,
            size:0,
            searchStr:'',
            items: ['5', '10', '50', '100'],
        }
    },
    props:{
        callback:{
            type: Function,
            required: true,
            default: function(response) {}
        },
        initialPage: {
            type: [Number, String],
            default: 1
        },
        total: {
            type: [Number, String],
            default: 0
        },
        pageSize: {
            type: [Number, String],
            default: 10
        },
    },
    computed:{
        getTotal(){
            return Math.ceil(this.total/this.size);
        },
        getPage(){
            return (this.page==0)?0: this.page;
        }
    },
    methods: {
        previosPage: function(){
            this.page -=1;
            this.page=(this.page<1)?1:this.page;
            this.callback({page: this.page, pageSize: this.pageSize, search: this.searchStr});
        },
        nextPage: function(){
            this.page +=1;
            this.page=(this.page > Math.ceil(this.total/this.pageSize))?1:this.page;
            this.callback({page: this.page, pageSize: this.pageSize, search: this.searchStr});
        },
        getAll: function(){
            this.page =0;
            this.callback({page: this.page, pageSize: this.pageSize, search: this.searchStr});
        },
        bysearch: function(){
            this.page =0;
            this.callback({page: this.page, pageSize: this.pageSize, search: this.searchStr});
        },
        changePageSize: function(){
            this.callback({page: this.page, pageSize: this.size, search: this.searchStr});
        }
    },
    mounted(){
        this.page=this.initialPage;
        this.size=this.pageSize
    }
}
</script>

<style>

</style>