import { auth, signOut } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Metadata } from "next"
import type { Session } from "next-auth"

export const metadata: Metadata = {
  title: "Dashboard",
}

// Stat card data shape
interface StatCard {
  label: string
  value: string
}

const statCards: StatCard[] = [
  { label: "Projects", value: "—" },
  { label: "Posts", value: "—" },
  { label: "References", value: "—" },
  { label: "Messages", value: "—" },
]

export default async function AdminDashboardPage() {
  const session: Session | null = await auth()

  if (!session) {
    redirect("/admin/login")
  }

  const displayName: string = session.user.name ?? session.user.email ?? "Admin"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {displayName}
          </p>
        </div>

        <form
          action={async (): Promise<void> => {
            "use server"
            await signOut({ redirectTo: "/admin/login" })
          }}
        >
          <Button variant="outline" type="submit">
            Sign Out
          </Button>
        </form>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card: StatCard) => (
          <Card key={card.label}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}