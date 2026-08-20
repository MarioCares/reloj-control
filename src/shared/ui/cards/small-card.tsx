import type { PropsWithChildren } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type CardSmallProps = {
	title: string;
	description: string;
	actionText: string;
	onClick(): void;
	isLoading: boolean;
};

export function CardSmall({
	title,
	description,
	actionText,
	isLoading,
	children,
	onClick,
}: PropsWithChildren<CardSmallProps>) {
	return (
		<Card size="sm" className="w-full flex h-full flex-col">
			<CardHeader>
				<CardTitle>
					{isLoading ? <Skeleton className="h-4 w-2/3" /> : title}
				</CardTitle>
				<CardDescription>
					{isLoading ? <Skeleton className="h-4 w-2/3" /> : description}
				</CardDescription>
			</CardHeader>
			<CardContent className="flex-1">
				{isLoading ? <Skeleton className="aspect-video w-full" /> : children}
			</CardContent>
			<CardFooter>
				{isLoading ? (
					<Skeleton className="h-8 w-24" />
				) : (
					<Button
						variant="outline"
						size="sm"
						className="w-full"
						onClick={onClick}
					>
						{actionText}
					</Button>
				)}
			</CardFooter>
		</Card>
	);
}
