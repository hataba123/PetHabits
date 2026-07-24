import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import CompanionAvatar from './CompanionAvatar.vue'

const companionProps = {
  shape: 'cat' as const,
  growthStage: 'baby' as const,
}

describe('CompanionAvatar', () => {
  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  it('plays and resets the friendly reaction when clicked', async () => {
    vi.useFakeTimers()
    const wrapper = mount(CompanionAvatar, { props: companionProps })

    expect(wrapper.attributes('role')).toBe('button')
    expect(wrapper.attributes('tabindex')).toBe('0')

    await wrapper.trigger('click')
    await nextTick()

    expect(wrapper.classes()).toContain('companion-avatar--celebrating')
    expect(wrapper.attributes('data-state')).toBe('celebrating')

    vi.advanceTimersByTime(650)
    await nextTick()

    expect(wrapper.classes()).not.toContain('companion-avatar--celebrating')
    expect(wrapper.attributes('data-state')).toBe('idle')
  })

  it('supports the Enter and Space keys', async () => {
    const wrapper = mount(CompanionAvatar, { props: companionProps })

    await wrapper.trigger('keydown', { key: 'Enter' })
    await nextTick()
    expect(wrapper.classes()).toContain('companion-avatar--celebrating')

    await wrapper.trigger('keydown', { key: ' ' })
    await nextTick()
    expect(wrapper.classes()).toContain('companion-avatar--celebrating')
  })

  it('stays decorative inside companion selection buttons', async () => {
    const wrapper = mount(CompanionAvatar, {
      props: { ...companionProps, variant: 'option' },
    })

    await wrapper.trigger('click')
    await nextTick()

    expect(wrapper.attributes('role')).toBeUndefined()
    expect(wrapper.attributes('aria-hidden')).toBe('true')
    expect(wrapper.classes()).not.toContain('companion-avatar--celebrating')
  })
})
