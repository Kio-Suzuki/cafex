<script>
import axios from '@/services/http'

export default {
  name: 'AlunosView',
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
      },
    }
  },
  methods: {
    headers() {
      return [
        { title: 'Nome', key: 'nome', align: 'start' },
        { title: '', key: 'actions', align: 'center'},
      ]
    },
    async getItems() {
      await axios
        .get('/alunos')
        .then((res) => {
          const { data } = res
          this.items = data
        })
        .catch((err) => {
          console.error(err)
        })
    },
    setItem() {
      this.dialog = false

      if (this.isEdit) {
        axios
          .put(`/alunos/${this.itemEditId}`, this.params)
          .then((res) => {
            this.$toast.success('Aluno editado com sucesso!')
            this.getItems()
          })
          .catch((err) => {
            console.log(err)
            this.$toast.error('Erro ao editar Aluno!')
          })

        return
      }

      axios
        .post('/alunos', this.params)
        .then((res) => {
          this.$toast.success('Aluno cadastrado com sucesso!')
          this.getItems()
        })
        .catch((err) => {
          console.log(err)
          this.$toast.error('Erro ao cadastrar Aluno!')
        })

      return
    },
    openEditItem(item) {
      this.isEdit = true
      this.itemEditId = item.id

      this.params.nome = item.nome
      
      this.dialog = true
    },
    confirmDelete(item) {
      this.itemDeleteId = item.id
      this.dialogDelete = true
    },
    deleteItem() {
      axios
        .delete(`/alunos/${this.itemDeleteId}`)
        .then((res) => {
          this.$toast.success('Aluno excluído com sucesso!')
          this.getItems()
        })
        .catch((err) => {
          console.log(err)
          this.$toast.error('Erro ao excluir Aluno!')
        })

      this.itemDeleteId = null
      this.dialogDelete = false
    },
    closeModal() {
      this.isEdit = false
      this.itemEditId = null

      this.params.nome = null

      this.dialog = false
    },
    handleTitleModal() {
      return this.isEdit ? 'Editar Aluno' : 'Cadastrar Aluno'
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
        <v-icon icon="mdi-account"></v-icon> &nbsp; Alunos
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
              text="Cadastrar Aluno"
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
                    label="Nome Completo do Aluno*"
                    required
                  ></v-text-field>
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
            <span>Editar Aluno</span>
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
            <span>Excluir Aluno</span>
          </v-tooltip>
        </v-col>
      </template>
    </v-data-table>
  </v-card>
</template>
