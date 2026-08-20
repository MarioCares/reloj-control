import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/modules/identity/frontend/auth-client";

export function AuthenticatedNavbar() {
	const navigate = useNavigate();
	const { data: session, isPending } = authClient.useSession();

	async function handleSignOut() {
		await authClient.signOut();

		await navigate({
			to: "/login",
			replace: true,
		});
	}

	const userName = session?.user?.name ?? session?.user?.email ?? "Usuario";
	const userEmail = session?.user?.email;

	return (
		<header className="border-b bg-background">
			<div className="mx-auto flex h-14 w-full items-center justify-between px-6">
				<nav>
					<Link to="/dashboard" className="text-sm font-medium hover:underline">
						Dashboard
					</Link>
				</nav>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="sm" disabled={isPending}>
							{isPending ? "Cargando..." : userName}
						</Button>
					</DropdownMenuTrigger>

					<DropdownMenuContent align="end" className="w-56">
						<DropdownMenuLabel>
							<div className="flex flex-col">
								<span>{userName}</span>
								{userEmail ? (
									<span className="text-xs font-normal text-muted-foreground">
										{userEmail}
									</span>
								) : null}
							</div>
						</DropdownMenuLabel>

						<DropdownMenuSeparator />

						<DropdownMenuItem onClick={handleSignOut}>
							Cerrar sesión
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	);
}
