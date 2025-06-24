<template>
  <v-dialog
    :model-value="show"
    @update:model-value="onDialogUpdate"
    width="50vw"
    class="presenca-modal"
  >
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between">
        <div>
          <div style="font-size: 1.2rem; font-weight: bold">{{ oficina?.nome }}</div>
          <div style="font-size: 0.95rem; color: #888">{{ alunos.length }} alunos inscritos</div>
        </div>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-list v-if="presencas.length === alunos.length">
          <v-list-item
            v-for="(aluno, idx) in alunos"
            :key="aluno.ra"
            class="pa-0"
            style="border: none"
          >
            <v-row class="align-center" no-gutters>
              <v-col cols="auto" class="pa-0" style="min-width: 120px; max-width: 200px">
                <span style="font-size: 1.1rem">{{ aluno.nome }}</span>
              </v-col>
              <v-col
                class="pa-0 d-flex align-center justify-end"
                style="min-width: 170px; max-width: 250px; margin-left: auto; margin-right: 0"
              >
                <v-select
                  class="text-left"
                  :items="statusOptions"
                  v-model="presencas[idx].status"
                  label="Status"
                  item-title="text"
                  item-value="value"
                  dense
                  hide-details
                  :disabled="visualizacao"
                  :data-cy="`select-status-presenca-${idx}`"
                  style="max-width: 200px; min-width: 120px; margin-left: 0"
                />
              </v-col>
            </v-row>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="justify-end">
        <v-btn v-if="!visualizacao" color="primary" @click="salvar">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'PresencaModal',
  props: {
    show: Boolean,
    oficina: Object,
    alunos: Array,
    value: Boolean,
    presencasIniciais: Array,
    visualizacao: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:show', 'salvar'],
  data() {
    return {
      presencas: [],
      statusOptions: [
        { text: 'Presente', value: 'PRESENTE' },
        { text: 'Ausente', value: 'AUSENTE' },
        { text: 'Justificado', value: 'JUSTIFICADO' },
      ],
    }
  },
  watch: {
    show(val) {
      if (val) this.initPresencas()
    },
    presencasIniciais: {
      handler() {
        this.initPresencas()
      },
      deep: true,
    },
    alunos: {
      handler() {
        this.initPresencas()
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    onDialogUpdate(val) {
      this.$emit('update:show', val)
    },
    close() {
      this.$emit('update:show', false)
    },
    initPresencas() {
      if (!this.alunos || !this.alunos.length) {
        this.presencas = []
        return
      }
      this.presencas = this.alunos.map((aluno) => {
        const found = this.presencasIniciais?.find((p) => p.ra === aluno.ra)
        return {
          ra: aluno.ra,
          nome: aluno.nome,
          matriculaId: aluno.matriculaId,
          status: found ? found.status : '',
        }
      })
    },
    salvar() {
      const todosPreenchidos = this.presencas.every((p) => p.status && p.status !== '')
      if (!todosPreenchidos) {
        this.$toast?.error?.('Selecione o status de todos os alunos!')
        return
      }
      this.$emit('salvar', this.presencas)
      this.close()
    },
  },
  mounted() {
    this.initPresencas()
  },
}
</script>
