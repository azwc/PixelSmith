import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import PxAccordion from '../src/vue/components/PxAccordion.vue'
import PxBreadcrumb from '../src/vue/components/PxBreadcrumb.vue'
import PxButton from '../src/vue/components/PxButton.vue'
import PxModal from '../src/vue/components/PxModal.vue'
import PxPagination from '../src/vue/components/PxPagination.vue'
import PxSegmented from '../src/vue/components/PxSegmented.vue'
import PxSkeleton from '../src/vue/components/PxSkeleton.vue'
import PxSlider from '../src/vue/components/PxSlider.vue'
import PxSwitch from '../src/vue/components/PxSwitch.vue'
import PxTabs from '../src/vue/components/PxTabs.vue'

afterEach(() => {
  document.body.innerHTML = ''
  document.body.className = ''
})

describe('PxButton', () => {
  it('renders variants and emits clicks', async () => {
    const wrapper = mount(PxButton, {
      props: { tone: 'danger', size: 'lg' },
      slots: { default: 'Delete' }
    })

    expect(wrapper.classes()).toContain('pix-btn--danger')
    expect(wrapper.classes()).toContain('pix-btn--lg')
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('does not emit while loading', () => {
    const wrapper = mount(PxButton, { props: { loading: true }, slots: { default: 'Wait' } })
    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.attributes('aria-busy')).toBe('true')
  })
})

describe('PxTabs', () => {
  const tabs = [
    { id: 'design', label: 'Design' },
    { id: 'code', label: 'Code' }
  ]

  it('switches panels and emits the active id', async () => {
    const wrapper = mount(PxTabs, {
      props: { tabs, modelValue: 'design' },
      slots: {
        'panel-design': '<p class="one">Design panel</p>',
        'panel-code': '<p class="two">Code panel</p>'
      }
    })

    expect(wrapper.find('.one').exists()).toBe(true)
    const buttons = wrapper.findAll('[role="tab"]')
    await buttons[1]?.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['code'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['code'])
    expect(wrapper.find('.two').exists()).toBe(true)
  })

  it('moves with arrow keys', async () => {
    const wrapper = mount(PxTabs, {
      props: { tabs, modelValue: 'design' },
      attachTo: document.body
    })
    const first = wrapper.findAll('[role="tab"]')[0]
    await first?.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['code'])
  })
})

describe('PxSwitch', () => {
  it('emits the new checked state', async () => {
    const wrapper = mount(PxSwitch, {
      props: { modelValue: false, label: 'Auto-pilot' }
    })
    const input = wrapper.find('input')
    expect(input.attributes('role')).toBe('switch')

    await input.setValue(true)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
  })
})

describe('PxModal', () => {
  it('teleports, locks the page and closes on escape', async () => {
    const wrapper = mount(PxModal, {
      props: { modelValue: false, title: 'Deploy?' },
      slots: { default: '<button type="button">Confirm</button>' },
      attachTo: document.body
    })

    await wrapper.setProps({ modelValue: true })
    await nextTick()

    const modal = document.querySelector('.pix-modal')
    expect(modal).not.toBeNull()
    expect(modal?.classList.contains('is-open')).toBe(true)
    expect(document.body.classList.contains('pix-modal-open')).toBe(true)
    expect(wrapper.emitted('open')).toHaveLength(1)

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])

    await wrapper.setProps({ modelValue: false })
    await nextTick()
    expect(document.querySelector('.pix-modal')).toBeNull()
    expect(document.body.classList.contains('pix-modal-open')).toBe(false)
    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})

describe('PxAccordion', () => {
  const items = [
    { id: 'a11y', label: 'Accessibility' },
    { id: 'theme', label: 'Theming' }
  ]

  it('renders native details and emits the open ids', async () => {
    const wrapper = mount(PxAccordion, {
      props: { items, modelValue: [] },
      slots: { 'panel-a11y': '<p class="a11y-body">Native details</p>' }
    })

    expect(wrapper.findAll('details')).toHaveLength(2)
    expect(wrapper.find('.a11y-body').exists()).toBe(true)

    const details = wrapper.findAll('details')[0]!.element as HTMLDetailsElement
    details.open = true
    details.dispatchEvent(new Event('toggle'))
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['a11y']])
    expect(wrapper.emitted('change')?.[0]).toEqual([['a11y']])
  })

  it('keeps a single panel open in exclusive mode', async () => {
    const wrapper = mount(PxAccordion, { props: { items, exclusive: true, modelValue: ['a11y'] } })
    const second = wrapper.findAll('details')[1]!.element as HTMLDetailsElement
    second.open = true
    second.dispatchEvent(new Event('toggle'))
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['theme']])
  })
})

describe('PxBreadcrumb', () => {
  it('marks the last item as the current page', () => {
    const wrapper = mount(PxBreadcrumb, {
      props: {
        items: [
          { label: 'Suite', href: '#top' },
          { label: 'Components', href: '#components' },
          { label: 'Navigation' }
        ]
      }
    })
    const current = wrapper.findAll('.pix-breadcrumb__current')
    expect(current).toHaveLength(1)
    expect(current[0]!.attributes('aria-current')).toBe('page')
    expect(wrapper.findAll('.pix-breadcrumb__link')).toHaveLength(2)
  })
})

describe('PxPagination', () => {
  it('windows long page lists and emits the chosen page', async () => {
    const wrapper = mount(PxPagination, { props: { modelValue: 5, pages: 20 } })
    const items = wrapper.findAll('.pix-pagination__item')
    expect(wrapper.findAll('.pix-pagination__ellipsis').length).toBeGreaterThan(0)
    expect(items.some((item) => item.text() === '5' && item.attributes('aria-current') === 'page')).toBe(true)

    const next = items[items.length - 1]!
    await next.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([6])
  })

  it('clamps the page and disables prev at the start', () => {
    const wrapper = mount(PxPagination, { props: { modelValue: -3, pages: 4 } })
    const prev = wrapper.findAll('.pix-pagination__item')[0]!
    expect(prev.attributes('disabled')).toBeDefined()
    expect(wrapper.findAll('.pix-pagination__item').some((item) => item.attributes('aria-current') === 'page')).toBe(true)
  })
})

describe('PxSkeleton', () => {
  it('stacks text lines and exposes a status role when labelled', () => {
    const wrapper = mount(PxSkeleton, { props: { variant: 'text', lines: 3, label: 'Loading profile' } })
    expect(wrapper.findAll('.pix-skeleton')).toHaveLength(3)
    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.attributes('aria-label')).toBe('Loading profile')
  })
})

describe('PxSlider', () => {
  it('forwards range bounds and emits numbers', async () => {
    const wrapper = mount(PxSlider, { props: { modelValue: 40, min: 10, max: 90, step: 5 } })
    const input = wrapper.find('input[type="range"]')
    expect(input.attributes('min')).toBe('10')
    expect(input.attributes('max')).toBe('90')
    expect(input.attributes('step')).toBe('5')

    await input.setValue('65')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([65])
  })
})

describe('PxSegmented', () => {
  it('renders a radio group and emits the selected value', async () => {
    const wrapper = mount(PxSegmented, {
      props: {
        modelValue: 'grid',
        options: [
          { label: 'Grid', value: 'grid' },
          { label: 'List', value: 'list' }
        ]
      }
    })
    expect(wrapper.attributes('role')).toBe('radiogroup')
    const radios = wrapper.findAll('input[type="radio"]')
    expect(radios).toHaveLength(2)
    expect(radios[0]!.attributes('checked')).toBeDefined()

    await radios[1]!.trigger('change')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['list'])
  })
})

