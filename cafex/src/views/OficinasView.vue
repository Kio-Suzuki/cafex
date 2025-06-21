<script>
import axios from '@/services/http.js'
import { formatDateToUTC } from '@/services/utils.js'
import PresencaModal from '@/components/PresencaModal.vue'

export default {
  name: 'OficinasView',
  components: { PresencaModal },
  data() {
    return {
      search: '',
      dialog: false,
      dialogDelete: false,
      isEdit: false,
      itemEditId: null,
      itemDeleteId: null,
      items: [],
      params: {
        nome: null,
        descricao: null,
        horarioInicio: null,
        horarioFim: null,
      },
      presencaModal: false,
      presencaModalVisualizacao: false,
      oficinaSelecionada: null,
      alunosOficina: [],
      presencasOficina: [],
    }
  },
  methods: {
    headers() {
      return [
        { title: 'Nome', key: 'nome', align: 'start' },
        { title: 'Descrição', key: 'descricao', align: 'start' },
        { title: 'Início', key: 'horarioInicio', align: 'start' },
        { title: 'Fim', key: 'horarioFim', align: 'start' },
        { title: '', key: 'actions', align: 'center' },
      ]
    },
    async getItems() {
      await axios
        .get('/oficinas')
        .then((res) => {
          const { data } = res
          console.log(data)
          this.items = data
        })
        .catch((err) => {
          console.log(err)
        })
    },
    setItem() {
      this.params.horarioInicio = formatDateToUTC(this.params.horarioInicio)
      this.params.horarioFim = formatDateToUTC(this.params.horarioFim)

      this.dialog = false

      if (this.isEdit) {
        axios
          .put(`/oficinas/${this.itemEditId}`, this.params)
          .then((res) => {
            this.$toast.success('Oficina editada com sucesso!')
            this.getItems()
          })
          .catch((err) => {
            console.log(err)
            this.$toast.error('Erro ao editar Oficina!')
          })

        return
      }

      axios
        .post('/oficinas', this.params)
        .then((res) => {
          this.$toast.success('Oficina cadastrada com sucesso!')
          this.getItems()
        })
        .catch((err) => {
          console.log(err)
          this.$toast.error('Erro ao cadastrar Oficina!')
        })

      return
    },
    openEditItem(item) {
      this.isEdit = true
      this.itemEditId = item.id

      this.params.nome = item.nome
      this.params.descricao = item.descricao
      this.params.horarioInicio = item.horarioInicio
      this.params.horarioFim = item.horarioFim

      this.dialog = true
    },
    confirmDelete(item) {
      this.itemDeleteId = item.id
      this.dialogDelete = true
    },
    deleteItem() {
      axios
        .delete(`/oficinas/${this.itemDeleteId}`)
        .then((res) => {
          this.$toast.success('Oficina excluída com sucesso!')
          this.getItems()
        })
        .catch((err) => {
          console.log(err)
          this.$toast.error('Erro ao excluir Oficina!')
        })

      this.itemDeleteId = null
      this.dialogDelete = false
    },
    closeModal() {
      this.isEdit = false
      this.itemEditId = null

      this.params.nome = null
      this.params.descricao = null
      this.params.horarioInicio = null
      this.params.horarioFim = null

      this.dialog = false
    },
    handleTitleModal() {
      return this.isEdit ? 'Editar Oficina' : 'Cadastrar Oficina'
    },
    formatDate(isoString) {
      const date = new Date(isoString)

      const day = String(date.getUTCDate()).padStart(2, '0')
      const month = String(date.getUTCMonth() + 1).padStart(2, '0')
      const year = date.getUTCFullYear()

      return `${day}/${month}/${year}`
    },
    async abrirPresencaModal(oficina) {
      this.oficinaSelecionada = oficina
      const hoje = new Date()
      hoje.setUTCHours(0, 0, 0, 0)
      const dataISO = hoje.toISOString()
      let visualizacao = false
      let presencasMap = {}
      try {
        const resAlunos = await axios.get(`/alunos?oficinaId=${oficina.id}`)
        this.alunosOficina = resAlunos.data
        // Busca presenças do dia
        const resPresencas = await axios.get(
          `/presencas?oficinaId=${oficina.id}&dataInicio=${dataISO}&dataFim=${dataISO}`,
        )
        // Cria um map ra -> status
        presencasMap = Object.fromEntries(resPresencas.data.map((p) => [p.alunoRa, p.status]))
        this.presencasOficina = this.alunosOficina.map((aluno) => ({
          ra: aluno.ra,
          status: presencasMap[aluno.ra] || '',
        }))
        visualizacao = resPresencas.data.length > 0
      } catch (e) {
        this.alunosOficina = []
        this.presencasOficina = []
      }
      this.presencaModalVisualizacao = visualizacao
      this.presencaModal = true
    },
    async salvarPresencas(presencas) {
      try {
        const dataPresenca = new Date().toISOString()
        const presencasCompletas = presencas.map((p) => ({
          alunoRa: p.ra,
          status: p.status,
          oficinaId: this.oficinaSelecionada.id,
          dataPresenca,
        }))

        await axios.post('/presencas/multiplas', {
          presencas: presencasCompletas,
        })
        this.$toast.success('Presenças salvas!')
      } catch (e) {
        this.$toast.error('Erro ao salvar presenças!')
      }
      this.presencaModal = false
    },
  },
  async created() {
    await this.getItems()
  },
}
</script>

<template>
  <v-card flat>
    <v-card-title class="d-flex align-center pe-2">
      <v-col class="d-flex justify-start">
        <v-icon icon="mdi-wrench"></v-icon> &nbsp; Oficinas
      </v-col>
      <v-col class="d-flex justify-center">
        <v-text-field
          v-model="search"
          density="compact"
          label="Pesquisar"
          prepend-inner-icon="mdi-magnify"
          variant="solo-filled"
          flat
          hide-details
          single-line
        ></v-text-field>
      </v-col>
      <v-col class="d-flex justify-end">
        <!-- ========  MODAL CONFIRMAR EXCLUSÃO ======== -->
        <v-dialog v-model="dialogDelete" max-width="400" persistent>
          <v-card>
            <v-card-title style="font-size: 1.2rem">
              <v-icon>mdi-delete</v-icon>
              Excluir Item
            </v-card-title>

            <v-card-text style="font-size: 1.1rem">
              Você tem CERTEZA que deseja EXCLUIR este item? <br />
              Esta ação não poderá ser desfeita!
            </v-card-text>

            <template v-slot:actions>
              <v-spacer></v-spacer>

              <v-btn @click="dialogDelete = false" color="primary"> Cancelar </v-btn>

              <v-btn @click="deleteItem" color="error"> Confirmar </v-btn>
            </template>
          </v-card>
        </v-dialog>

        <!-- ========  MODAL CADASTRO/EDIT ======== -->
        <v-dialog v-model="dialog" max-width="600">
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn
              class="text-none font-weight-regular"
              prepend-icon="mdi-plus"
              text="Cadastrar Oficina"
              color="success"
              v-bind="activatorProps"
            ></v-btn>
          </template>

          <v-card prepend-icon="mdi-file-document" :title="handleTitleModal()">
            <v-card-text>
              <v-row dense>
                <v-col cols="12">
                  <v-text-field
                    v-model="params.nome"
                    label="Nome da Oficina*"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12">
                  <v-text-field
                    v-model="params.descricao"
                    label="Descrição"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="6">
                  <v-date-input
                    v-model="params.horarioInicio"
                    label="Data início*"
                    required
                  ></v-date-input>
                </v-col>
                <v-col cols="6">
                  <v-date-input
                    v-model="params.horarioFim"
                    label="Data Fim*"
                    required
                  ></v-date-input>
                </v-col>
              </v-row>
              <small class="text-caption text-medium-emphasis">*indica campos obrigatórios</small>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn text="Cancelar" variant="plain" @click="closeModal"></v-btn>

              <v-btn color="primary" text="Confirmar" variant="tonal" @click="setItem"></v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-card-title>

    <v-divider></v-divider>

    <v-data-table :headers="headers()" v-model:search="search" :items="items">
      <template v-slot:item.horarioInicio="{ item }">
        {{ formatDate(item?.horarioInicio) }}
      </template>

      <template v-slot:item.horarioFim="{ item }">
        {{ formatDate(item?.horarioFim) }}
      </template>

      <template v-slot:item.actions="{ item }">
        <v-col cols="auto" class="d-flex justify-center">
          <v-tooltip location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-pencil"
                color="orange-darken-2"
                size="small"
                style="color: #000 !important"
                class="mx-1"
                @click="openEditItem(item)"
              >
                <v-icon color="grey-darken-4"> mdi-pencil </v-icon>
              </v-btn>
            </template>
            <span>Editar Oficina</span>
          </v-tooltip>
          <v-tooltip location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-delete"
                color="orange-darken-2"
                size="small"
                style="color: #000 !important"
                class="mx-1"
                @click="confirmDelete(item)"
              >
                <v-icon color="grey-darken-4"> mdi-delete </v-icon>
              </v-btn>
            </template>
            <span>Excluir Oficina</span>
            <span>Excluir Oficina</span>
          </v-tooltip>
          <v-tooltip location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-account-group"
                color="primary"
                size="small"
                class="mx-1"
                @click="abrirPresencaModal(item)"
              >
                <v-icon color="grey-darken-4">mdi-account-group</v-icon>
              </v-btn>
            </template>
            <span>Presenças</span>
          </v-tooltip>
        </v-col>
      </template>
    </v-data-table>
    <PresencaModal
      :show="presencaModal"
      :oficina="oficinaSelecionada"
      :alunos="alunosOficina"
      :presencasIniciais="presencasOficina"
      :visualizacao="presencaModalVisualizacao"
      @update:show="presencaModal = $event"
      @salvar="salvarPresencas"
    />
  </v-card>
</template>
