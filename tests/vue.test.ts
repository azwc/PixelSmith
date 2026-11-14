import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import PxButton from '../src/vue/components/PxButton.vue'
import PxSwitch from '../src/vue/components/PxSwitch.vue'
import PxTabs from '../src/vue/components/PxTabs.vue'
import PxModal from '../src/vue/components/PxModal.vue'

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
