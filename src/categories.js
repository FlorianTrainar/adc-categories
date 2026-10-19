export const fluidOptions = [
  { id: 'ff', label: 'HFC / HFO', detail: 'Fluides fluorés' },
  { id: 'hc', label: 'Hydrocarbures', detail: 'HC · R-290, R-600a' },
  { id: 'co2', label: 'Dioxyde de carbone', detail: 'CO₂ · R-744' },
  { id: 'nh3', label: 'Ammoniac', detail: 'NH₃ · R-717' },
]
export const installationOptions = [
  {
    id: 'fixed',
    label: 'Tout type (hors véhicules)',
    detail: 'Climatisation, pompes à chaleur et froid',
  },
  {
    id: 'vehicle',
    label: 'Véhicules à moteur',
    detail: 'Voitures, camions et engins agricoles.',
  },
]
export const operationOptions = [
  {
    id: 'all',
    label: 'Toutes interventions · sans limite de charge',
    detail: 'Installation, maintenance, charge et récupération',
  },
  {
    id: 'limited',
    label: 'Toutes interventions · charges limitées',
    detail: 'Moins de 3 kg, ou moins de 6 kg si le système est hermétiquement scellé',
  },
  {
    id: 'recovery',
    label: 'Récupération uniquement',
    detail: 'Hors véhicules : moins de 3 kg pour la catégorie D',
  },
  {
    id: 'leak',
    label: 'Contrôle d’étanchéité uniquement',
    detail: 'Sans ouverture du circuit frigorifique',
  },
]

// Référentiel fourni par le client, sans extrapolation aux véhicules à fluides non fluorés.
export function recommend({ fluids, installations, operations }) {
  if (!fluids.length || !installations.length || !operations.length) {
    return { categories: [], complete: false }
  }

  const codes = new Set()
  const has = (id) => operations.includes(id)
  const ff = fluids.includes('ff')
  const hc = fluids.includes('hc')

  if (installations.includes('fixed')) {
    if (fluids.includes('co2')) codes.add('B')
    if (fluids.includes('nh3')) codes.add('C')

    if (has('all') || has('limited')) {
      if (ff || hc) {
        const base = has('all') ? 'A1' : 'A2'
        const suffix = ff && hc ? '' : ff ? ' FF' : ' HC'
        codes.add(base + suffix)
      }
    } else if (ff) {
      if (has('recovery')) codes.add('D')
      if (has('leak')) codes.add('E')
    }
  }

  if (installations.includes('vehicle') && ff) {
    if (has('all') || has('limited')) {
      codes.add('V')
    } else {
      if (has('recovery')) codes.add('D')
      if (has('leak')) codes.add('E')
    }
  }

  return { categories: [...codes].sort().map((code) => ({ code })), complete: true }
}
