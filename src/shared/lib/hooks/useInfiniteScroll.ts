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
			const wrapperElement = wrapperRef?.current || null;
			const options = {
				root: wrapperElement,
				rootMargin: "0px",
				threshold: 1.0,
			};

			observer.current = new IntersectionObserver(([entry]) => {
				if (entry.isIntersecting) {
					callback();
				}
			}, options);

			observer.current.observe(triggerElement);
		}

		return () => {
			if (observer.current && triggerElement) {
				observer.current.unobserve(triggerElement);
			}
		};
	}, [callback, triggerRef, wrapperRef]);
}
