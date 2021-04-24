<template>
    <div class="overflow-h">
        <el-row :gutter="10">
            <el-col :span="6" v-show="init.province">
                <el-select v-model="data.provinceValue" @change="handlerProvince">
                    <el-option v-for="item in data.provinceData" :key="item.PROVINCE_CODE" :value="item.PROVINCE_CODE" :label="item.PROVINCE_NAME"></el-option>
                </el-select>
            </el-col>
            <el-col :span="6" v-show="init.city">
                <el-select v-model="data.cityValue" @change="handlerCity">
                    <el-option v-for="item in data.cityData" :key="item.CITY_CODE" :value="item.CITY_CODE" :label="item.CITY_NAME"></el-option>
                </el-select>
            </el-col>
            <el-col :span="6" v-show="init.area">
                <el-select v-model="data.areaValue" @change="handlerArea">
                    <el-option v-for="item in data.areaData" :key="item.AREA_CODE" :value="item.AREA_CODE" :label="item.AREA_NAME"></el-option>
                </el-select>
            </el-col>
            <el-col :span="6" v-show="init.street">
                <el-select v-model="data.streetValue" @change="handlerStreet">
                    <el-option v-for="item in data.streetData" :key="item.STREET_CODE" :value="item.STREET_CODE" :label="item.STREET_NAME"></el-option>
                </el-select>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import { watch } from "@vue/composition-api";
import { cityPicker } from "@/mixins/cityPicker";
import { reactive, onBeforeMount } from "@vue/composition-api";
export default {
    name: "cityPicker",
    props:{
        cityPickerData:{
            type: Object,
            defalut: () => {}
        },
        cityPickerLevel:{
            type: Array,
            defalut: () => []
        }
    },
    setup(props, { emit }){
        // 初始化省市区街联动
        const init = reactive({
            province: false,
            city: false,
            area: false,
            street: false
        })
        // 线件方法
        const { getProvince, handlerProvince, handlerCity, handlerArea, handlerStreet, data, resultData } = cityPicker();
        /* 
        * 初始化
        */
        const initCityPicker = () => {
            if(props.cityPickerLevel.length == 0){
                for(let key in init){
                    init[key] = true;
                }
            }else{
                props.cityPickerLevel.forEach(item => {
                    init[item] = true;
                });
            }
            
        }

        watch([
            () => resultData.provinceValue,
            () => resultData.cityValue,
            () => resultData.areaValue,
            () => resultData.streetValue,
        ], ([province, city, area, street]) => {
            emit('update:cityPickerData', resultData);
        })

        onBeforeMount(() => {
            // 初始化
            initCityPicker()
            // 获取省份
            getProvince()
        })

        return{
            data,
            init,
            handlerProvince,
            handlerCity,
            handlerArea,
            handlerStreet
        }

    }
}
</script>

<style lang="scss" scoped>

</style>