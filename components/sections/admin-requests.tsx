"use client";

import { useCallback, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Search } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Badge } from "@/components/ui/badge";
import {
	InputGroup,
	InputGroupInput,
	InputGroupAddon,
} from "@/components/ui/input-group";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { apiRequest, ApiClientError } from "@/lib/apiClient";
import type { ProjectRequest } from "@/types/portfolio";
import type { ProjectRequestUpdate } from "@/lib/validators";

type PaginationData = {
	page: number;
	pageSize: number;
	total: number;
	totalPages: number;
};

type SortBy = "createdAt" | "name" | "brandName" | "status" | "logoType";
type SortOrder = "asc" | "desc";

type AdminRequestsContentProps = {
	requests: ProjectRequest[];
	pagination: PaginationData;
	currentStatus: string;
	currentQuery: string;
	currentSortBy: SortBy;
	currentSortOrder: SortOrder;
};

const STATUS_CONFIG: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
	pending: { label: "Pending", variant: "outline" },
	reviewed: { label: "Reviewed", variant: "secondary" },
	accepted: { label: "Accepted", variant: "default" },
	declined: { label: "Declined", variant: "destructive" },
};

const LOGO_TYPE_LABELS: Record<string, string> = {
	text_logo: "Wordmark",
	icon_logo: "Icon Logo",
	combination_logo: "Combination",
	mascot_logo: "Mascot",
	abstract_logo: "Abstract",
};

const STATUS_FILTERS = [
	{ label: "All", value: "all" },
	{ label: "Pending", value: "pending" },
	{ label: "Reviewed", value: "reviewed" },
	{ label: "Accepted", value: "accepted" },
	{ label: "Declined", value: "declined" },
];

const STATUS_LABEL: Record<string, string> = {
	all: "All",
	pending: "Pending",
	reviewed: "Reviewed",
	accepted: "Accepted",
	declined: "Declined",
};

const SORT_OPTIONS: { label: string; value: SortBy }[] = [
	{ label: "Date", value: "createdAt" },
	{ label: "Name", value: "name" },
	{ label: "Brand", value: "brandName" },
	{ label: "Status", value: "status" },
];

const DEFAULT_SORT: SortBy = "createdAt";
const DEFAULT_ORDER: SortOrder = "desc";

function buildUrl(
	page: number,
	status: string,
	q: string,
	sortBy: SortBy,
	sortOrder: SortOrder,
) {
	const params = new URLSearchParams();
	params.set("page", String(page));
	if (status && status !== "all") params.set("status", status);
	if (q) params.set("q", q);
	if (sortBy !== DEFAULT_SORT || sortOrder !== DEFAULT_ORDER) {
		params.set("sortBy", sortBy);
		params.set("sortOrder", sortOrder);
	}
	return `/admin/requests?${params.toString()}`;
}

function sortDefaultOrder(field: SortBy): SortOrder {
	return field === "createdAt" ? "desc" : "asc";
}

export function AdminRequestsContent({
	requests,
	pagination,
	currentStatus,
	currentQuery,
	currentSortBy,
	currentSortOrder,
}: AdminRequestsContentProps) {
	const router = useRouter();
	const [searchValue, setSearchValue] = useState(currentQuery);

	useEffect(() => {
		const handle = setTimeout(() => {
			const trimmed = searchValue.trim();
			if (trimmed !== currentQuery) {
				router.push(
					buildUrl(
						1,
						currentStatus,
						trimmed,
						currentSortBy,
						currentSortOrder,
					),
				);
			}
		}, 300);
		return () => clearTimeout(handle);
	}, [
		searchValue,
		currentStatus,
		currentQuery,
		currentSortBy,
		currentSortOrder,
		router,
	]);

	const handleStatusFilter = useCallback(
		(status: string) => {
			router.push(
				buildUrl(1, status, currentQuery, currentSortBy, currentSortOrder),
			);
		},
		[currentQuery, currentSortBy, currentSortOrder, router],
	);

	const handleSortChange = useCallback(
		(field: SortBy) => {
			const newSortOrder =
				field === currentSortBy
					? currentSortOrder === "asc" ? "desc" : "asc"
					: sortDefaultOrder(field);
			router.push(
				buildUrl(1, currentStatus, currentQuery, field, newSortOrder),
			);
		},
		[currentStatus, currentQuery, currentSortBy, currentSortOrder, router],
	);

	const handlePageChange = useCallback(
		(newPage: number) => {
			router.push(
				buildUrl(newPage, currentStatus, currentQuery, currentSortBy, currentSortOrder),
			);
		},
		[currentStatus, currentQuery, currentSortBy, currentSortOrder, router],
	);

	const sortArrow = (field: SortBy) => {
		if (currentSortBy !== field) return "";
		return currentSortOrder === "desc" ? " ↓" : " ↑";
	};

	return (
		<div className="space-y-4">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-wrap items-center gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm">
								{STATUS_LABEL[currentStatus] ?? "All"}
								<ChevronDownIcon className="ml-1 size-3.5" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start" className="w-36">
							<DropdownMenuRadioGroup
								value={currentStatus}
								onValueChange={handleStatusFilter}
							>
								{STATUS_FILTERS.map((f) => (
									<DropdownMenuRadioItem key={f.value} value={f.value}>
										{f.label}
									</DropdownMenuRadioItem>
								))}
							</DropdownMenuRadioGroup>
						</DropdownMenuContent>
					</DropdownMenu>

					<ButtonGroup>
						{SORT_OPTIONS.map((opt) => (
							<Button
								key={opt.value}
								variant={
									currentSortBy === opt.value
										? "default"
										: "outline"
								}
								size="sm"
								onClick={() => handleSortChange(opt.value)}
							>
								{opt.label}
								{sortArrow(opt.value)}
							</Button>
						))}
					</ButtonGroup>
				</div>

				<div className="w-full sm:w-72">
					<InputGroup>
						<InputGroupAddon>
							<Search />
						</InputGroupAddon>
						<InputGroupInput
							type="search"
							value={searchValue}
							onChange={(e) => setSearchValue(e.target.value)}
							placeholder="Search by name, brand, email"
						/>
						<InputGroupAddon align="inline-end">
							{pagination.total}
						</InputGroupAddon>
					</InputGroup>
				</div>
			</div>

			{requests.length === 0 ? (
				<div className="rounded-2xl border border-border/60 bg-card/60 p-8 shadow-sm text-center">
					<p className="text-muted-foreground">
						No requests found.
					</p>
				</div>
			) : (
				<div className="space-y-3">
					{requests.map((request) => {
						const statusConfig =
							STATUS_CONFIG[request.status] ?? STATUS_CONFIG.pending;

						return (
							<Link
								key={request._id}
								href={`/request/${request._id}`}
								className="block rounded-2xl border border-border/60 bg-card/60 p-4 shadow-sm space-y-2 hover:border-foreground/30 transition-colors"
							>
								<div className="flex items-start justify-between gap-3">
									<div className="space-y-1 min-w-0">
										<h3 className="font-semibold truncate">
											{request.brandName}
										</h3>
										<p className="text-sm text-muted-foreground">
											{request.name} — {request.email}
										</p>
									</div>
									<Badge variant={statusConfig.variant}>
										{statusConfig.label}
									</Badge>
								</div>

								<div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
									{request.logoType && (
										<span>
											{LOGO_TYPE_LABELS[request.logoType] ?? request.logoType}
										</span>
									)}
									{request.phone && <span>{request.phone}</span>}
									<span>
										{new Date(request.createdAt).toLocaleDateString("en-IN", {
											day: "numeric",
											month: "short",
											year: "numeric",
										})}
									</span>
								</div>

								{request.businessDescription && (
									<p className="text-sm text-muted-foreground line-clamp-2">
										{request.businessDescription}
									</p>
								)}
							</Link>
						);
					})}
				</div>
			)}

			{pagination.totalPages > 1 && (
				<div className="flex items-center justify-between gap-3">
					<Button
						variant="outline"
						size="sm"
						onClick={() =>
							handlePageChange(
								pagination.page <= 1
									? pagination.totalPages
									: pagination.page - 1,
							)
						}
					>
						Previous
					</Button>
					<p className="text-sm text-muted-foreground">
						Page {pagination.page} of {pagination.totalPages}
					</p>
					<Button
						variant="outline"
						size="sm"
						onClick={() =>
							handlePageChange(
								pagination.page >= pagination.totalPages
									? 1
									: pagination.page + 1,
							)
						}
					>
						Next
					</Button>
				</div>
			)}
		</div>
	);
}
