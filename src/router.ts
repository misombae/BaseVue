import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import _ from 'lodash'

// Sample
import Login from "./views/Login.vue";

import axios from 'axios';
import apiUrl from './assets/base';

let routes: any[] = [{
  path: "/",
  name: "Login",
  component: Login,
  meta: { layout: "empty" },
},
];

function getMenu(b: any){
  var menu = { path : b.path, name : b.name, component : ()=> import("./layout/EmptyLayout.vue") };
  if(b.children) menu.children = b.children;
  else menu.component = () => import( "./views/" + b.component + ".vue") ;
  return menu;
}

await axios.get(apiUrl+"/menu/list").then((res)=>{
  var list = res.data.data;
  //childen 생성
  list.forEach((a: any)=> {
      a.children = [];
      list.forEach((b : any ,idx :number )=>{
        if(a.menuId == b.upperMenuId){
          list[idx] = getMenu(b);
          a.children.push( list[idx] );
          if(b.component.indexOf("List")>0){
            a.children.push(
              getMenu({ path : b.path+"/:id", name : b.name+"상세", component: b.component.replace("List","Info")})
            );
          }
        }// if
      });//forEach
      if(a.children.length==0) delete a.children;
  });
  //최상위 메뉴만
  list.forEach((a: any)=>{ 
    if(a.menuId){
      routes.push( getMenu(a) );
    }
  });
});

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

export default router;
