<template>
  <app-page title="Список столов">
    <form @submit.prevent="chooseDate" style="padding-bottom: 10px;">
      <div style="display:flex; margin: 0 -5px;" class='box'>
        <h2 class="item">Выберите дату:</h2>
      </div>
      <div style="display:flex; margin: 0 -5px;" class='box'>
        <input type="date" id="date" v-model="date" class='item'>
        <button class="btn primary item">Выбрать</button>
      </div>
    </form>
    <div class="table-container">
      <table class="table table-bordered" v-if="date !== null && timelapsestoday !== null">
        <thead>
        <tr>
          <th scope="col" class="time-col">Время</th>
          <th scope="col" class="table-col">Стол 1</th>
          <th scope="col" class="table-col">Стол 2</th>
          <th scope="col" class="table-col">Стол 3</th>
          <th scope="col" class="table-col">Стол 4</th>
          <th scope="col" class="table-col">Стол 5</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="hour in 24" :key="hour">
          <td class="time-cell">{{ hour - 1 }}:00 - {{ hour }}:00</td>
          <td v-for="table in 5" :key="table" class="table-cell" @click="createTimeLapseTable(hour, table)">
            <div v-for="timelapse in timelapsestoday" :key="timelapse.id">
              <a v-if="(timelapse.time_lapse === hour) && (timelapse.table_number === table)">{{timelapse.username}}</a>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <teleport to="body">
      <create-modal v-if="isOpenCreate" @close="isOpenCreate = false"></create-modal>
    </teleport>
    <teleport to="body">
      <delete-modal v-if="isOpenDelete" @close="isOpenDelete = false"></delete-modal>
    </teleport>
    <teleport to="body">
      <delete-confirm-modal v-if="isOpenDeleteConfirm" @close="isOpenDeleteConfirm = false"
                            :timelapsestoday="timelapsestoday" :i="DeleteI" :timelapses="timelapses"
                            :choose-date="chooseDate" :get-time-lapses="getTimeLapses"></delete-confirm-modal>
    </teleport>
    <teleport to="body">
      <creation-confirm v-if="isOpenCreationConfirm" @close="isOpenCreationConfirm = false" :date="date"
                        :hour="timelapse.time_lapse" :table="timelapse.table_number"
                        @create-time-lapse="createTimeLapse"></creation-confirm>
    </teleport>
    <teleport to="body">
      <info-modal
        v-if="isOpenInfoModal"
        @close="isOpenInfoModal = false"
        :username="username"
      ></info-modal>
    </teleport>
  </app-page>
</template>
<script>
import AppPage from "@/components/ui/AppPage";
import AppLoader from "@/components/ui/AppLoader";
import axios from "@/utils/axios";
import {ref} from "vue";
import {useStore} from "vuex";
import CreateModal from "@/components/ui/Modals/CreateModal";
import DeleteModal from "@/components/ui/Modals/DeleteModal";
import DeleteConfirmModal from "@/components/ui/Modals/DeleteConfirmModal";
import CreationConfirm from "@/components/ui/Modals/CreationConfirm";
import InfoModal from "@/components/ui/Modals/InfoModal";
export default {
  setup() {
    const timelapse = ref({username: '', date: '', table_number: 0, time_lapse: 0, id: 0})
    const timelapses = ref(null)
    const timelapsestoday = ref(null)
    const date = ref(null)
    const isOpenCreate = ref(false)
    const isOpenDelete = ref(false)
    const isOpenCreationConfirm = ref(false)
    const isOpenDeleteConfirm = ref(false)
    const DeleteConfirm = ref(null)
    const isOpenInfoModal = ref(false)
    const DeleteI = ref(null)
    const username = ref(null)
    const id = ref(null)
    const store = useStore()
    const getTimeLapses = async () => {
      const response = await axios.get('/timelapses/')
      timelapses.value = response.data
    }
    const getTimeLapsesDateFilter = async (date) => {
      const response = await axios.get('/timelapses/', {
        params: {
          date: date
        }
      })
      timelapsestoday.value = response.data
    }
    const chooseDate = async () => {
      await getTimeLapsesDateFilter(date.value)
    }
    const createTimeLapse = async () => {
      await getTimeLapses()
      await axios.post('/timelapses/', {
        date: timelapse.value.date,
        table_number: timelapse.value.table_number,
        time_lapse: timelapse.value.time_lapse,
        username: store.getters['auth/username']
      })
      await getTimeLapses()
      await chooseDate()
    }
    const editTimeLapse = async () => {
      await getTimeLapses()
      await axios.put(`/timelapses/${timelapse.value.id}/`, timelapse.value)
      await getTimeLapses();
      timelapse.value = {username: '', date: '', table_number: '', time_lapse: '', id: ''};
    }
    const submitForm = () => {
      if (timelapse.value.id === undefined) {
        createTimeLapse();
      } else {
        editTimeLapse();
      }
    }
    const getMoscowNowMs = () => {
      const parts = new Intl.DateTimeFormat(
        'en-CA',
        {
          timeZone: 'Europe/Moscow',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hourCycle: 'h23'
        }
      ).formatToParts(new Date())

      const values = {}

      for (const part of parts) {
        if (part.type !== 'literal') {
          values[part.type] = Number(part.value)
        }
      }

      return Date.UTC(
        values.year,
        values.month - 1,
        values.day,
        values.hour,
        values.minute,
        values.second
      )
    }

    const getSlotStartMs = (hour) => {
      const [year, month, day] = date.value
        .split('-')
        .map(Number)

      // hour хранит конец интервала:
      // hour=14 означает слот 13:00-14:00.
      return Date.UTC(
        year,
        month - 1,
        day,
        hour - 1,
        0,
        0
      )
    }

    const isSlotStarted = (hour) => {
      return getSlotStartMs(hour) <= getMoscowNowMs()
    }

    const canCancel = (hour) => {
      const diffMs =
        getSlotStartMs(hour) - getMoscowNowMs()

      return diffMs >= 2 * 60 * 60 * 1000
    }

    const createTimeLapseTable = async (hour, table) => {
      if (timelapsestoday.value.length === 0) {
          timelapse.value.date = date.value
          timelapse.value.time_lapse = hour
          timelapse.value.table_number = table
          timelapse.value.username = ''
      }
      for (let i = 0; i < timelapsestoday.value.length; i++) {
        if (timelapsestoday.value[i].date === date.value && timelapsestoday.value[i].time_lapse === hour &&
            timelapsestoday.value[i].table_number === table) {
          timelapse.value.date = date.value
          timelapse.value.time_lapse = hour
          timelapse.value.table_number = table
          timelapse.value.id = i
          timelapse.value.username = timelapsestoday.value[i].username
          break
        } else {
          timelapse.value.date = date.value
          timelapse.value.time_lapse = hour
          timelapse.value.table_number = table
          timelapse.value.username = ''
        }
      }
      if (timelapse.value.username === store.getters['auth/username']) {
        if (!canCancel(hour)) {
          isOpenDelete.value = true
          return
        } else {
          username.value = timelapse.value.username
          DeleteI.value = timelapse.value.id
          isOpenDeleteConfirm.value = true
          return
        }
      } else if (timelapse.value.username !== '') {
        username.value = timelapse.value.username
        isOpenInfoModal.value = true
        return
      } else {
        if (isSlotStarted(hour)) {
          isOpenCreate.value = true
          return
        } else {
          username.value = store.getters['auth/username']
          timelapse.value.username = store.getters['auth/username']
          isOpenCreationConfirm.value = true
        }
      }
    }
    return {
      getTimeLapses,
      submitForm,
      editTimeLapse,
      createTimeLapse,
      chooseDate,
      getTimeLapsesDateFilter,
      createTimeLapseTable,
      timelapse,
      timelapses,
      timelapsestoday,
      date,
      isOpenCreate,
      isOpenDelete,
      isOpenDeleteConfirm,
      DeleteConfirm,
      DeleteI,
      isOpenCreationConfirm,
      isOpenInfoModal,
      username,
      id
    }
  },
  components: {
    CreateModal,
    AppLoader,
    AppPage,
    DeleteModal,
    DeleteConfirmModal,
    CreationConfirm,
    InfoModal
  }
}
</script>
<style scoped>
.box {
  display: flex;
}
.item {
  margin: 0 5px;
}
.table-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin-top: 10px;
}
.time-col {
  width: 15%;
  min-width: 120px;
}
.table-col {
  width: 17%;
  min-width: 100px;
}
</style>
