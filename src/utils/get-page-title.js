import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Tee Production'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
