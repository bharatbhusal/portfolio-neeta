"use client";

import { RefObject, useEffect } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type UseGSAPOptions = {
	scope: RefObject<HTMLElement | null>;
	enabled?: boolean;
};

export function useGSAP({
	scope,
	enabled = true,
}: UseGSAPOptions) {
	useEffect(() => {
		if (!enabled || !scope.current) {
			return;
		}

		const root = scope.current;
		const hoverListeners: Array<{
			element: HTMLElement;
			enter: () => void;
			leave: () => void;
		}> = [];

		const context = gsap.context(() => {
			const reveals = Array.from(
				root.querySelectorAll<HTMLElement>("[data-reveal]"),
			);

			if (reveals.length > 0) {
				gsap.fromTo(
					reveals,
					{ opacity: 0, y: 24 },
					{
						opacity: 1,
						y: 0,
						duration: 0.9,
						ease: "power3.out",
						stagger: 0.12,
						scrollTrigger: {
							trigger: root,
							start: "top 80%",
						},
					},
				);
			}

			const hovers = Array.from(
				root.querySelectorAll<HTMLElement>("[data-hover-lift]"),
			);

			hovers.forEach((element) => {
				const tween = gsap.to(element, {
					y: -8,
					scale: 1.01,
					duration: 0.24,
					ease: "power2.out",
					paused: true,
				});

				const enter = () => tween.play();
				const leave = () => tween.reverse();

				element.addEventListener("mouseenter", enter);
				element.addEventListener("mouseleave", leave);
				element.addEventListener("focusin", enter);
				element.addEventListener("focusout", leave);

				hoverListeners.push({ element, enter, leave });
			});
		}, root);

		return () => {
			context.revert();

			hoverListeners.forEach(({ element, enter, leave }) => {
				element.removeEventListener("mouseenter", enter);
				element.removeEventListener("mouseleave", leave);
				element.removeEventListener("focusin", enter);
				element.removeEventListener("focusout", leave);
			});
		};
	}, [enabled, scope]);
}
