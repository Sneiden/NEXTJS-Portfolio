import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Dashboard" }

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-neutral-900">Dashboard</h1>
        <p className="font-mono text-xs text-neutral-400 mt-1 tracking-wider uppercase">
          Overview
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Projects", value: "—" },
          { label: "References", value: "—" },
          { label: "Messages", value: "—" },
          { label: "Available", value: "Yes" },
        ].map((card) => (
          <Card key={card.label} className="rounded-none border-neutral-200">
            <CardHeader className="pb-2">
              <CardTitle className="font-mono text-xs text-neutral-400 uppercase tracking-wider">
                {card.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-serif text-3xl text-neutral-900">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}