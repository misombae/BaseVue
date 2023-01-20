import { defineStore } from 'pinia';
import { RouteLocationNormalized } from 'vue-router';
import _ from 'lodash';
import { useRoute, useRouter } from 'vue-router';
const whiteList = ['Redirect', 'login'];
const route = useRoute();
const router = useRouter();
export type RouteItem = Partial<RouteLocationNormalized> & {
  //fullPath: string;
  // path: string;
  // name: string;
  // hash: string;
  // meta: object;
  // params: object;
  // query: object;
  path: string;
  name: string;
};

export type ITabsViewState = {
  tabsList: RouteItem[]; // 标签页
};

function retainAffixRoute(list: any[]) {
  return list.filter((item) => item?.meta?.affix ?? false);
}

export const useTabsViewStore = defineStore({
  id: 'app-tabs-view',
  state: (): ITabsViewState => ({
    tabsList: [],
  }),
  persist: true,
  getters: {},
  actions: {
    initTab(route:any) {
      //this.tabsList = route;
    },
    addTab(route:any) {
      const index = this.tabsList.findIndex((item) => item.path == route.path && item.name == route.name);
      if (index==-1) {
        this.tabsList.push(route);
        router.push({
          path: route.path, 
          name: route.name
        }); 
      }
    },
    closeTab(route: any) {
      const index = this.tabsList.findIndex((item) => item.path == route.path && item.name == route.name);
      this.tabsList.splice(index, 1)
    }
    // closeLeftTabs(route) {
    //   // 关闭左侧
    //   const index = this.tabsList.findIndex((item) => item.fullPath == route.fullPath);
    //   this.tabsList = this.tabsList.filter((item, i) => i >= index || (item?.meta?.affix ?? false));
    // },
    // closeRightTabs(route) {
    //   // 关闭右侧
    //   const index = this.tabsList.findIndex((item) => item.fullPath == route.fullPath);
    //   this.tabsList = this.tabsList.filter((item, i) => i <= index || (item?.meta?.affix ?? false));
    // },
    // closeOtherTabs(route) {
    //   // 关闭其他
    //   this.tabsList = this.tabsList.filter((item) => item.fullPath == route.fullPath || (item?.meta?.affix ?? false));
    // },
    // closeCurrentTab(route) {
    //   // 关闭当前页
    //   const index = this.tabsList.findIndex((item) => item.fullPath == route.fullPath);
    //   this.tabsList.splice(index, 1);
    // },
    // closeAllTabs() {
    //   // 关闭全部
    //   console.log(retainAffixRoute(this.tabsList));
    //   this.tabsList = retainAffixRoute(this.tabsList);
    // },
  },
});
