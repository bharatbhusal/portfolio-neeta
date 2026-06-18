"use client";

import { useRouter } from "next/navigation";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { apiRequest } from "@/lib/apiClient";

const STATUSES = [
	{ value: "pending", label: "Pending" },
	{ value: "reviewed", label: "Reviewed" },
	{ value: "accepted", label: "Accepted" },
	{ value: "declined", label: "Declined" },
];

type AdminRequestStatusDropdownProps = {
	requestId: string;
	currentStatus: string;
};

export function AdminRequestStatusDropdown({
	requestId,
	currentStatus,
}: AdminRequestStatusDropdownProps) {
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

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="sm">
					{STATUSES.find((s) => s.value === currentStatus)?.label ??
						currentStatus}
					<ChevronDownIcon className="ml-1 size-3.5" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-36">
				<DropdownMenuRadioGroup
					value={currentStatus}
					onValueChange={(value) => updateMutation.mutate(value)}
				>
					{STATUSES.map((s) => (
						<DropdownMenuRadioItem key={s.value} value={s.value}>
							{s.label}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
