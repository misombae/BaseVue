<template>
    <n-layout embedded content-style="padding: 24px;">
      <n-h1>
        <n-text type="info">Vue 파일 관리</n-text>
      </n-h1>

      <n-form-item label="파일">
          <n-space vertical>
              <n-input-group>
                  <n-input v-model:value="vueFile.path" placeholder=" views/ 하위경로" />
                  <n-input value="/" disabled />
                  <n-input v-model:value="vueFile.fileNm" placeholder="파일명" />.vue
              </n-input-group>
          </n-space>
      </n-form-item>

      <n-form-item label="템플릿">
        <n-select :options="templateOpts" v-model:value="vueFile.sno" :default-value="'1'" @update:value="templateUpdateValue" />
      </n-form-item>

      <div v-for="obj in set" :key="obj">
        <div v-if="obj.key!=='#{columns}'">
          <n-form-item :label="obj.name? obj.name : ''">
            <n-input v-model:value="obj.val" :placeholder="obj.key"/>
          </n-form-item>
        </div>
        <div v-if="obj.key==='#{columns}'">
          <n-form-item label="테이블 선택">
            <n-select :options="tableList" @update:value="tableUpdateValue" />
          </n-form-item>
          <n-form-item label="컬럼 선택" v-show="columnList.length>0">
            <n-checkbox-group v-model:value="checkedColumns">
              <n-grid :y-gap="3" :cols="2">
                <n-gi v-for="a in columnList" :key="a">
                  <n-space>
                    <n-tooltip trigger="hover">
                      <template #trigger>
                        <n-checkbox :value="a.field" :label="a.field"/>
                      </template>
                      {{a.comment}}
                    </n-tooltip>
                    <n-input v-model:value="a.name" :placeholder="a.comment" />
                  </n-space>
                </n-gi>
              </n-grid>
            </n-checkbox-group>
          </n-form-item>
        </div>
      </div>

      <n-button strong secondary type="warning" @click="makeVue">Vue 생성</n-button>
    </n-layout>
  </template>
  
  <script lang="ts" setup>
  import { defineComponent, onMounted, ref } from "vue";
  import axios from 'axios'
  import apiUrl from '/src/assets/base';
  import { SelectOption } from 'naive-ui'
  import _ from 'lodash';
  
  const set = ref([] as any);
  const templateList = ref([] as any);  //템플릿목록
  const names = { "#{title}" : "화면명", "#{columns}": "컬럼목록", "#{apiPath}" : "API 경로"};
  const vueFile = ref({path : ""});      
  const tableList = ref();              //DB Tables
  const columnList = ref([]);             //Table Columns
  const checkedColumns = ref([] as any);
  const templateOpts = ref([] as any);
  const excludeList = ['MEMO','REGIST_DT','REGIST_ID','UPDATE_DT','UPDATE_ID','USE_YN'];

  //템플릿 조회
  const getTmeplate = () =>{
    axios.get(apiUrl + "/template/list" ).then(res =>{
      templateList.value = res.data.data;
      _.each(templateList.value, (o => {
          templateOpts.value.push({ label : o.templateNm, value : o.sno});
      }));
    });
  }

  //템플릿 선택
  const templateUpdateValue = (value: string, option: SelectOption) => {
    var one = _.find(templateList.value,(o)=>{ return o.sno === value});
    //파일내용 세팅
    vueFile.value.content = one.content;

    //input창 생성
    set.value = _.map( one.content.match(/#{+\b[\w]+}/gi) , o=>{
      var s = { key : o, name : names[o]? names[o]:o };
      if(o==='#{columns}') getTable();
      return s;
    });
  }

  //테이블 조회
  const getTable = ()=>{
    axios.get(apiUrl + "/db/table").then(res=>{
      tableList.value = _.map(res.data.data,o=>{
        return { label : o.toUpperCase(), value : o }
      });
    });
  }

  //테이블 선택
  const tableUpdateValue = (value: string, option: SelectOption) => {
    axios.get(apiUrl + "/db/column?table="+ value).then(res=>{
      // checkedColumns.value = _.map(res.data.data,o=>{return o.field});
      checkedColumns.value = _.chain(res.data.data)
                              .map(o=>{ return o.field})
                              .filter(o=>{ return excludeList.indexOf( o.toUpperCase() )==-1})
                              .value();
      columnList.value = _.map(res.data.data, o =>{ o.name = o.comment; return o });
    });
  }
  
  //Vue 생성
  const makeVue = () =>{

    //1. 컬럼 가공
    var columns = _.map(checkedColumns.value, o => {
       var col = _.find(columnList.value,a=> {return a.field == o});
       return { title: col.name, key: _.camelCase(col.field)} 
    } ) ;

    //content 변수값 치환
    var content = vueFile.value.content;
    _.forEach(set.value,o=>{
      if(o.key=='#{columns}'){
        o.val = JSON.stringify(columns);
      }
      content = content.replace(o.key, o.val);
    });

    vueFile.value.content = content;
    
    axios.post(apiUrl + "/template/make", vueFile.value ).then(res=>{
      alert("생성되었습니다.");
    });
  }


  onMounted(()=>{
    getTmeplate();
  });
  
  </script>
  