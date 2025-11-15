import type { MutableRefObject } from "react";
import { useEffect, useRef } from "react";

export interface UseInfiniteScrollOptions {
	callback?: () => void;
	triggerRef: MutableRefObject<HTMLElement | null>;
	wrapperRef?: MutableRefObject<HTMLElement | null>;
}

export function useInfiniteScroll({
	callback,
	wrapperRef,
	triggerRef,
}: UseInfiniteScrollOptions) {
	const observer = useRef<IntersectionObserver | null>(null);

	useEffect(() => {
		const wrapperElement = wrapperRef?.current || null;
		const triggerElement = triggerRef.current;

		if (callback && triggerElement) {
			const options = {
				root: wrapperElement,
				rootMargin: "20px",
				threshold: 0.1,
			};

			observer.current = new IntersectionObserver(([entry]) => {
				if (entry.isIntersecting) {
					callback();
				} else {
					console.log(" Trigger element out of view");
				}
			}, options);

			observer.current.observe(triggerElement);
		} else {
		}

		return () => {
			if (observer.current && triggerElement) {
				observer.current.unobserve(triggerElement);
			}
		};
	}, [callback, triggerRef, wrapperRef]);
}
