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
        diaSemana: null,
        alunos: [],
      },
      presencaModal: false,
      presencaModalVisualizacao: false,
      oficinaSelecionada: null,
      alunosOficina: [],
      presencasOficina: [],
      diaSemanaOptions: [
        { text: 'Domingo', value: 'DOMINGO' },
        { text: 'Segunda-feira', value: 'SEGUNDA' },
        { text: 'Terça-feira', value: 'TERCA' },
        { text: 'Quarta-feira', value: 'QUARTA' },
        { text: 'Quinta-feira', value: 'QUINTA' },
        { text: 'Sexta-feira', value: 'SEXTA' },
        { text: 'Sábado', value: 'SABADO' },
      ],
      alunosDisponiveis: [],
      alunosBusca: '',
      alunosMatriculados: [], // alunos já associados (matriculados) à oficina
      qtdAlunosPorOficina: {},
    }
  },
  methods: {
    headers() {
      return [
        { title: 'Nome', key: 'nome', align: 'start' },
        { title: 'Descrição', key: 'descricao', align: 'start' },
        { title: 'Dias', key: 'diaSemana', align: 'start' },
        { title: 'Quantidade de Alunos', key: 'qtdAlunos', align: 'start' },
        { title: '', key: 'actions', align: 'center' },
      ]
    },
    async getItems() {
      try {
        const res = await axios.get('/oficinas')
        this.items = res.data
        for (const oficina of res.data) {
          try {
            const resQtd = await axios.get(`/oficinas/${oficina.id}/getQtdAlunos`)
            this.qtdAlunosPorOficina[oficina.id] = resQtd.data ?? 0
          } catch {
            this.qtdAlunosPorOficina[oficina.id] = '-'
          }
        }
      } catch (err) {
        console.log(err)
      }
    },
    getQtdAlunos(oficinaId) {
      return this.qtdAlunosPorOficina[oficinaId] ?? '-'
    },
    async getAlunosDisponiveis() {
      try {
        const res = await axios.get('/alunos')
        this.alunosDisponiveis = res.data
      } catch (e) {
        this.alunosDisponiveis = []
      }
    },
    async getAlunosMatriculados(oficinaId) {
      // Busca alunos matriculados via endpoint de matrícula
      const res = await axios.get(`/matriculas?oficinaId=${oficinaId}`)
      // Espera que venha [{ aluno: { id, nome, ... }, ... }]
      this.alunosMatriculados = res.data.map((m) => m.aluno)
    },
    setItem() {
      this.dialog = false

      const payload = {
        nome: this.params.nome,
        descricao: this.params.descricao,
        diaSemana: this.params.diaSemana,
        alunos: this.params.alunos,
      }

      if (this.isEdit) {
        axios
          .put(`/oficinas/${this.itemEditId}`, payload)
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
        .post('/oficinas', payload)
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
      this.params.diaSemana = item.diaSemana

      this.getAlunosDisponiveis()
      this.getAlunosMatriculados(item.id)
      // params.alunos = apenas os ids dos matriculados
      this.params.alunos = this.alunosMatriculados.map((a) => a.id)

      this.dialog = true
    },
    async openCreateItem() {
      this.isEdit = false
      this.itemEditId = null
      this.params.nome = null
      this.params.descricao = null
      this.params.diaSemana = null
      this.params.alunos = []
      this.alunosMatriculados = []
      await this.getAlunosDisponiveis()
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
      this.params.diaSemana = null
      this.params.alunos = []

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
        const resMatriculas = await axios.get(`/matriculas?oficinaId=${oficina.id}`)
        this.alunosOficina = resMatriculas.data.map((m) => ({
          id: m.aluno.id,
          ra: m.aluno.ra,
          nome: m.aluno.nome,
          matriculaId: m.id,
        }))
        const resPresencas = await axios.get(
          `/presencas?oficinaId=${oficina.id}&dataInicio=${dataISO}&dataFim=${dataISO}`,
        )
        // Mapear por matriculaId
        presencasMap = Object.fromEntries(resPresencas.data.map((p) => [p.matricula?.id, p.status]))
        this.presencasOficina = this.alunosOficina.map((aluno) => ({
          ra: aluno.ra,
          nome: aluno.nome,
          matriculaId: aluno.matriculaId,
          status: presencasMap[aluno.matriculaId] || '',
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
          matriculaId: p.matriculaId,
          status: p.status,
          dataPresenca,
        }))
        if (presencasCompletas.some((p) => !p.matriculaId)) {
          this.$toast.error('Erro: algum aluno não está matriculado na oficina!')
          return
        }
        await axios.post('/presencas/multiplas', {
          presencas: presencasCompletas,
        })
        this.$toast.success('Presenças salvas!')
      } catch (e) {
        this.$toast.error('Erro ao salvar presenças!')
      }
      this.presencaModal = false
    },
    getDiasSemana(diaSemana, ret = '-') {
      if (!diaSemana || !diaSemana?.length) {
        return ret
      }
      let string = ''
      diaSemana.forEach((diaEnum) => {
        this.diaSemanaOptions.forEach((diaSemanaOption) => {
          if (diaSemanaOption.value == diaEnum) {
            string += diaSemanaOption.text + ', '
          }
        })
      })
      return string.slice(0, -2)
    },
    filtrarAlunosDisponiveis() {
      const busca = this.alunosBusca?.toLowerCase() || ''
      // Só mostra alunos que NÃO estão matriculados (não estão nos chips)
      return this.alunosDisponiveis.filter(
        (a) =>
          (!busca || a.nome.toLowerCase().includes(busca)) && !this.params.alunos.includes(a.id),
      )
    },
    adicionarAluno(id) {
      if (!this.params.alunos.includes(id)) {
        this.params.alunos.push(id)
        // Adiciona também no array de matriculados para aparecer no chip imediatamente
        const aluno = this.alunosDisponiveis.find((a) => a.id === id)
        if (aluno) this.alunosMatriculados.push(aluno)
      }
      this.alunosBusca = ''
    },
    removerAluno(id) {
      this.params.alunos = this.params.alunos.filter((aid) => aid !== id)
      this.alunosMatriculados = this.alunosMatriculados.filter((a) => a.id !== id)
    },
  },
  async created() {
    await this.getItems()
    await this.getAlunosDisponiveis()
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
              @click="openCreateItem"
              data-cy="btn-abrir-cadastro"
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
                    data-cy="input-nome"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12">
                  <v-text-field
                    v-model="params.descricao"
                    label="Descrição"
                    required
                    data-cy="input-descricao"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12">
                  <v-select
                    class="text-left"
                    :items="diaSemanaOptions"
                    v-model="params.diaSemana"
                    label="Dia(as) da Semana"
                    item-title="text"
                    item-value="value"
                    dense
                    hide-details
                    multiple
                    required
                    data-cy="select-dia-semana"
                  />
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12">
                  <div style="margin-bottom: 4px; font-weight: 500">Alunos associados</div>
                  <div style="width: 100%; display: flex; flex-wrap: wrap">
                    <v-chip
                      v-for="aluno in alunosMatriculados"
                      :key="aluno.id"
                      class="ma-1"
                      closable
                      @click:close="removerAluno(aluno.id)"
                      color="primary"
                      variant="outlined"
                      size="small"
                    >
                      {{ aluno.nome }}
                    </v-chip>
                  </div>
                  <v-text-field
                    v-model="alunosBusca"
                    label="Buscar e adicionar aluno"
                    prepend-inner-icon="mdi-magnify"
                    hide-details
                    dense
                    style="width: 100%; margin-top: 8px"
                    @keydown.enter.prevent="
                      filtrarAlunosDisponiveis().length &&
                      adicionarAluno(filtrarAlunosDisponiveis()[0].id)
                    "
                  ></v-text-field>
                  <div
                    v-if="alunosBusca && filtrarAlunosDisponiveis().length"
                    style="max-height: 120px; overflow-y: auto; width: 100%"
                  >
                    <v-list density="compact">
                      <v-list-item
                        v-for="aluno in filtrarAlunosDisponiveis()"
                        :key="aluno.id"
                        @click="adicionarAluno(aluno.id)"
                        style="cursor: pointer"
                      >
                        <v-list-item-title>{{ aluno.nome }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </div>
                </v-col>
              </v-row>
              <small class="text-caption text-medium-emphasis">*indica campos obrigatórios</small>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="error"
                text="Cancelar"
                variant="plain"
                @click="closeModal"
                data-cy="btn-cancelar"
              ></v-btn>
              <v-btn
                color="primary"
                text="Confirmar"
                variant="tonal"
                @click="setItem"
                data-cy="btn-confirmar"
              ></v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-card-title>

    <v-divider></v-divider>

    <v-data-table :headers="headers()" v-model:search="search" :items="items">
      <template v-slot:item.diaSemana="{ item }">
        {{ getDiasSemana(item?.diaSemana) }}
      </template>

      <template v-slot:item.qtdAlunos="{ item }">
        {{ getQtdAlunos(item.id) }}
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
                icon="mdi-pencil"
                color="orange-darken-2"
                size="small"
                class="mx-1"
                @click="openEditItem(item)"
                data-cy="btn-editar"
              >
                <v-icon color="grey-darken-4"> mdi-pencil </v-icon>
              </v-btn>
            </template>
            <span>Excluir Oficina</span>
          </v-tooltip>
          <v-tooltip location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn
                icon="mdi-delete"
                color="orange-darken-2"
                size="small"
                class="mx-1"
                @click="confirmDelete(item)"
                data-cy="btn-excluir"
              >
                <v-icon color="grey-darken-4"> mdi-delete </v-icon>
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
