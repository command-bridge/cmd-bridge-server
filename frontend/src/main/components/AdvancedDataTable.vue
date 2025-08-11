<template>
  <v-container>
    <v-data-table-server
      v-model:page="page"
      v-model:items-per-page="itemsPerPage"
      v-model:sort-by="sortBy"
      v-model:sort-desc="sortDesc"
      :headers="headers"
      :items="items"
      :items-length="total"
      :loading="loading"
    >
      <!-- Slots para filtros nas colunas -->
      <template v-for="header in headers" :key="header.key" v-slot:[`header.${header.key}`]="{ column }">
        <div class="d-flex align-center justify-space-between">
          <!-- Nome da coluna e ícone de ordenação -->
          <div class="d-flex align-center">
            <span class="font-weight-medium">{{ column.title }}</span>
            
            <!-- Ícone de ordenação -->
            <v-icon 
              v-if="getSortIcon(header.key)"
              size="16" 
              class="ml-1"
              :class="getSortDirection(header.key) === 'desc' ? 'text-primary' : 'text-primary'"
            >
              {{ getSortIcon(header.key) }}
            </v-icon>
          </div>
          
          <!-- Ícone de filtro -->
          <v-menu v-model="filterMenus[header.key]" :close-on-content-click="false" location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                :color="hasActiveFilter(header.key) ? 'primary' : 'default'"
                :variant="hasActiveFilter(header.key) ? 'tonal' : 'text'"
                icon
                size="small"
                class="ml-2"
                @click.stop
              >
                <v-icon 
                  size="16"
                  :color="hasActiveFilter(header.key) ? 'primary' : 'grey-darken-1'"
                >
                  {{ hasActiveFilter(header.key) ? 'mdi-filter' : 'mdi-filter-variant' }}
                </v-icon>
              </v-btn>
            </template>
            
            <!-- Popup do filtro -->
            <v-card min-width="250" :max-width="isDateColumn(header.key) ? 400 : 300">
              <v-card-title class="text-subtitle-2 py-2">
                <v-icon size="16" class="mr-1">mdi-filter-variant</v-icon>
                Filtrar {{ column.title }}
              </v-card-title>
              
              <v-card-text class="pb-2">
                <!-- Filtro de intervalo de datas -->
                <div v-if="isDateColumn(header.key)" class="d-flex flex-column gap-2">
                  <v-text-field
                    v-model="dateFilters[header.key].start"
                    label="Data inicial"
                    type="date"
                    variant="outlined"
                    density="compact"
                    hide-details
                    clearable
                  />
                  <v-text-field
                    v-model="dateFilters[header.key].end"
                    label="Data final"
                    type="date"
                    variant="outlined"
                    density="compact"
                    hide-details
                    clearable
                  />
                </div>
                
                <!-- Filtro de texto comum -->
                <v-text-field
                  v-else
                  v-model="columnFilters[header.key]"
                  :placeholder="`Digite para filtrar...`"
                  variant="outlined"
                  density="compact"
                  hide-details
                  clearable
                  autofocus
                  @keydown.enter="filterMenus[header.key] = false"
                  @keydown.escape="filterMenus[header.key] = false"
                />
              </v-card-text>
              
              <v-card-actions class="pt-0">
                <v-spacer></v-spacer>
                <v-btn
                  size="small"
                  variant="text"
                  @click="clearColumnFilter(header.key)"
                >
                  Limpar
                </v-btn>
                <v-btn
                  size="small"
                  color="primary"
                  variant="tonal"
                  @click="filterMenus[header.key] = false"
                >
                  Aplicar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </div>
      </template>

      <!-- Slot para formatação de colunas de data -->
      <template v-for="dateColumn in $props.dateColumns" :key="`item-${dateColumn}`" v-slot:[`item.${dateColumn}`]="{ value }">
        {{ formatDateBR(value) }}
      </template>

      <!-- Slots dinâmicos para customização externa -->
      <template v-for="(slot, name) in $slots" :key="name" v-slot:[name]="slotData">
        <slot :name="name" v-bind="slotData"></slot>
      </template>
    </v-data-table-server>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, watch, reactive, computed } from 'vue';

export default defineComponent({
  name: 'AdvancedDataTable',
  props: {
    // Props para dados
    items: {
      type: Array as () => Array<Record<string, unknown>>,
      default: () => []
    },
    headers: {
      type: Array as () => Array<{ title: string; key: string }>,
      default: () => []
    },
    total: {
      type: Number,
      default: 0
    },
    loading: {
      type: Boolean,
      default: false
    },

    // Props para configuração
    dateColumns: {
      type: Array as () => string[],
      default: () => []
    },
    
    // Props para paginação
    initialPage: {
      type: Number,
      default: 1
    },
    initialItemsPerPage: {
      type: Number,
      default: 10
    },

    // Props para busca
    searchValue: {
      type: String,
      default: ''
    }
  },

  emits: [
    'update:page',
    'update:items-per-page', 
    'update:sort-by',
    'update:sort-desc',
    'update:search',
    'update:filters',
    'fetch-data'
  ],

  setup(props, { emit }) {
    // Estados reativos
    const page = ref(props.initialPage);
    const itemsPerPage = ref(props.initialItemsPerPage);
    const sortBy = ref<Array<{ key: string; order: 'asc' | 'desc' }>>([]);
    const sortDesc = ref<boolean[]>([]);
    const search = ref(props.searchValue);
    const columnFilters = reactive<Record<string, string>>({});
    const filterMenus = reactive<Record<string, boolean>>({});
    const dateFilters = reactive<Record<string, { start: string; end: string }>>({});

    // Inicializar filtros de data
    props.dateColumns.forEach(column => {
      dateFilters[column] = { start: '', end: '' };
    });

    // Funções utilitárias
    const isDateColumn = (columnKey: string) => {
      return props.dateColumns.includes(columnKey);
    };

    const clearColumnFilter = (columnKey: string) => {
      if (isDateColumn(columnKey)) {
        dateFilters[columnKey] = { start: '', end: '' };
      } else {
        delete columnFilters[columnKey];
      }
      filterMenus[columnKey] = false;
    };

    const getSortIcon = (columnKey: string) => {
      const sortItem = sortBy.value.find(item => item.key === columnKey);
      if (!sortItem) return null;
      
      return sortItem.order === 'desc' ? 'mdi-arrow-down' : 'mdi-arrow-up';
    };

    const getSortDirection = (columnKey: string) => {
      const sortItem = sortBy.value.find(item => item.key === columnKey);
      return sortItem?.order || null;
    };

    const hasActiveFilter = (columnKey: string) => {
      // Verifica se é uma coluna de data com filtros ativos
      if (isDateColumn(columnKey)) {
        const dateFilter = dateFilters[columnKey];
        return !!(dateFilter?.start || dateFilter?.end);
      }
      
      // Verifica se é uma coluna de texto com filtro ativo
      return !!(columnFilters[columnKey] && columnFilters[columnKey].trim());
    };

    const formatDateBR = (value: string | Date | null) => {
      if (!value) return '';
      
      try {
        const date = new Date(value);
        
        // Verifica se a data é válida
        if (isNaN(date.getTime())) return '';
        
        // Formata no padrão brasileiro DD/MM/AAAA
        return date.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      } catch {
        return '';
      }
    };

    // Computed para os filtros consolidados
    const allFilters = computed(() => {
      const filters: Record<string, unknown> = { ...columnFilters };
      
      // Adicionar filtros de data
      Object.keys(dateFilters).forEach(column => {
        const dateFilter = dateFilters[column];
        if (dateFilter.start) {
          filters[`${column}_start`] = dateFilter.start;
        }
        if (dateFilter.end) {
          filters[`${column}_end`] = dateFilter.end;
        }
      });

      return filters;
    });



    // Watchers para emitir mudanças
    watch(page, (newValue) => {
      emit('update:page', newValue);
    });

    watch(itemsPerPage, (newValue) => {
      emit('update:items-per-page', newValue);
    });

    watch(sortBy, (newValue) => {
      emit('update:sort-by', newValue);
    }, { deep: true });

    watch(sortDesc, (newValue) => {
      emit('update:sort-desc', newValue);
    });

    watch(search, (newValue) => {
      emit('update:search', newValue);
    });

    watch(allFilters, (newValue) => {
      emit('update:filters', newValue);
    }, { deep: true });

    // Watch principal para buscar dados
    watch([page, itemsPerPage, sortBy, sortDesc, search, allFilters], () => {
      const params = {
        page: page.value,
        limit: itemsPerPage.value,
        sortBy: sortBy.value[0]?.key,
        sortDesc: sortBy.value[0]?.order === 'desc',
        filter: search.value,
        ...allFilters.value
      };
      
      emit('fetch-data', params);
    }, { deep: true });

    return {
      // Estados
      page,
      itemsPerPage,
      sortBy,
      sortDesc,
      search,
      columnFilters,
      filterMenus,
      dateFilters,
      
      // Funções
      isDateColumn,
      clearColumnFilter,
      getSortIcon,
      getSortDirection,
      hasActiveFilter,
      formatDateBR,
    };
  },
});
</script> 