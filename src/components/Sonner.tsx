import { Toaster } from "@/components/ui/sonner"

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body>
        <main>{ children }</main>
        <Toaster />
        </body>
        </html>
    )
}
//          Usage
// import { toast } from "sonner"
// toast("Event has been created.")