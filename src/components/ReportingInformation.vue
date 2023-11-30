<template>
    <div class="container">
        <div class="calendar-list">
            <div class="calendar-items">
                <template v-for="(item, index) in dataList">
                    <div :class="item === chooseDate
                        ? 'calendar-item active-calendar-item'
                        : 'calendar-item'
                        " :key="index" @click="chooseDateFun(item)">
                        <div :class="item <= maxDate
                            ? item === chooseDate
                                ? 'common-mid-font active-font'
                                : 'common-mid-font'
                            : 'common-mid-font disabled-font'
                            ">
                            周{{ "日一二三四五六".charAt(item.getDay()) }}
                        </div>
                        <div :class="item <= maxDate
                            ? item === chooseDate
                                ? 'common-mid-font active-font'
                                : 'common-mid-font'
                            : 'common-mid-font disabled-font'
                            ">
                            {{ item.getDate() }}
                        </div>
                    </div>
                </template>
                <div class="calendar-items-line"></div>
            </div>
            <div class="calendar-right" @click="showCalendar = true">
                <div class="small-light-font">{{ chooseDate.getFullYear() }}年</div>
                <div class="calendar-right-bottom">
                    <div class="common-dark-font">{{ chooseDate.getMonth() + 1 }}月</div>
                    <img src="@/assets/common/xia.png" alt="">
                </div>
            </div>

        </div>
        <van-swipe style="height:450px" :loop="false" :show-indicators="false" vertical>
            <van-swipe-item v-for="(item, index) in ReportInfo" :key="index">
                <div class="calendar-info">
                    <div class="calendar-info--data">
                        <div class="not1">
                            <label>来源订单号</label>
                            <div class="sol">{{ item.SourceCode }}</div>
                        </div>
                        <div class="not1">
                            <label>生产订单号</label>
                            <div class="sol">{{ item.orderCode }}</div>
                        </div>
                        <div class="not1">
                            <label>产品图号</label>
                            <div class="sol">{{ item.productDrawing }}</div>
                        </div>
                        <div class="not1">
                            <label>工序号</label>
                            <div class="sol">{{ item.prodstdaCpcode }}</div>
                        </div>
                        <div class="not1">
                            <label>报工合格数</label>
                            <div class="sol" :class="item.reportQualifiedNumber == '未审核' ? 'yellow' : ''">
                                {{ isStringNumber(item.reportQualifiedNumber) }}
                                <span v-if="item.reportQualifiedNumber != '未审核'">{{ item.unit }}</span>
                            </div>
                        </div>
                        <div class="not1">
                            <label>报工不合格数</label>
                            <div class="sol" :class="item.reportUnqualifiedNumber == '未审核' ? 'yellow' : ''">
                                {{ isStringNumber(item.reportUnqualifiedNumber) }}
                                <span v-if="item.reportUnqualifiedNumber != '未审核'">{{ item.unit }}</span>
                            </div>
                        </div>
                        <div class="not1">
                            <label>审核合格数</label>
                            <div class="sol" :class="item.reviewQualifiedNumber == '未审核' ? 'yellow' : ''">
                                {{ isStringNumber(item.reviewQualifiedNumber) }}
                                <span v-if="item.reviewQualifiedNumber != '未审核'">{{ item.unit }}</span>
                            </div>
                        </div>
                        <div class="not1">
                            <label>审核不合格数</label>
                            <div class="sol" :class="item.reviewUnqualifiedNumber == '未审核' ? 'yellow' : ''">
                                {{ isStringNumber(item.reviewUnqualifiedNumber) }}
                                <span v-if="item.reviewUnqualifiedNumber != '未审核'">{{ item.unit }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </van-swipe-item>
        </van-swipe>

        <yiyun-time-date :showDatetime="showCalendar" title="请选择时间" type="date" :chooseDate="chooseDate" :maxDate="maxDate"
            @cancel="showCalendar = false" @confirm="onConfirm" outputIsDate></yiyun-time-date>
    </div>
</template>
<script>
import $axios from '../utils/axios'
import { getFullDate } from '../utils/utils'
import YiyunTimeDate from './YiyunTimeDate'
export default {
    name: 'report',
    data() {
        return {
            // 周列表
            dataList: [],
            // 显示日历
            showCalendar: false,
            // 最小日历时间
            // minDate: new Date('2010/1/1'),
            // 最大日历时间
            maxDate: new Date(),
            // 选择范围:1:1天,2：3天,3：1个月,4：3个月
            chooseRange: 1,
            // 选中日期
            chooseDate: new Date(),

            ReportInfo: [],
        }
    },
    components: {
        YiyunTimeDate,
    },
    watch: {

    },
    methods: {
        // 获取周列表
        async getDataList(date) {
            let arr = [];
            for (let i = 0; i < 7; i++) {
                const time = new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate() + i
                );
                // console.log(time)
                arr.push(time);
            }
            this.dataList = arr;
            // console.log(arr)
            this.chooseDate = arr[0];
            // console.log('this.chooseDate',getFullDate(this.chooseDate))
        },
        // 日历确定
        async onConfirm(date) {
            // console.log(date)

            this.getDataList(date);
            // console.log(getFullDate(date))
            this.GetMyReportInfoFun(getFullDate(date));
            this.showCalendar = false;
        },
        // 周选择
        async chooseDateFun(date) {
            // console.log(date)
            if (date > this.maxDate) return;
            this.chooseDate = date;
            this.GetMyReportInfoFun(getFullDate(date));
        },
        //判断是不是字符串数字
         isStringNumber(value) {
            if(Number(value)){
                return Number(value)
            }
            return value
        },
        async GetMyReportInfoFun(reportDate) {
            $axios.post('/api/ITCProduction/GetMyReportInfo',
                {
                    reportDate: reportDate,
                    memberId: sessionStorage.getItem('MemberId')
                }
            ).then(res => {
                if (res.code == 0) {
                    // if(res.data){}
                    this.ReportInfo = res.data
                } else {
                    this.$notify({ type: 'danger', message: res.msg })
                }
            })
        },


    },
    async mounted() {
        await this.getDataList(new Date());
        await this.GetMyReportInfoFun(getFullDate(new Date()))
    }
}
</script>
    
<style scoped lang='scss'>
.calendar-list {
    height: 3rem;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ebedf0;
    background-color: #fff;

    .calendar-items {
        width: 80%;
        display: flex;
        align-items: center;
        padding-left: 0.8rem;
        height: 100%;

        .calendar-item {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
        }

        .active-calendar-item {
            background-color: rgba(3, 110, 213, 0.1);
        }

        .calendar-items-line {
            background-color: #ebedf0;
            width: 1px;
            height: 2rem;
            margin-left: 0.45rem;
        }
    }

    .calendar-right {
        width: 20%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .calendar-right-bottom {
            display: flex;
            align-items: center;
            justify-content: center;

            img {
                width: 0.8rem;
                color: #303133;
            }
        }
    }
}

.calendar-info {
    width: 100%;
    padding: 10px;

    .calendar-info--data {
        width: 100%;
        background-color: #ffffff;
        border-radius: 4px;

        .not1 {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 26px;
            line-height: 50px;
            border-bottom: 1px solid #E6E6E6;

            label {
                color: #666666;
                font-size: 14px;
            }

            .sol {
                color: #333333;
                font-size: 14px;
                display: flex;
                align-items: center;

                span {
                    margin-left: 10px;
                    color: #666666;
                }
            }

            .yellow {
                color: #FFBE40;
            }
        }
    }
}

// 激活字
.active-font {
    color: #036ed5;
}

// 禁用字
.disabled-font {
    color: #c8c9cc;
}

.no-font {
    color: #c0c4cc;
}
</style>
  