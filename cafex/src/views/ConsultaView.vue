<script>
import axios from '@/services/http.js'
import PresencaModal from '@/components/PresencaModal.vue'

function groupByOficinaData(presencas) {
  const grupos = {}
  for (const p of presencas) {
    const key = `${p.oficinaId}|${new Date(p.dataPresenca).toISOString().slice(0, 10)}`
    if (!grupos[key]) {
      grupos[key] = {
        oficinaId: p.oficinaId,
        oficina: p.oficina,
        dataPresenca: p.dataPresenca,
        total: 0,
        presentes: 0,
        ausentes: 0,
        justificados: 0,
        alunos: [],
      }
    }
    grupos[key].total++
    if (p.status === 'PRESENTE') grupos[key].presentes++
    if (p.status === 'AUSENTE') grupos[key].ausentes++
    if (p.status === 'JUSTIFICADO') grupos[key].justificados++
    grupos[key].alunos.push({ ra: p.alunoRa, nome: p.aluno?.nome, status: p.status })
  }
  return Object.values(grupos)
}

export default {
  name: 'ConsultaView',
  components: { PresencaModal },
  data() {
    return {
      oficinas: [],
      filtroOficina: null,
      filtroData: null,
      presencas: [],
      grupos: [],
      modalPresenca: false,
      modalAlunos: [],
      modalOficina: null,
      modalPresencas: [],
    }
  },
  methods: {
    async buscarOficinas() {
      const res = await axios.get('/oficinas')
      this.oficinas = res.data
    },
    async buscarPresencas() {
      let params = []
      if (this.filtroOficina) params.push(`oficinaId=${this.filtroOficina}`)
      if (this.filtroData) {
        const data = new Date(this.filtroData)
        data.setUTCHours(0, 0, 0, 0)
        const dataISO = data.toISOString()
        params.push(`dataInicio=${dataISO}`)
        params.push(`dataFim=${dataISO}`)
      }
      const query = params.length ? '?' + params.join('&') : ''
      const res = await axios.get(`/presencas${query}`)
      this.presencas = res.data
      this.grupos = groupByOficinaData(this.presencas)
    },
    async visualizarPresencas(oficinaId, dataPresenca) {
      const grupo = this.grupos.find(
        (g) =>
          g.oficinaId === oficinaId &&
          new Date(g.dataPresenca).toISOString().slice(0, 10) ===
            new Date(dataPresenca).toISOString().slice(0, 10),
      )
      if (!grupo) return
      this.modalAlunos = grupo.alunos.map((a) => ({ ra: a.ra, nome: a.nome }))
      this.modalPresencas = grupo.alunos.map((a) => ({ ra: a.ra, status: a.status }))
      this.modalOficina = grupo.oficina
      this.modalPresenca = true
    },
  },
  async created() {
    await this.buscarOficinas()
    await this.buscarPresencas()
  },
}
</script>

<template>
  <v-card flat>
    <v-card-title class="d-flex align-center pe-2">
      <v-col class="d-flex justify-start">
        <v-icon icon="mdi-magnify"></v-icon> &nbsp; Consulta de Presenças
      </v-col>
      <v-col class="d-flex justify-end">
        <v-select
          v-model="filtroOficina"
          :items="oficinas"
          item-title="nome"
          item-value="id"
          label="Filtrar por Oficina"
          style="max-width: 220px"
          clearable
          @update:model-value="buscarPresencas"
        />
        <v-date-input
          v-model="filtroData"
          label="Filtrar por Data"
          style="max-width: 180px"
          @update:model-value="buscarPresencas"
          clearable
        />
      </v-col>
    </v-card-title>
    <v-divider></v-divider>
    <v-data-table
      :items="grupos"
      :headers="[
        { title: 'Oficina', key: 'oficina.nome' },
        { title: 'Data', key: 'dataPresenca' },
        { title: 'Presentes', key: 'presentes' },
        { title: 'Ausentes', key: 'ausentes' },
        { title: 'Justificados', key: 'justificados' },
        { title: 'Total', key: 'total' },
        { title: '', key: 'actions', align: 'center' },
      ]"
    >
      <template v-slot:item.dataPresenca="{ item }">
        {{ new Date(item.dataPresenca).toLocaleDateString() }}
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn
          icon
          color="primary"
          size="small"
          class="mx-1"
          @click="visualizarPresencas(item.oficinaId, item.dataPresenca)"
        >
          <v-icon>mdi-eye</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <PresencaModal
      :show="modalPresenca"
      :oficina="modalOficina"
      :alunos="modalAlunos"
      :presencasIniciais="modalPresencas"
      :visualizacao="true"
      @update:show="modalPresenca = $event"
    />
  </v-card>
</template>

<style scoped></style>
