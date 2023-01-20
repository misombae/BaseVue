<template>
    <div>
        <n-space>
            <div v-bind:key="path" v-for="(item) in tabList" >
                <n-tag closable @close="handleClose(item)" size="large" type="info" :class="[item.path  == state.activeKey? 'route-active' : '']">
                    <router-link :to="item.path" tag="button">
                        {{ item.name }}
                    </router-link>
                </n-tag> 
            </div>
        </n-space>
    </div>
</template>

<!-- type="[item.path == state.activeKey? 'info' : 'error']"
<template>
    <div>
        <n-space>
            <ul>
                <li  v-for="(item) in tabList" v-bind:key="path">
                    <router-link :to="item.path" tag="button" active-class>
                        {{item.name}}
                    </router-link>
                </li>
            </ul>
        </n-space>
        <router-view></router-view>
    </div>
</template>
-->

<script>
import { defineComponent, ref, onMounted, h, computed, reactive, watch } from "vue";
import { useTabsViewStore } from '../store/modules/tagsView';
import { useRoute, useRouter } from 'vue-router';
import { RouterLink } from 'vue-router';
import { NTag } from "naive-ui";
export default defineComponent({
    setup() {
        const tabsViewStore = useTabsViewStore();
        // tabsViewStore.addTab( samplePath )
        const tabList = computed(() => tabsViewStore.tabsList);
        const route = useRoute();
        const router = useRouter();
        const handleClose = (item) => {
            tabsViewStore.closeTab(item)
        }

        const state = reactive({
            activeKey: route.path,
            tagStyle : 'info',
            //scrollable: false,
            //dropdownX: 0,
            //dropdownY: 0,
            //showDropdown: false,
            //isMultiHeaderFixed: false,
            //multiTabsSetting: getMultiTabsSetting,
        });

        watch(
            () => route.path,
            (to) => {
                debugger;
                state.activeKey = to;
                console.log(`tag${state.activeKey.split('/').join('\/')}`)
                console.log(state.activeKey)
            },
            { immediate: true }
        );

       
        // const tagsRef = tabList.value
        return{
            tabsViewStore,
            tabList,
            handleClose,
            state,
            //tags: tagsRef,
            // renderTag: (tag, index) => {
            //     return h(NTag,
            //         {
            //             type: index < 3 ? "success" : "error",
            //             disabled: index > 3,
            //             closable: true,
            //             onClose: () => {
            //                 debugger;
            //                 console.log(index)
            //                 tagsRef.splice(index, 1);
            //                 //tagsRef.value.splice(index, 1);
            //             }
            //         },
            //         {
            //             default: () => tag.name
            //         }
            //     );
            // }
        }
    },
    
})
</script>

<style>
.route-active {
    background-color: #15ce71de;
    color: white;
}
.route-active1 #mypage-button {
  background-color: #653fd3;
  border-radius: 10%;
  color: white;
  padding: 10px;
  border: #653fd3;
  /* cursor: pointer; */
} 
</style>