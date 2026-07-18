import { Sparkles, Droplet, Leaf } from 'lucide-react'

export function QuickInfoGrid() {
  const items = [
    {
      title: 'Why it works',
      icon: <Sparkles className="h-6 w-6" />,
      description: 'Deeply hydrates and helps strengthen the skin barrier.',
    },
    {
      title: 'How to use',
      icon: <Droplet className="h-6 w-6" />,
      description: 'After cleansing, apply to face and gently pat until absorbed.',
    },
    {
      title: 'Ingredients',
      icon: <Leaf className="h-6 w-6" />,
      description: 'Bamboo extract, Panthenol, Hyaluronic Acid.',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-charcoal/10">
      {items.map((item) => (
        <div key={item.title} className="flex gap-5 p-8 items-start">
          <div className="text-charcoal shrink-0 mt-1">{item.icon}</div>
          <div>
            <h3 className="text-sm font-medium text-charcoal mb-2">{item.title}</h3>
            <p className="text-xs text-charcoal/70 leading-relaxed">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
