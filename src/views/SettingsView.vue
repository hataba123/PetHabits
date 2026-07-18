<script setup lang="ts">
import { ref } from 'vue'

import { applyTheme } from '../composables/useTheme'
import type { ThemeMode } from '../models'
import { exportState, importState } from '../services/localStorageService'
import { useAppStore } from '../stores/appStore'
import { useCompanionStore } from '../stores/companionStore'

const appStore = useAppStore()
const companionStore = useCompanionStore()
const displayName = ref(appStore.profile.displayName)
const futureIdentity = ref(appStore.profile.futureIdentity)
const companionName = ref(appStore.companion.name)
const profileError = ref('')
const companionError = ref('')
const feedbackMessage = ref('')
const errorMessage = ref('')
const isImporting = ref(false)

function showSuccess(message: string): void {
  feedbackMessage.value = message
  errorMessage.value = ''
}

function showError(message: string): void {
  errorMessage.value = message
  feedbackMessage.value = ''
}

function saveProfile(): void {
  profileError.value = ''

  if (!displayName.value.trim()) {
    profileError.value = 'Tên hiển thị không được để trống.'
    return
  }

  if (!appStore.updateProfile({ displayName: displayName.value, futureIdentity: futureIdentity.value })) {
    profileError.value = 'Tên hiển thị tối đa 150 ký tự, bản sắc tối đa 2000 ký tự.'
    return
  }

  showSuccess('Đã lưu hồ sơ của bạn.')
}

function saveCompanionName(): void {
  companionError.value = ''

  if (!appStore.updateCompanionName(companionName.value)) {
    companionError.value = 'Tên companion không được trống và tối đa 80 ký tự.'
    return
  }

  showSuccess('Đã đổi tên bạn đồng hành.')
}

function changeTheme(theme: ThemeMode): void {
  appStore.updateSettings({ theme })
  applyTheme(theme)
  showSuccess('Đã cập nhật giao diện.')
}

function downloadBackup(): void {
  const content = exportState(appStore.appState)
  const blob = new Blob([content], { type: 'application/json;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `pethabits-backup-${new Date().toISOString().slice(0, 10)}.json`
  link.click()
  URL.revokeObjectURL(url)
  showSuccess('Đã chuẩn bị tệp sao lưu JSON.')
}

async function handleImport(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) {
    return
  }

  isImporting.value = true
  errorMessage.value = ''

  try {
    const content = await file.text()
    const nextState = importState(content)

    if (!window.confirm('Import sẽ thay thế toàn bộ dữ liệu hiện tại. Tiếp tục?')) {
      return
    }

    if (!appStore.replaceState(nextState)) {
      throw new Error('Dữ liệu import không hợp lệ.')
    }

    companionStore.syncFromLogs()
    displayName.value = appStore.profile.displayName
    futureIdentity.value = appStore.profile.futureIdentity
    companionName.value = appStore.companion.name
    showSuccess('Đã import dữ liệu thành công.')
  } catch (error) {
    showError(error instanceof Error ? error.message : 'Không thể import tệp dữ liệu.')
  } finally {
    isImporting.value = false
    input.value = ''
  }
}

function resetAllData(): void {
  if (!window.confirm('Reset toàn bộ dữ liệu PetHabits? Hành động này không thể hoàn tác nếu bạn chưa export.')) {
    return
  }

  appStore.resetState()
  displayName.value = ''
  futureIdentity.value = ''
  companionName.value = appStore.companion.name
  showSuccess('Đã reset dữ liệu. Bạn có thể bắt đầu lại bất cứ lúc nào.')
}
</script>

<template>
  <section>
    <div class="page-intro">
      <p class="eyebrow">Không gian của bạn</p>
      <h1>Cài đặt</h1>
      <p>Giữ dữ liệu trong tay bạn và điều chỉnh trải nghiệm theo nhịp sống riêng.</p>
    </div>

    <p v-if="feedbackMessage" class="feedback feedback--success" role="status">{{ feedbackMessage }}</p>
    <p v-if="errorMessage" class="feedback feedback--error" role="alert">{{ errorMessage }}</p>

    <div class="settings-layout">
      <div class="settings-main">
        <form class="settings-card" @submit.prevent="saveProfile">
          <div class="settings-card__heading"><div><span class="eyebrow">Hồ sơ</span><h2>Phiên bản bạn đang xây dựng</h2></div><span aria-hidden="true">✍️</span></div>
          <div class="form-grid">
            <label class="field field--wide"><span>Tên hiển thị</span><input v-model="displayName" type="text" maxlength="150" placeholder="Tên của bạn" /><small v-if="profileError" class="field-error">{{ profileError }}</small></label>
            <label class="field field--wide"><span>Tôi muốn trở thành</span><textarea v-model="futureIdentity" rows="4" maxlength="2000" placeholder="Một developer có kỷ luật, học hỏi liên tục..."></textarea></label>
          </div>
          <div class="form-actions"><button class="button button--primary" type="submit">Lưu hồ sơ</button></div>
        </form>

        <form class="settings-card" @submit.prevent="saveCompanionName">
          <div class="settings-card__heading"><div><span class="eyebrow">Bạn đồng hành</span><h2>Đặt tên cho người bạn nhỏ</h2></div><span class="settings-card__emoji" aria-hidden="true">🥚</span></div>
          <label class="field"><span>Tên companion</span><input v-model="companionName" type="text" maxlength="80" placeholder="Ví dụ: Mầm" /><small v-if="companionError" class="field-error">{{ companionError }}</small></label>
          <div class="form-actions"><button class="button button--primary" type="submit">Lưu tên</button></div>
        </form>
      </div>

      <aside class="settings-sidebar">
        <div class="settings-card"><div class="settings-card__heading"><div><span class="eyebrow">Hiển thị</span><h2>Giao diện</h2></div><span aria-hidden="true">🎨</span></div><div class="theme-options"><button v-for="option in ([['system', 'Theo hệ thống'], ['light', 'Sáng'], ['dark', 'Tối']] as [ThemeMode, string][])" :key="option[0]" class="theme-option" :class="{ 'theme-option--active': appStore.settings.theme === option[0] }" type="button" @click="changeTheme(option[0])">{{ option[1] }}</button></div></div>

        <div class="settings-card"><div class="settings-card__heading"><div><span class="eyebrow">Dữ liệu</span><h2>Sao lưu & khôi phục</h2></div><span aria-hidden="true">🗂️</span></div><p class="settings-help">Dữ liệu chỉ nằm trên thiết bị này. Hãy export thường xuyên để giữ một bản sao an toàn.</p><button class="button button--primary button--full" type="button" @click="downloadBackup">Export JSON</button><label class="button button--ghost button--full file-button" :class="{ 'button--disabled': isImporting }">{{ isImporting ? 'Đang import...' : 'Import JSON' }}<input class="sr-only" type="file" accept="application/json,.json" :disabled="isImporting" @change="handleImport" /></label></div>

        <div class="settings-card settings-card--danger"><div class="settings-card__heading"><div><span class="eyebrow">Khu vực thận trọng</span><h2>Reset dữ liệu</h2></div><span aria-hidden="true">⚠️</span></div><p class="settings-help">Xóa toàn bộ hồ sơ, thói quen, lịch sử và tiến trình companion.</p><button class="button button--danger button--full" type="button" @click="resetAllData">Reset toàn bộ</button></div>
      </aside>
    </div>
  </section>
</template>
