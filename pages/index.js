import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Home() {
  const [cards, setCards] = useState([])

  useEffect(() => {
    fetchCards()
  }, [])

  async function fetchCards() {
    const { data } = await supabase.from('cards').select('*')
    setCards(data || [])
  }

  async function handleCSVUpload(e) {
    const file = e.target.files[0]
    const text = await file.text()

    const rows = text.split('\n').slice(1)

    const parsed = rows.map(row => {
      const cols = row.split(',')
      return {
        name: cols[0],
        set_code: cols[1],
        collector_number: cols[3],
        foil: cols[4] === 'foil',
        rarity: cols[5],
        quantity: parseInt(cols[6]),
        scryfall_id: cols[8],
        purchase_price: parseFloat(cols[9]) || 0,
        condition: cols[12],
        language: cols[13],
        currency: cols[14]
      }
    })

    await supabase.from('cards').insert(parsed)
    fetchCards()
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Meine Kartensammlung</h1>

      <input type="file" onChange={handleCSVUpload} />

      <ul>
        {cards.map(card => (
          <li key={card.id}>
            {card.name} ({card.quantity})
          </li>
        ))}
      </ul>
    </div>
  )
}
