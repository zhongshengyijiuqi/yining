
<template>
  <van-action-sheet
    v-model="showDatetime"
    @click-overlay="cancel"
    :close-on-click-overlay="false"
  >
    <div class="popup-title-box">
      <div class="popup-close" @click="cancel">关闭</div>
      <div class="popup-title">{{ title }}</div>
      <div class="popup-commit" @click="confirm">提交</div>
    </div>
    <template v-if="type === 'year'">
      <time-picker
        timeType="year"
        :timeData="datetimeDate"
        :dialogVisible="true"
        @submit="submit"
        :disabledDate="disabledDate"
        style="border-bottom: 1px solid #e8e8e8"
      ></time-picker>
    </template>
    <template v-if="type === 'year-month'">
      <time-picker
        timeType="month"
        :timeData="datetimeDate"
        :dialogVisible="true"
        @submit="submit"
        :disabledDate="disabledDate"
        style="border-bottom: 1px solid #e8e8e8"
      ></time-picker>
    </template>
    <template v-if="type === 'date' || type === 'datetime'">
      <time-picker
        timeType="datetime"
        :timeData="datetimeDate"
        @submit="submit"
        :dialogVisible="showCalendar"
        :disabledDate="disabledDate"
        style="border-bottom: 1px solid #e8e8e8"
      ></time-picker>
      <div class="time-list" v-show="!showCalendar" @click="againChoose">
        <div class="time-list-left">
          <img src="@/assets/common/calendar.png" alt="" />
          <span class="time-black">{{
            `${datetimeDate[0]}/${datetimeDate[1]}/${datetimeDate[2]}`
          }}</span>
        </div>
        <span class="blue-text">重新选择</span>
      </div>
      <div
        class="time-list"
        @click="openHourSecPicker"
        v-if="type === 'datetime'"
      >
        <div class="time-list-left">
          <img src="@/assets/common/time.png" alt="" />
          <span class="time-black">设置时间</span>
        </div>
        <span class="blue-text">{{ datetimeHourSec }}</span>
      </div>
      <van-datetime-picker
        v-model="datetimeHourSec"
        type="time"
        :show-toolbar="false"
        v-show="hourSecOpen && !showCalendar"
      />
    </template>
  </van-action-sheet>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from "vuex";

export default {
  name: "YiyunTimeDate",
  props: {
    // 选择器整体展示
    showDatetime: {
      type: Boolean,
      default: false,
    },
    // 类型，支持四种，年：year，年月：year-month，年月日：date(默认)，年月日时分：datetime
    type: {
      type: String,
      default: "date",
    },
    // 选中时间
    chooseDate: {
      type: [String, Date, Number],
      default: "",
    },
    // 最小值
    minDate: {
      type: [String, Date, Number],
      default: "",
    },
    // 最大值
    maxDate: {
      type: [String, Date, Number],
      default: "",
    },
    // 标题
    title: {
      type: String,
      default: "请选择时间",
    },
    // 输出是否是Date格式,默认String
    outputIsDate: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      hourSecOpen: false,
      datetimeDate: [],
      datetimeHourSec: "00:00",
      showCalendar: true,
    };
  },
  watch: {
    async showDatetime(judge) {
      if (judge) {
        this.showCalendar = true;
        this.hourSecOpen = false;
        this.datetimeDate = [];
        this.datetimeHourSec = "00:00";
        await this.$nextTick();
        if (this.chooseDate) {
          if (this.chooseDate instanceof Date) {
            let arr = this.$utils
              .formatTimestamp(this.chooseDate.getTime(), "YYYY/MM/DD HH:mm")
              .split(" ");
            this.datetimeDate = arr[0].split("/").map((item) => Number(item));
            this.datetimeHourSec = arr[1];
          } else if (typeof this.chooseDate == "number") {
            let arr = this.$utils
              .formatTimestamp(this.chooseDate, "YYYY/MM/DD HH:mm")
              .split(" ");
            this.datetimeDate = arr[0].split("/").map((item) => Number(item));
            this.datetimeHourSec = arr[1];
          } else {
            let arr = this.chooseDate.split(" ");
            this.datetimeDate = arr[0].split("/").map((item) => Number(item));
            this.datetimeHourSec = arr[1];
          }
        }
      }
    },
  },
  methods: {
    ...mapMutations([]),
    ...mapActions([]),
    disabledDate(time, judge) {
      if (this.minDate || this.maxDate) {
        let nowTimeStamp = null;
        if (judge && this.type === "year-month") {
          let year = time.split("/")[0] - 0;
          let month = time.split("/")[1] - 1;
          nowTimeStamp = new Date(year, month).setHours(0, 0, 0, 0);
        } else {
          nowTimeStamp = new Date(time).setHours(0, 0, 0, 0);
        }
        if (this.minDate && this.maxDate) {
          if (
            nowTimeStamp <=
              (this.maxDate instanceof Date
                ? this.maxDate.setHours(0, 0, 0, 0)
                : new Date(this.maxDate).setHours(0, 0, 0, 0)) &&
            nowTimeStamp >=
              (this.minDate instanceof Date
                ? this.minDate.setHours(0, 0, 0, 0)
                : new Date(this.minDate).setHours(0, 0, 0, 0))
          ) {
            return false;
          } else {
            return true;
          }
        } else if (this.minDate) {
          if (
            nowTimeStamp >=
            (this.minDate instanceof Date
              ? this.minDate.setHours(0, 0, 0, 0)
              : new Date(this.minDate).setHours(0, 0, 0, 0))
          ) {
            return false;
          } else {
            return true;
          }
        } else {
          if (
            nowTimeStamp <=
            (this.maxDate instanceof Date
              ? this.maxDate.setHours(0, 0, 0, 0)
              : new Date(this.maxDate).setHours(0, 0, 0, 0))
          ) {
            return false;
          } else {
            return true;
          }
        }
      } else {
        return false;
      }
    },
    submit(val) {
      this.datetimeDate = [val.year, val.month, val.day];
    },
    // 取消
    cancel() {
      this.$emit("cancel");
    },
    // 确定
    confirm() {
      let date = null;
      switch (this.type) {
        case "year":
          date = `${this.datetimeDate[0]}`;
          break;
        case "year-month":
          date = `${this.datetimeDate[0]}/${this.datetimeDate[1]}`;
          break;
        case "date":
          date = `${this.datetimeDate[0]}/${this.datetimeDate[1]}/${this.datetimeDate[2]}`;
          break;
        case "datetime":
          date = `${this.datetimeDate[0]}/${this.datetimeDate[1]}/${this.datetimeDate[2]} ${this.datetimeHourSec}`;
          break;
      }
      if (!this.disabledDate(date, true)) {
        let outDate = null;
        if (this.type === "year-month" && this.outputIsDate) {
          let year = date.split("/")[0] - 0;
          let month = date.split("/")[1] - 1;
          outDate = new Date(year, month);
        } else {
          outDate = this.outputIsDate ? new Date(date) : date;
        }
        this.$emit("confirm", outDate);
      }
    },
    // 重新选择
    async againChoose() {
      await this.$utils.sleep(100);
      this.showCalendar = true;
      this.hourSecOpen = false;
    },
    // 打开时分选择器
    openHourSecPicker() {
      this.hourSecOpen = true;
      this.showCalendar = false;
    },
  },
  computed: {
    ...mapGetters([]),
  },
};
</script>
<style lang="scss" scoped>
.popup-title-box {
  display: flex;
  align-items: center;
  height: 2.3rem;
  padding: 0 1rem;
  border-bottom: 1px solid #e8e8e8;

  .popup-close {
    width: 1.5rem;
    font-size: 0.7rem;
    font-weight: 400;
    color: #036ed5;
  }
  .popup-title {
    font-size: 0.8rem;
    font-weight: 400;
    flex: 1;
    text-align: center;
    color: #303133;
  }
  .popup-commit {
    width: 1.5rem;
    text-align: right;
    font-size: 0.7rem;
    font-weight: 400;
    color: #036ed5;
  }
}
.time-list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 2.2rem;
  border-bottom: 1px solid #e8e8e8;
  padding: 0 0.8rem;

  .time-list-left {
    display: flex;
    align-items: center;
    height: 1rem;

    img {
      width: 0.8rem;
      height: 0.8rem;
      margin-right: 0.2rem;
    }
    .time-black {
      font-size: 0.7rem;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #303133;
      line-height: 0.9rem;
    }
    .blue-text {
      margin-left: 0.5rem;
    }
  }
  .blue-text {
    font-size: 0.7rem;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #036ed5;
    line-height: 0.9rem;
  }
}
</style>