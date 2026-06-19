"use client";

import { useRouter } from "next/navigation";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { useMutation } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { apiRequest } from "@/lib/apiClient";
import { STATUS_LABELS, STATUS_VARIANTS, STATUS_FILTERS } from "@/lib/constants";

type RequestStatusControlProps = {
	requestId: string;
	currentStatus: string;
	isAdmin: boolean;
};

export function RequestStatusControl({
	requestId,
	currentStatus,
	isAdmin,
}: RequestStatusControlProps) {
	const router = useRouter();

	const updateMutation = useMutation({
		mutationFn: (newStatus: string) =>
			apiRequest(`/api/requests/${requestId}`, {
				method: "PATCH",
				body: { status: newStatus },
			}),
		onSuccess: () => {
			router.refresh();
		},
	});

	if (!isAdmin) {
		return (
			<Badge variant={STATUS_VARIANTS[currentStatus] ?? "outline"}>
				{STATUS_LABELS[currentStatus] ?? currentStatus}
			</Badge>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="sm">
					{STATUS_LABELS[currentStatus] ??
						currentStatus}
					<ChevronDownIcon className="ml-1 size-3.5" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-36">
				<DropdownMenuRadioGroup
					value={currentStatus}
					onValueChange={(value) => updateMutation.mutate(value)}
				>
					{STATUS_FILTERS.filter((s) => s.value !== "all").map((s) => (
						<DropdownMenuRadioItem key={s.value} value={s.value}>
							{s.label}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
