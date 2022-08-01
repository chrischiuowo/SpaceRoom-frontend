import { setTimeout } from 'core-js'
import { defineStore } from 'pinia'

export const useModalStore = defineStore('modalStore', {
  // data
  state: () => ({
    showLoading: false,
    showLoadingText: '載入中',
    showAlert: false,
    showAlertText: [],
    showAlertCls: '',
    showImagesBox: false
  }),
  // methods
  actions: {
    lockScroll () {
      const body = document.querySelector('body')
      body.style.overflow = 'hidden'
    },
    unLockScroll () {
      const body = document.querySelector('body')
      body.style.removeProperty('overflow')
    },
    openLoading (text) {
      if (text) this.showLoadingText = text
      this.showLoading = true
    },
    closeLoading () {
      this.showLoadingText = '載入中'
      this.showLoading = false
    },
    openAlert (cls, ...info) {
      if (this.showAlert) return
      this.showAlert = true
      this.showAlertCls = cls
      info.forEach(t => {
        this.showAlertText.push(t)
      })
      setTimeout(() => {
        this.showAlert = false
        this.showAlertCls = ''
        this.showAlertText = []
      }, 2000)
    },
    controlImagesBox (control) {
      if (control) {
        this.lockScroll()
        this.showImagesBox = true
      } else {
        this.unLockScroll()
        this.showImagesBox = false
      }
    }
  }
})
