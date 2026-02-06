<template>
  <section :ref="selectSectionRef" :class="inputClass" class="ui-input ui-select">
    <div v-if="label" class="label">
      <div>
        <span :style="{ color: labelColor }" v-html="label" />
        <span v-if="required" class="label-required">*</span>
      </div>
      <span v-if="tooltip" class="tooltip">
        <i :class="tooltipIcon" class="tooltip-icon">
          <span class="tooltip-text">{{ tooltipText }}</span>
        </i>
      </span>
      <span v-else class="rigth-label">
        {{ rightLabel }}
      </span>
    </div>

    <div ref="selectBoxRef" :data-ui="dataUiSelected || null" class="ui-select-box">
      <div
        v-if="multiple"
        :class="selectedClass"
        class="selected"
        :style="{ 'background-color': backgroundColor }"
        @click="toggle"
      >
        {{ total ? 'Selecionados: ' + total : placeholder }}
      </div>

      <div
        v-else
        :class="selectedClass"
        class="selected"
        :style="{ 'background-color': backgroundColor }"
        @click="toggle"
      >
        {{ selecteds && selecteds[itemLabel] ? selecteds[itemLabel] : placeholder }}
      </div>

      <div
        v-if="open"
        class="options"
        :class="{
          'options--fixed': fixedPosition,
          'options--open-up': fixedPosition && openDirection === 'up',
          'options--open-down': fixedPosition && openDirection === 'down',
        }"
        :style="
          fixedPosition
            ? {
                ...dropdownPosition,
                minWidth: minWidth,
                position: 'fixed',
                bottom: 'auto',
                zIndex: 9999,
              }
            : { minWidth: minWidth }
        "
      >
        <section v-if="search" class="search search--top">
          <div :data-ui="dataUiSearch || null" class="search-box">
            <input ref="searchInputRef" v-model="s" type="text" placeholder="Buscar" />
            <div class="icon">
              <em
                v-if="addSelecteds && itemsFilter && !itemsFilter.length"
                class="fal fa-plus"
                @click="addItem"
              />
              <!-- <img v-else src="/assets/imgs/search-light.svg" width="20" alt="Ícone de busca" /> -->
            </div>
          </div>
        </section>

        <section class="list">
          <div class="list-control">
            <div>
              <span v-if="maxSelection" class="span-max-selection">
                {{ selecteds ? selecteds.length : 0 }} de {{ maxSelection }}
              </span>
            </div>
            <div>
              <button
                v-if="selecteds && hasValue(selecteds.id) && !multiple"
                type="button"
                class="btn-cancel"
                :data-ui="dataUiSelectedRemove || null"
                @click="removeSelect"
              >
                Remover Seleção
              </button>
              <button
                v-if="multiple && !maxSelection"
                type="button"
                class="btn-cancel"
                @click="selectAll"
              >
                {{ btnSelectAllLabel }}
              </button>
            </div>
          </div>

          <div
            ref="scrollerRef"
            class="items scroll-color"
            :data-ui="dataUiOptions || null"
            @scroll="scrollHandler"
          >
            <ul v-if="(ajaxSearch && itemsFilter && itemsFilter.length) || itemsFilter.length">
              <template v-if="groupBy">
                <template v-for="(item, id) in itemsFilter" :key="'group-' + id">
                  <h4 v-html="item.name" />
                  <template v-for="(i, key) in item.items">
                    <li
                      v-if="disableSelect && i[disableSelect] === true"
                      :key="`${item.name}-item-disabled-${key}`"
                      class="active"
                    >
                      <div class="data">
                        <div v-if="cover" class="cover">
                          <img :src="i.cover" :alt="i.label" />
                        </div>
                        <div class="infos">
                          <div class="label">{{ i.label }}</div>
                          <div v-if="i.text" class="text" v-html="i.text" />
                        </div>
                      </div>
                      <div class="data-control" />
                    </li>
                    <li
                      v-else
                      :key="`${item.name}-item-enabled-${key}`"
                      :class="{ active: setActive(i) }"
                      @click="select(i)"
                    >
                      <div class="data">
                        <div v-if="cover" class="cover">
                          <img :src="i.cover" :alt="i.label" />
                        </div>
                        <div class="infos">
                          <div class="label">
                            {{ i.label }}<span v-if="i.required" style="color: red">*</span>
                          </div>
                          <div v-if="i.text" class="text" v-html="i.text" />
                        </div>
                      </div>
                      <div class="data-control" />
                    </li>
                  </template>
                </template>
              </template>

              <template v-else>
                <li
                  v-for="(item, key) in itemsFilter"
                  :key="key"
                  :class="{ active: setActive(item), 'li-card': cards }"
                  @click="select(item)"
                >
                  <div class="data">
                    <div v-if="cover" class="cover">
                      <img :src="item.cover" :alt="item.label" />
                    </div>
                    <div :class="{ 'card-infos': cards }" class="infos">
                      <span
                        v-if="stageStatus"
                        :title="stageStatusComputed(item.stage, item.status)"
                        class="stage-status"
                        v-html="stageStatusComputed(item.stage, item.status)"
                      />
                      <p class="label">
                        {{ item.label }}<span v-if="item.required" style="color: red">*</span>
                      </p>
                      <span class="text" v-html="returnText(item.text)" />
                    </div>
                  </div>
                  <div class="data-control" />
                </li>
              </template>
            </ul>

            <div v-if="itemsFilter && !itemsFilter.length && !ajaxSearch" class="no-items">
              Nenhuma opção encontrada
            </div>
            <div
              v-if="
                ajaxSearch &&
                itemsFilter.length == 0 &&
                (s.length < 2 || (s.length >= 2 && !itemsFilter.length))
              "
              class="no-items"
            >
              <span v-if="s.length < 2">Digite pelo menos 2 letras</span>
              <span v-if="s.length >= 2 && !itemsFilter.length"> Nenhuma opção encontrada </span>
            </div>
          </div>
        </section>

        <section v-if="itemsFilter && itemsFilter.length && showFooter" class="control">
          <button
            type="button"
            class="btn-cancel"
            :data-ui="dataUiCancelButton || null"
            @click="removeSelect"
          >
            Cancelar
          </button>
          <button
            v-if="multiple && showApplyButton"
            type="button"
            class="btn-apply"
            @click="endSelections"
          >
            {{ applyButton }}
          </button>
        </section>
      </div>
    </div>
    <div v-if="setError" class="observation-message">
      {{ observation }}
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute } from 'vue-router'

// UTILS (substituindo o mixin)
const hasValue = (val) => {
  if (val === null || val === undefined) return false
  if (typeof val === 'string' && val.trim() === '') return false
  if (Array.isArray(val) && val.length === 0) return false
  if (typeof val === 'object' && Object.keys(val).length === 0 && val.constructor === Object)
    return false
  return true
}

// PROPS
const props = defineProps({
  minWidth: { type: String, default: '280px' },
  label: { type: String, default: '' },
  labelColor: { type: String, default: '' },
  data: { type: Array, default: () => [] },
  modelValue: { type: null, required: true },
  itemLabel: { type: String, default: 'label' },
  textItems: { type: Array, default: () => [] },
  cover: { type: String, default: '' },
  beforeTextItem: { type: Array, default: () => [] },
  afterTextItem: { type: Array, default: () => [] },
  multiple: { type: Boolean, default: false },
  search: { type: Boolean, default: true },
  returnValue: { type: String, default: 'object' },
  size: { type: String, default: 'md' },
  backgroundColor: { type: String, default: 'transparent' },
  groupBy: { type: String, default: '' },
  disableSelect: { type: String, default: '' },
  addSelecteds: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  forceError: { type: Boolean, default: false },
  error: { type: Boolean, default: false },
  maxSelection: { type: Number, default: null },
  loading: { type: Boolean, default: false },
  ajaxSearch: { type: Boolean, default: false },
  showFooter: { type: Boolean, default: true },
  placeholder: { type: String, default: 'Selecione' },
  align: { type: String, default: 'normal' },
  applyButton: { type: String, default: 'Aplicar' },
  design: { type: [String, Array], default: 'mgb-15 br-default' },
  stageStatus: { type: Boolean, default: false },
  cards: { type: Boolean, default: false },
  subtitle: { type: String, default: '' },
  tooltip: { type: Boolean, default: false },
  tooltipIcon: { type: String, default: 'fal fa-question-circle' },
  tooltipText: { type: String, default: '' },
  showApplyButton: { type: Boolean, default: true },
  rightLabel: { type: String, default: '' },
  observation: { type: String, default: '' },
  dataUiSelected: { type: String, default: '' },
  dataUiSearch: { type: String, default: '' },
  dataUiSelectedRemove: { type: String, default: '' },
  dataUiOptions: { type: String, default: '' },
  dataUiCancelButton: { type: String, default: '' },
  callWithEmptySearch: { type: Boolean, default: false },
  fixedPosition: { type: Boolean, default: false },
})

// EMITS
const emit = defineEmits([
  'update:modelValue',
  'search',
  'remove-select',
  'cancel',
  'open',
  'update:data',
])

// STATE (antigo data)
const route = useRoute()
const open = ref(false)
const items = ref([])
const selecteds = ref(props.multiple ? [] : null)
const s = ref('')
const btnSelectAllLabel = ref('Selecionar todos')
const lastSearch = ref('')
let interval = null
const setError = ref(false)
const dropdownPosition = ref({ top: '0px', left: '0px', width: '100%' })
const openDirection = ref('down')

// REFS de Template
const selectSectionRef = ref(null)
const selectBoxRef = ref(null)
const searchInputRef = ref(null)
const scrollerRef = ref(null)

// COMPUTED
const total = computed(() => (selecteds.value ? selecteds.value.length : 0))
const inputClass = computed(() => [open.value ? 'open' : '', props.size, props.align, props.design])
const selectedClass = computed(() => [
  props.disabled ? 'disabled' : '',
  load.value ? 'load disabled' : '',
  props.forceError ? 'error' : '',
  setError.value ? 'error' : '',
])
const itemsFilter = computed(() => {
  if (props.ajaxSearch) {
    if (props.groupBy && items.value) {
      let groupedItems = []
      Object.keys(items.value).forEach((grupo) => {
        groupedItems.push({ name: grupo, items: items.value[grupo] })
      })
      return groupedItems
    }
    return items.value
  }

  if (props.groupBy && items.value) {
    let groupedItems = []
    Object.keys(items.value).forEach((element) => {
      let t = items.value[element].filter((e) => {
        if (s.value && e.label) {
          return e.label.toLowerCase().includes(s.value.toLowerCase())
        }
        return true
      })
      if (t.length) {
        groupedItems.push({ name: element, items: t })
      }
    })
    return groupedItems
  }

  if (!items.value || !items.value.length) return []

  const keys = Object.keys(items.value[0])
  return items.value.filter((i) => {
    let searchString = ''
    keys.forEach((e) => {
      if (!['id', 'ID', 'cover', 'avatar', 'photo', 'foto', 'image'].includes(e)) {
        searchString += i[e] + ' '
      }
    })
    return searchString.toLowerCase().includes(s.value.toLowerCase())
  })
})
const load = computed(() => props.loading)

// WATCHERS
watch(
  () => props.data,
  (v) => {
    if (!v) selecteds.value = props.multiple ? [] : null
    items.value = []
    prepareOptions()
    if (hasValue(selecteds.value) && !props.multiple) {
      const value =
        props.returnValue !== 'object' ? selecteds.value[props.returnValue] : { ...selecteds.value }
      emit('update:modelValue', value)
    }
  }
)

watch(s, (value) => {
  if (props.ajaxSearch && open.value) {
    clearInterval(interval)
    interval = setTimeout(() => {
      clearInterval(interval)
      interval = null
      if ((!value || value.length >= 2) && lastSearch.value !== value) {
        emit('search', { search: value, nextPage: false })
      } else if (value.length < 2) {
        emit('update:data', [])
      }
      lastSearch.value = value
    }, 800)
  }
})

watch(
  () => props.modelValue,
  (v) => {
    setSelectedValues(v)
  },
  { deep: true }
)

watch(open, (val) => {
  if (val) {
    emit('open')
  }
  if (!val && props.multiple && selecteds.value && selecteds.value.length > 0) {
    emit('update:modelValue', selecteds.value)
  }
})

watch(
  () => props.multiple,
  (value) => {
    selecteds.value = value ? [] : null
  }
)

watch(
  () => props.error,
  (newValue) => {
    setError.value = newValue
  },
  { immediate: true }
)

// MÉTODOS
const stageStatusComputed = (stage, status) => {
  if (!stage) return ''
  return status && status !== '' ? `${stage} <span> - ${status}</span>` : `${stage}`
}

const returnText = (text) => {
  let textTrim = text ? text.trim() : ''
  return text && textTrim !== '' ? text : !props.cards ? '' : props.subtitle ? props.subtitle : ''
}

const setSelectedValues = (v) => {
  if (!hasValue(v)) {
    selecteds.value = props.multiple ? [] : null
    return
  }
  if (props.multiple) {
    selecteds.value =
      props.returnValue !== 'object'
        ? v
        : v.map((data) => ({ ...data, label: data[props.itemLabel] }))
    btnSelectAllLabel.value =
      props.maxSelection && selecteds.value.length === props.maxSelection
        ? 'Remover todos'
        : 'Selecionar todos'
  } else {
    if (props.returnValue !== 'object') {
      let result = null
      if (props.groupBy && items.value) {
        Object.keys(items.value).forEach((element) => {
          const found = items.value[element].find((e) => e[props.returnValue] === v)
          if (found) result = found
        })
      } else {
        result = itemsFilter.value.find((e) => e[props.returnValue] === v)
      }
      if (result) selecteds.value = result
    } else {
      let valueObject = { ...v }
      if (!hasValue(valueObject[props.itemLabel])) {
        const selected = items.value.find((e) => e.id === valueObject.id)
        valueObject = selected || null
      }
      if (valueObject) valueObject.label = valueObject[props.itemLabel]
      selecteds.value = valueObject
    }
  }
}

const addItem = () => {
  let item = {
    [props.itemLabel]: s.value,
    [props.returnValue]: s.value,
    id: items.value.length + 1,
  }
  if (props.disableSelect) item[props.disableSelect] = true
  if (props.groupBy) item[props.groupBy] = props.data[0][props.groupBy]

  const newData = [item, ...props.data]
  emit('update:data', newData)
  select(item)
  s.value = ''
}

const toggle = () => {
  if (props.disabled) return
  open.value = !open.value
  if (!open.value) s.value = ''
  setError.value = open.value ? false : props.error
  if (open.value && props.fixedPosition) {
    nextTick(() => calculatePosition())
  }
  if (props.search && open.value) {
    setTimeout(() => searchInputRef.value?.focus(), 100)
  }
}

const calculatePosition = () => {
  const selectBox = selectBoxRef.value
  if (selectBox) {
    const rect = selectBox.getBoundingClientRect()
    const windowHeight = window.innerHeight
    const dropdownHeight = 300
    let topPos = rect.bottom
    let newOpenDirection = 'down'

    const isMarketingAddRoute = route.name === 'marketing.queues.add'
    const spaceBelow = windowHeight - rect.bottom
    const spaceAbove = rect.top

    if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
      newOpenDirection = 'up'
    } else {
      newOpenDirection = 'down'
    }

    if (newOpenDirection === 'up') {
      topPos = rect.top - dropdownHeight + 76 // Ajuste conforme necessário
    } else {
      topPos = rect.bottom + 12 // Ajuste
    }

    openDirection.value = newOpenDirection
    dropdownPosition.value = {
      top: `${topPos}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
    }
  }
}

const handleResize = () => {
  if (open.value && props.fixedPosition) calculatePosition()
}

const handleScroll = () => {
  if (open.value && props.fixedPosition) calculatePosition()
}

const close = (e) => {
  if (selectSectionRef.value && !selectSectionRef.value.contains(e.target)) {
    if (props.error) {
      setError.value =
        !selecteds.value ||
        (Array.isArray(selecteds.value) && selecteds.value.length === 0) ||
        selecteds.value === ''
    }
    open.value = false
  }
}

const cancel = (event) => {
  if (event) emit('cancel')
  if (props.ajaxSearch && s.value.length > 0) {
    emit('search', { search: '', nextPage: false })
  }
  open.value = false
  s.value = ''
  lastSearch.value = null
  items.value = []
  prepareOptions(false)
}

const separeGroups = () => {
  return props.data.reduce((a, o) => {
    let key = o[props.groupBy]
    if (!a[key]) a[key] = []
    a[key].push({ ...o, label: o[props.itemLabel] })
    return a
  }, {})
}

const prepareItem = (data, index) => {
  let text = ''
  if (props.textItems.length) {
    let textParts = props.textItems.map((key, i) => {
      let afterText = props.afterTextItem[i] || ''
      let beforeText = props.beforeTextItem[i] ? `<strong>${props.beforeTextItem[i]}</strong>` : ''
      return `${beforeText} ${data[key] || ''} ${afterText}`.trim()
    })
    text = textParts.join(' - ')
  }

  if (typeof props.data[0] !== 'object') {
    return { id: index, label: data }
  }

  return {
    ...data,
    id: data.id || index,
    cover: data[props.cover],
    label: data[props.itemLabel],
    text: text,
  }
}

const prepareOptions = (setSelected = true) => {
  selecteds.value = props.multiple ? [] : null
  if (props.groupBy) {
    items.value = separeGroups()
    if (props.data) {
      props.data.forEach((item) => {
        if (props.disableSelect && item[props.disableSelect]) select(item)
      })
    }
  } else {
    if (props.data) {
      let newItems = []
      props.data.forEach((item, index) => {
        if (props.disableSelect && item[props.disableSelect]) select(item)
        newItems.push(prepareItem(item, index))
      })
      items.value = newItems
    }
  }

  if (hasValue(selecteds.value)) emit('update:modelValue', selecteds.value)
  if (setSelected) setSelectedValues(props.modelValue)
}

const select = (item, emitEvent = true) => {
  if (props.multiple) {
    let index = selecteds.value.findIndex((x) => {
      if (props.returnValue !== 'object') return x === item[props.returnValue]
      return x.id === item.id
    })

    if (index < 0) {
      if (props.maxSelection && selecteds.value.length >= props.maxSelection) {
        if (emitEvent) emit('update:modelValue', selecteds.value)
        return toggle()
      }
      const value = props.returnValue !== 'object' ? item[props.returnValue] : item
      selecteds.value.push(value)
    } else {
      selecteds.value.splice(index, 1)
    }
    btnSelectAllLabel.value =
      selecteds.value.length === items.value.length ? 'Remover todos' : 'Selecionar todos'
    if ((!props.showApplyButton || props.ajaxSearch) && emitEvent) {
      emit('update:modelValue', selecteds.value)
    }
  } else {
    selecteds.value = !selecteds.value || item.id !== selecteds.value.id ? { ...item } : null
    if (emitEvent) {
      const valueToEmit = selecteds.value
        ? props.returnValue !== 'object'
          ? selecteds.value[props.returnValue]
          : selecteds.value
        : null
      emit('update:modelValue', valueToEmit)
    }
    toggle()
  }
}

const selectAll = () => {
  let totalItemsCount = 0
  if (Array.isArray(itemsFilter.value)) {
    totalItemsCount = itemsFilter.value.length
  } else if (typeof itemsFilter.value === 'object') {
    totalItemsCount = Object.values(itemsFilter.value).reduce(
      (sum, group) => sum + group.items.length,
      0
    )
  }

  if (selecteds.value.length === totalItemsCount) {
    // Deselect all
    selecteds.value = props.disableSelect ? props.data.filter((e) => e[props.disableSelect]) : []
  } else {
    // Select all
    let allItems = []
    if (props.groupBy) {
      itemsFilter.value.forEach((group) => allItems.push(...group.items))
    } else {
      allItems = [...itemsFilter.value]
    }
    const valuesToSelect = allItems.map((item) =>
      props.returnValue !== 'object' ? item[props.returnValue] : item
    )
    selecteds.value = valuesToSelect
  }

  btnSelectAllLabel.value =
    selecteds.value.length === totalItemsCount ? 'Remover todos' : 'Selecionar todos'
  emit('update:modelValue', selecteds.value)
}

const removeSelect = () => {
  if (props.disableSelect) {
    selecteds.value = selecteds.value.filter((e) => e[props.disableSelect])
  } else {
    selecteds.value = props.multiple ? [] : null
  }
  emit('update:modelValue', selecteds.value)
  emit('remove-select')
  cancel(true)
}

const setActive = (item) => {
  if (props.multiple) {
    if (!selecteds.value || selecteds.value.length === 0) return false
    return selecteds.value.some((x) => {
      if (props.returnValue !== 'object') return x === item[props.returnValue]
      return x.id === item.id
    })
  }
  return selecteds.value && item.id === selecteds.value.id
}

const scrollHandler = (event) => {
  const threshold = 5
  const isAtBottom =
    Math.abs(event.target.scrollHeight - event.target.scrollTop - event.target.clientHeight) <=
    threshold
  if (isAtBottom && props.ajaxSearch) {
    clearInterval(interval)
    interval = null
    emit('search', { search: s.value, nextPage: true })
  }
}

const endSelections = () => {
  toggle()
  emit('update:modelValue', selecteds.value)
}

// CICLO DE VIDA
onMounted(() => {
  prepareOptions()
  window.addEventListener('click', close)
  if (props.fixedPosition) {
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll, true)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('click', close)
  if (props.fixedPosition) {
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('scroll', handleScroll, true)
  }
  clearInterval(interval)
})
</script>

<style lang="stylus" scoped>
@import './styles.styl'
</style>